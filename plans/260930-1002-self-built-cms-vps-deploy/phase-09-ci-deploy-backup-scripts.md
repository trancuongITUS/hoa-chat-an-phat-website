---
phase: 9
title: "Phase 9: CI/CD, script deploy, sao lưu và khôi phục"
status: todo
priority: P1
effort: "2d"
dependencies: [8]
---

# Phase 9: CI/CD, script deploy, sao lưu và khôi phục

<!-- Updated: Red Team 2026-09-30 - deploy lần đầu, thứ tự ghi tag an toàn, rollback không chạy migrate, backup mã hoá và không xoá được, restore vào DB trống, sao lưu ảnh, amd64 mặc định, ghim action theo SHA -->
<!-- Updated: Validation 2026-09-30 - ảnh trên đĩa nên backup gồm cả thư mục media; production khởi tạo bằng khung cài đặt -->

## Overview

GitHub Actions build image và đẩy lên GHCR; VPS chỉ pull, không bao giờ build. Script trên VPS lo việc:
- deploy lần đầu và các lần sau, có sao lưu trước khi migrate;
- rollback;
- sao lưu hằng đêm ra ngoài VPS (DB đã mã hoá, và ảnh);
- khôi phục;
- dựng VPS mới.

Toàn bộ script được thử trên stack local của phase 8 trước.

## Requirements

### CI (GitHub Actions)

- [ ] `.github/workflows/ci.yml`, chạy khi có push hoặc pull request:
  - `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` (không có biến DB hay bí mật nào);
  - `scripts/check-server-actions.sh`: mọi file có `'use server'` phải nằm trong `src/server/actions/`, và mỗi hàm export phải gọi `requireUser(` ở dòng đầu tiên.
- [ ] `.github/workflows/release.yml`, chạy khi có tag `v*.*.*`:
  - build target `runner` và `tools`, gắn tag theo phiên bản và theo commit SHA, đẩy lên `ghcr.io/trancuongitus/hoa-chat-an-phat-website` và `...-tools`;
  - **mặc định chỉ `linux/amd64`**; có input `workflow_dispatch` `arm64: true` để build thêm `linux/arm64` khi nơi demo là máy ARM;
  - cache buildx `type=gha`.
- [ ] Mọi action ghim theo commit SHA (kèm chú thích phiên bản). Không dùng secret nào ngoài `GITHUB_TOKEN`.
- [ ] Bật protected tags cho `v*` trên GitHub, để chỉ người có quyền mới phát hành được.

### Script trên VPS (`deploy/scripts/`)

Mọi script dùng `set -euo pipefail`, có `trap` cho đường lỗi, chạy lại được nhiều lần, in rõ bước đang làm, và không bao giờ `echo` giá trị bí mật.

- [ ] **`bootstrap-vps.sh`**, chạy một lần với quyền root trên Ubuntu 24.04:
  - tạo user `deploy` có SSH key; tắt đăng nhập bằng mật khẩu và bằng root;
  - bật `ufw` (22, 80, 443/tcp, 443/udp) và `unattended-upgrades`;
  - cài Docker Engine, plugin compose, `rclone` và `age`;
  - tạo `/opt/app` và `/opt/app/backups` (`chmod 700`).
  - Runbook ghi rõ rằng user trong nhóm `docker` tương đương root, và mỗi khách dùng SSH key deploy riêng.
- [ ] **`deploy.sh <tag> [--first-run --seed=demo|template]`**, theo đúng thứ tự:
  1. kiểm tra `deploy/.env` tồn tại và có quyền `600`;
  2. ghi nhận tag đang chạy thật (`docker inspect` container `app`), không đọc từ `.env`;
  3. `docker compose up -d db` và chờ `healthy`;
  4. chạy `backup.sh`. Nếu DB chưa có bảng nào (lần đầu) thì bỏ qua và in thông báo;
  5. `APP_TAG=<tag> docker compose pull app migrate`;
  6. `APP_TAG=<tag> docker compose run --rm migrate`;
  7. chỉ khi `--first-run`: chạy seed theo chế độ (`demo` cho máy demo, `template` cho khách thật), rồi `user:create-admin`;
  8. `APP_TAG=<tag> docker compose up -d --no-deps app caddy`;
  9. chờ `/api/ready` tối đa 60 giây.
     - **Đạt:** mới ghi `APP_TAG=<tag>` vào `.env` và tag cũ vào `.previous_tag`.
     - **Không đạt:** chạy lại `app` bằng tag cũ (nếu có); nếu migration đã chạy thì in hướng dẫn khôi phục DB. `trap` luôn trả `.env` về như cũ.
- [ ] **`rollback.sh [tag]`**: về `.previous_tag` hoặc tag được chỉ định, bằng `docker compose up -d --no-deps app`, nên **không chạy migrate** và không đụng tới DB.
- [ ] **`backup.sh`**, chạy bằng cron của user `deploy` lúc 02:30 hằng đêm, có log. Đích ngoài VPS là một remote `rclone`; khuyến nghị bucket R2 riêng của từng khách (10 GB miễn phí).
  - **DB:**
    1. `docker compose exec -T db pg_dump -Fc` ra file tạm;
    2. `pg_restore --list` để chắc file đọc được;
    3. mã hoá bằng `age` với **khoá công khai** (khoá bí mật không nằm trên VPS);
    4. đổi tên vào `/opt/app/backups/`, giữ 7 bản cục bộ;
    5. `rclone copy` lên `backup/db/`.
  - **Ảnh:** `rclone copy` (copy, **không** sync, để việc xoá ảnh trên VPS không lan sang bản sao) thư mục volume `media_data` lên `backup/media/`.
  - Ghi thời điểm chạy thành công cuối cùng vào `/opt/app/backups/last-success`.
  - Bucket backup bật **khoá lưu trữ 30 ngày** (retention lock), nên kể cả khi token trên VPS bị lộ cũng không xoá được bản backup trong 30 ngày. `[UNVERIFIED]` Tên gọi và cách bật tính năng này trên R2 cần kiểm tra lại trong dashboard khi làm.
