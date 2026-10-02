---
phase: 8
title: "Phase 8: Đóng gói Docker và stack production"
status: todo
priority: P1
effort: "1.5d"
dependencies: [4]
---

# Phase 8: Đóng gói Docker và stack production

<!-- Updated: Red Team 2026-09-30 - tách health/ready, header bảo mật và giới hạn body ở Caddy, ghim phiên bản image -->
<!-- Updated: Validation 2026-09-30 - ảnh trên volume media_data; chạy local trước, nơi demo quyết định sau -->

## Overview

Đóng ứng dụng thành **một Docker image dùng cho mọi môi trường**, kèm một image `tools` để chạy migration, seed và tạo admin. Viết `compose.yaml` cho VPS, rồi **chạy toàn bộ stack trên máy bạn** (`https://localhost`) như trên một VPS thật. Đây là cách "chạy local cho mượt" trước khi chọn nơi demo. Phase này bắt đầu được ngay sau phase 4, song song với phase 5–7.

## Kiến trúc trên mỗi VPS

```
Internet ──► VPS Ubuntu 24.04 LTS (2 vCPU / 2–4 GB RAM / ≥ 40 GB SSD)
             ufw: chỉ mở 22 (SSH key), 80, 443 (+443/udp)
             Docker Compose (thư mục /opt/app)
             ├─ caddy    ports 80, 443 · volume caddy_data, caddy_config · HTTPS tự động, header bảo mật
             ├─ app      ghcr.io/<owner>/<repo>:<tag> · expose 3210
             │           volume media_data → /app/data/media (MEDIA_DIR)
             │           volume next_cache → /app/.next/cache
             ├─ migrate  ghcr.io/<owner>/<repo>-tools:<tag> · chạy một lần rồi thoát
             └─ db       postgres:17.x-alpine · volume pgdata · KHÔNG publish cổng
Backup (phase 9) ──► dump DB đã mã hoá + bản sao media_data ──► đích ngoài VPS (rclone)
```

## Requirements

- [ ] `next.config.ts`: `output: 'standalone'`. Không có giá trị nào phụ thuộc môi trường, vì config bị chốt lúc build (nghiên cứu §3).
- [ ] `Dockerfile` nhiều tầng trên `node:24.x.y-slim` (ghim đủ ba số phiên bản):
  - `deps`: `npm ci`.
  - `build`: `npm run build` **không có biến DB hay bí mật nào**.
  - `tools`: toàn bộ `node_modules`, `drizzle/`, `drizzle.config.ts`, `scripts/`, `src/`, `assets/processed-images/`. Entrypoint cho `db:migrate`, `db:seed`, `user:create-admin`.
  - `runner`:
    - chỉ chứa `.next/standalone`, `.next/static`, `public`;
    - `USER node`, `ENV PORT=3210 HOSTNAME=0.0.0.0 MEDIA_DIR=/app/data/media`;
    - tạo sẵn `/app/.next/cache` và `/app/data/media`, `chown` cho `node`;
    - `HEALTHCHECK` gọi `/api/health`.
- [ ] `.dockerignore`: loại `node_modules`, `.next`, `.env*`, `.git`, `.data`, `plans`, `.claude`, `assets/raw-images`.
- [ ] **Tách hai endpoint sức khoẻ**, không cache:
  - `/api/health` (liveness): chỉ trả 200 khi tiến trình còn chạy, không đụng DB. Dùng cho `HEALTHCHECK` của Docker, để một lần DB chập chờn không khiến container bị đánh dấu hỏng.
  - `/api/ready` (readiness): `SELECT 1` (timeout 2 giây) và dòng `site_settings` phải tồn tại. Trả 200 hoặc 503 kèm lý do. `deploy.sh` (phase 9) dùng endpoint này.
- [ ] `deploy/compose.yaml`:
  - Các service như sơ đồ, mọi image ghim phiên bản cụ thể (không dùng `latest`), gồm cả `caddy:2.x.y`.
  - `app` phụ thuộc `migrate` với `condition: service_completed_successfully`; `migrate` phụ thuộc `db` với `condition: service_healthy`.
  - `restart: unless-stopped` cho mọi service trừ `migrate`.
  - `logging: { driver: json-file, options: { max-size: 10m, max-file: "3" } }` cho mọi service.
  - `db` có healthcheck `pg_isready`.
  - Tag image lấy từ `APP_TAG` trong `deploy/.env`.
  - `app` có `mem_limit` khoảng 768 MB để Postgres không bị kernel dừng vì hết bộ nhớ.
- [ ] `deploy/Caddyfile`:
  - `{$SITE_DOMAIN}` với `encode zstd gzip` và `reverse_proxy app:3210`;
  - `request_body { max_size 12MB }` cho `/admin/api/*`;
  - header cho mọi đường dẫn: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, và CSP cơ bản (`default-src 'self'`; `img-src 'self' data:`; `frame-ancestors 'none'`; nới cho script/style mà Next cần, xác định bằng cách chạy thử);
  - thêm `X-Frame-Options: DENY` cho `/admin*`.
