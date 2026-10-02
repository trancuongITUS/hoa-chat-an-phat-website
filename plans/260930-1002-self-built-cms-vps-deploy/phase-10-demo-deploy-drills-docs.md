---
phase: 10
title: "Phase 10: Diễn tập, nơi chạy demo và tài liệu vận hành"
status: todo
priority: P1
effort: "1.5d"
dependencies: [7, 9]
---

# Phase 10: Diễn tập, nơi chạy demo và tài liệu vận hành

<!-- Updated: Validation 2026-09-30 - nơi chạy demo để sau, trước mắt chạy local; runbook tách demo và production -->
<!-- Updated: Red Team 2026-09-30 - thêm diễn tập deploy lần đầu, restore qua ranh giới migration, khôi phục ảnh -->

## Overview

Diễn tập toàn bộ vòng vận hành trên **stack local** (Docker Compose của phase 8 ở `https://localhost`), viết tài liệu vận hành, rồi mới chọn nơi chạy demo. Theo quyết định của người dùng, **nơi chạy demo để sau**. Phase này giữ bảng lựa chọn để quyết định khi cần.

## Nơi chạy demo (quyết định sau)

Ảnh lưu trên đĩa, nên nơi demo phải là máy có ổ đĩa lâu dài. Render và các nền tảng tương tự không dùng được.

| Lựa chọn | Ghi chú |
|---|---|
| Oracle Cloud Always Free (ARM A1) | Mạnh nhất trong các gói miễn phí. Cần build `arm64` (input của `release.yml`). Máy thường hết chỗ, và có thể bị thu hồi khi để không 7 ngày. |
| Google Cloud e2-micro | Miễn phí lâu dài, amd64. Chỉ ở 3 vùng tại Mỹ, 1 GB RAM (cần thêm swap 2 GB), 1 GB egress mỗi tháng. |
| Máy bạn + Cloudflare Tunnel | Miễn phí, dựng nhanh, chỉ truy cập được khi máy bật. Không kiểm nghiệm được phần dựng VPS. |
| VPS thuê giá rẻ | Vài USD mỗi tháng, giống hệt production. |

Khi đã chọn: làm theo `docs/deployment/production-runbook.md` với `--seed=demo`, bấm giờ, rồi cập nhật lại mục này.

## Requirements

- [ ] Diễn tập trên stack local, ghi kết quả vào `plans/260930-1002-self-built-cms-vps-deploy/reports/drills.md`:
  1. **Deploy lần đầu trên volume trống:** `deploy.sh v0.1.0 --first-run --seed=template` chạy từ đầu đến cuối, không can thiệp tay.
  2. **Khôi phục dữ liệu:** tạo một bài thử, `backup.sh`, xoá bài, `restore.sh` từ bản trên remote. Bài quay lại, và phiên đăng nhập cũ bị đăng xuất.
  3. **Khôi phục qua ranh giới migration:** backup, deploy một bản có migration thêm bảng, rồi `restore.sh` bản cũ. DB về trạng thái cũ và `app` chạy lại.
  4. **Khôi phục ảnh:** xoá một file trong `media_data`, `restore.sh --media`. Ảnh hiện lại.
  5. **Rollback và deploy lỗi:** deploy tag mới rồi `rollback.sh` (site về bản cũ trong 5 phút); deploy tag cố tình lỗi (tự quay về tag cũ).
  6. **Khởi động lại:** `docker compose down && up -d` (trên VPS thật thì `sudo reboot`). Site hoạt động trong 2 phút.
  7. **Quét cổng** (làm khi đã có VPS hoặc máy demo): `nmap -Pn <ip>` chỉ thấy 22, 80, 443.
- [ ] Tài liệu trong `docs/`:
  - `docs/deployment/production-runbook.md`, gồm:
    - yêu cầu VPS;
    - dựng VPS mới cho khách (từng bước, có lệnh, dùng `--seed=template`);
    - deploy và rollback;
    - sao lưu và khôi phục (DB và ảnh; cất khoá `age` ở đâu; kiểm tra `last-success` hằng tuần);
    - xoay vòng bí mật (mật khẩu DB, `BETTER_AUTH_SECRET`, token backup, khoá `age`);
    - quy tắc migration "mở rộng trước, thu hẹp sau";
    - rủi ro user nhóm `docker` tương đương root, và mỗi khách dùng key riêng;
    - xử lý sự cố thường gặp: hết đĩa, không cấp được chứng chỉ, `/api/ready` lỗi, dữ liệu sửa ngoài app không hiện (restart `app`).
  - `docs/deployment/demo-hosting.md`: bảng lựa chọn ở trên, cách build `arm64`, và cách dựng nhanh bằng Cloudflare Tunnel.
  - Cập nhật `docs/README.md`:
    - mục "Chạy dự án" thêm DB local, seed, `npm test`, `npm run lint`;
    - bảng "Cấu trúc" thêm `src/server/`, `deploy/`, `drizzle/`;
    - bảng "Những chỗ cần thay khi có dữ liệu thật": bài viết và thông tin công ty giờ sửa trong `/admin`, sản phẩm vẫn ở `src/data/products.ts`;
    - bỏ đoạn nói dự án "chưa có backend" cho phần nội dung, trỏ tới runbook.
- [ ] Cập nhật tổng quan trong `plan.md` và đánh dấu các tiêu chí thành công đã đạt, kèm số đo thực tế.

## Related Code Files

- Create: `docs/deployment/production-runbook.md`, `docs/deployment/demo-hosting.md`, `plans/260930-1002-self-built-cms-vps-deploy/reports/drills.md`
- Modify: `docs/README.md`, các script trong `deploy/scripts/` (nếu diễn tập phát hiện lỗi)

## Todo

- [ ] Diễn tập 1–6 trên stack local
- [ ] `production-runbook.md`
- [ ] `demo-hosting.md`
- [ ] Cập nhật `docs/README.md`
- [ ] *(Khi đã chọn nơi demo)* Dựng demo theo runbook, bấm giờ, diễn tập 7

## Success Criteria

- Diễn tập 1–6 đều đạt và được ghi trong `drills.md`.
- Một người chưa từng làm dự án đọc `production-runbook.md` là biết cần chuẩn bị gì và chạy lệnh nào. Kiểm tra bằng cách tự dựng lại từ đầu trên stack local chỉ theo runbook.
- Mọi link trong tài liệu mới hoạt động, và mọi lệnh khớp với script thật.
- *(Khi đã chọn nơi demo)* Dựng từ máy trắng tới lúc có HTTPS và admin đăng nhập được: **dưới 1 giờ**.

## Risk Assessment

- **Diễn tập local không phát hiện được lỗi riêng của VPS** (ufw, cấp chứng chỉ công khai, DNS): diễn tập 7 và lần dựng demo đầu tiên bù phần này.
- **Máy demo bị thu hồi** (nếu chọn Oracle): runbook giúp dựng lại trong dưới một giờ.

## Security Considerations

- Demo dùng bí mật riêng, không dùng chung với bất kỳ khách nào.
- Tài liệu không chứa giá trị bí mật, IP thật hay tên miền của khách.