- [ ] **`restore.sh <file|remote-path> --key <đường-dẫn-khoá-bí-mật>`**:
  1. yêu cầu gõ tên miền để xác nhận;
  2. chạy `backup.sh` cho DB hiện tại;
  3. dừng `app`, đặt `trap` để **luôn bật lại `app`** kể cả khi lỗi;
  4. giải mã, `DROP DATABASE` + `CREATE DATABASE`, rồi `pg_restore --exit-on-error` vào DB trống;
  5. chạy `migrate`;
  6. `DELETE FROM session` (tên bảng theo phase 5), để phiên cũ và tài khoản đã khoá không sống lại;
  7. xoá `/app/.next/cache` nếu dùng mô hình cache B;
  8. bật `app`, rồi in lời nhắc áp dụng lại các thay đổi tài khoản làm sau thời điểm backup.
  - Có cờ `--media` để kéo lại thư mục ảnh từ `backup/media/`.
- [ ] **Mọi thao tác ghi từ image `tools`** (seed, create-admin, restore) kết thúc bằng `docker compose restart app`, vì cache nằm trong bộ nhớ của app.
- [ ] Hướng dẫn đăng nhập GHCR trên VPS: repo private thì dùng token chỉ có `read:packages`, lưu bằng `docker login ghcr.io` dưới user `deploy`.

### Quy tắc migration để rollback an toàn

- [ ] Ghi vào runbook (phase 10): mọi thay đổi schema theo kiểu **mở rộng trước, thu hẹp sau**. Thêm cột hoặc bảng mới ở một bản phát hành, và chỉ xoá cột cũ ở bản sau khi code không còn dùng. Nhờ vậy image cũ vẫn chạy được trên schema mới, và `rollback.sh` không cần đụng tới DB.

## Related Code Files

- Create: `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `scripts/check-server-actions.sh`, `deploy/scripts/bootstrap-vps.sh`, `deploy/scripts/deploy.sh`, `deploy/scripts/rollback.sh`, `deploy/scripts/backup.sh`, `deploy/scripts/restore.sh`, `deploy/rclone.conf.example`
- Modify: `.gitignore` (`deploy/rclone.conf`, `deploy/.previous_tag`)

## Implementation Steps

1. Viết `ci.yml` và `check-server-actions.sh`, đẩy một nhánh thử để CI chạy xanh.
2. Viết `release.yml`, gắn tag `v0.1.0-rc.1`, kiểm tra hai image trên GHCR. Chạy thêm một lần với `arm64: true` và kiểm tra bằng `docker manifest inspect`.
3. Viết các script và chạy `shellcheck` cho cả thư mục.
4. Thử trên stack local của phase 8 (dùng một bucket backup dev):
   - deploy lần đầu trên volume trống;
   - deploy lần hai;
   - deploy tag lỗi;
   - rollback;
   - backup và restore;
   - restore qua ranh giới migration.

## Todo

- [ ] `ci.yml` (dùng `npm run lint`) và `check-server-actions.sh`
- [ ] `release.yml` (amd64 mặc định, arm64 theo input, action ghim SHA)
- [ ] `bootstrap-vps.sh`
- [ ] `deploy.sh` (lần đầu, thứ tự ghi tag an toàn, readiness)
- [ ] `rollback.sh` (`--no-deps`)
- [ ] `backup.sh` (dump đã kiểm tra và mã hoá, copy ảnh, `last-success`) và cron
- [ ] `restore.sh` (DB trống, `trap`, xoá phiên, `--media`)
- [ ] `shellcheck` sạch

## Success Criteria

- CI xanh trên `main`; job build không có biến DB hay bí mật nào.
- Trên volume trống, `deploy.sh v0.1.0 --first-run --seed=template` đi từ đầu đến cuối không cần can thiệp tay, và site hiện khung thông tin công ty.
- Deploy một tag cố tình làm `/api/ready` lỗi: `app` quay về tag cũ, còn `.env` và `.previous_tag` không đổi.
- Chạy `deploy.sh` lỗi ở bước pull, rồi chạy lại: `rollback.sh` vẫn về đúng tag tốt cuối cùng.
- `rollback.sh` không tạo container `migrate` nào (`docker compose ps -a`).
- Restore một bản dump chụp **trước** một migration có thêm bảng: DB về đúng trạng thái cũ, và `app` chạy lại.
- File backup trên remote là file đã mã hoá; dùng token của VPS để xoá thì bị từ chối (nhờ khoá lưu trữ).
- `shellcheck deploy/scripts/*.sh scripts/*.sh` không có cảnh báo.

## Risk Assessment

- **Build arm64 bằng QEMU chậm** (có thể quá 10 phút): chỉ bật khi thật sự cần máy ARM.
- **Cron backup hỏng mà không ai biết:** `last-success` cùng hướng dẫn kiểm tra hằng tuần trong runbook. Tự động hoá cảnh báo nằm ngoài phạm vi.
- **Mất khoá bí mật `age`:** runbook yêu cầu cất khoá ở hai nơi ngoài VPS (trình quản lý mật khẩu và một bản offline).

## Security Considerations

- Dump DB chứa hash mật khẩu và phiên đăng nhập nên luôn được mã hoá trước khi rời VPS. Khoá bí mật không bao giờ nằm trên VPS.
- Token backup dùng riêng, tách khỏi mọi thứ khác, và bị khoá lưu trữ chặn việc xoá.
- `rclone.conf` và `deploy/.env` không bao giờ commit.