- [ ] `deploy/.env.example`: `SITE_DOMAIN`, `APP_IMAGE`, `APP_TAG`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL` (trỏ `db:5432`), `SITE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- [ ] `deploy/compose.local.yaml` (chỉ dùng trên máy dev): build image từ source thay vì pull, đặt `SITE_DOMAIN=localhost` (Caddy tự cấp chứng chỉ nội bộ).

## Kiểm tra trong container

1. `docker build --target runner .` trên máy **không có** `DATABASE_URL` phải thành công. Đây là bằng chứng cuối cùng cho spike của phase 3, và cho điều kiện "build không cần env" của phase 5.
2. Spike ảnh của phase 2 chạy lại trong container: `/_next/image?url=%2Fmedia%2F...&w=640&q=75` trả 200. Nếu lỗi `sharp`, thêm `outputFileTracingIncludes` cho `sharp`.
3. *(Làm khi phase 6 đã xong)* Server Action lưu thông tin công ty chạy qua Caddy ở `https://localhost` không bị lỗi origin. Nếu lỗi, đặt `header_up X-Forwarded-Host {host}`. Không thêm `allowedOrigins`, vì giá trị đó bị chốt lúc build.
4. Chạy cùng image với hai giá trị `SITE_URL` khác nhau: link chia sẻ và `metadataBase` đổi theo, chứng tỏ không có giá trị môi trường nào bị đóng băng.
5. `docker compose restart app`: bài viết vẫn hiển thị (cache nạp lại từ DB), ảnh vẫn còn (volume `media_data`), ảnh đã tối ưu vẫn còn (volume `next_cache`).
6. Trình duyệt không báo vi phạm CSP trên trang chủ, một bài viết, `/lien-he` (bản đồ) và trang admin.

## Related Code Files

- Create: `Dockerfile`, `.dockerignore`, `src/app/api/health/route.ts`, `src/app/api/ready/route.ts`, `deploy/compose.yaml`, `deploy/compose.local.yaml`, `deploy/Caddyfile`, `deploy/.env.example`
- Modify: `next.config.ts`, `package.json` (script `docker:local`), `.gitignore` (`deploy/.env`)

## Implementation Steps

1. Thêm `output: 'standalone'`, chạy `npm run build`, thử `node .next/standalone/server.js`.
2. Viết `Dockerfile` và `.dockerignore`, build cả `runner` và `tools`.
3. Viết `/api/health` và `/api/ready`.
4. Viết `compose.yaml`, `Caddyfile`, `compose.local.yaml`.
5. `docker compose -f deploy/compose.yaml -f deploy/compose.local.yaml up -d`, rồi làm theo thứ tự:
   - chạy `migrate`;
   - `seed --demo` bằng image `tools`;
   - restart `app`;
   - các bước kiểm tra ở trên. Bước 3 và phần đăng bài chạy lại sau khi phase 6 và 7 xong.

## Todo

- [ ] `output: 'standalone'`
- [ ] `Dockerfile` (deps, build, tools, runner) và `.dockerignore`
- [ ] `/api/health` (liveness) và `/api/ready` (readiness)
- [ ] `deploy/compose.yaml` (ghim phiên bản, volume media), `.env.example`, `compose.local.yaml`
- [ ] `deploy/Caddyfile` (giới hạn body, header bảo mật, CSP)
- [ ] Chạy đủ stack trên máy và làm 6 bước kiểm tra

## Success Criteria

- Image `runner` ≤ 300 MB (`docker image ls`).
- `docker compose ps`: `app` và `db` ở trạng thái `healthy`; `migrate` đã thoát với mã 0.
- `https://localhost` hiển thị site với dữ liệu demo. Khi phase 7 đã xong: đăng bài và thấy bài lên ngay.
- Dừng `db`: `/api/health` vẫn 200, `/api/ready` trả 503, container `app` không bị restart.
- `docker compose port db 5432` không trả về cổng nào.
- `curl -I https://localhost/admin` có `x-frame-options: DENY` và `content-security-policy`.
- Cả 6 bước kiểm tra đạt, hoặc phương án dự phòng đã được áp dụng và ghi lại.

## Risk Assessment

- **Image quá lớn:** runner chỉ copy standalone. Image `tools` được phép lớn vì chỉ chạy lúc deploy.
- **VPS 2 GB RAM hết bộ nhớ:** không build trên VPS (phase 9 build trên CI), và giới hạn `mem_limit` cho `app`.
- **CSP quá chặt làm hỏng trang** (Next chèn script inline, bản đồ nhúng): bắt đầu ở chế độ `Content-Security-Policy-Report-Only` trên máy local, sửa đến khi sạch, rồi mới bật chặn thật.

## Security Considerations

- Container app chạy bằng user không phải root.
- Chỉ Caddy publish cổng. Docker vượt qua `ufw` với các cổng được publish, nên tuyệt đối không publish `db` hay `app`.
- `deploy/.env` có quyền `600` và không bao giờ commit.
