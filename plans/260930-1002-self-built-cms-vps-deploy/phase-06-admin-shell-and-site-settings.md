---
phase: 6
title: "Phase 6: Khung admin, upload ảnh và thông tin công ty"
status: todo
priority: P1
effort: "2.5d"
dependencies: [2, 4, 5]
---

# Phase 6: Khung admin, upload ảnh và thông tin công ty

<!-- Updated: Red Team 2026-09-30 - route group đã chuyển sang phase 4; upload dùng requireApiUser, đọc body có giới hạn, kiểm tra Origin, chỉ nhận ảnh raster; form tôn trọng ràng buộc số lượng -->
<!-- Updated: Validation 2026-09-30 - bỏ ảnh scan chứng nhận và ảnh năng lực khỏi form -->

## Overview

Dựng khung trang quản trị (tách khỏi giao diện công khai nhờ route group `(site)` ở phase 4), route upload ảnh cùng trường chọn ảnh dùng chung, và form sửa thông tin công ty. Lưu form là header, footer và các trang liên quan cập nhật ngay.

## Requirements

### Khung admin

- [ ] `src/app/admin/layout.tsx`:
  - đặt `robots: { index: false, follow: false }`;
  - có thanh điều hướng: Bài viết, Thông tin công ty (chỉ admin), Tài khoản (chỉ admin), tên người dùng và nút đăng xuất.
  - Mọi trang con **tự gọi `requireUser(role)`**, vì layout không chạy lại ở mỗi lần điều hướng.
  - Nếu phase 3 chọn mô hình A, phần đọc phiên đăng nhập nằm trong `<Suspense>`, để tránh lỗi build "blocking-route".
- [ ] `/admin` chuyển thẳng tới `/admin/bai-viet`.
- [ ] Giao diện admin dùng lại token và primitive có sẵn (`Button`, `Field`, `Dialog`, `Toaster`, `states.tsx`), không thêm thư viện UI. Dùng tốt từ 1024px; trên điện thoại xem được là đủ.

### Upload ảnh

- [ ] `POST /admin/api/media` (Route Handler):
  1. gọi `requireApiUser()`; nếu trả về `Response` thì trả luôn (JSON 401/403);
  2. header `Origin` phải trùng với `SITE_URL`, nếu không thì trả 403 (Route Handler không có kiểm tra origin sẵn như Server Action);
  3. đọc body dạng stream, đếm byte, **dừng ngay khi vượt 10 MB** (không tin header `Content-Length`);
  4. chỉ nhận JPEG, PNG, WebP; SVG bị từ chối;
  5. nhận `file`, `alt`, `position`, `credit`; gọi `saveMedia` và trả `SiteImage`.
  - Lỗi trả JSON có thông báo tiếng Việt.
- [ ] `src/components/admin/media-field.tsx`:
  - tải ảnh mới hoặc chọn từ 30 ảnh gần nhất;
  - ô `alt` bắt buộc;
  - chọn điểm cắt ảnh (`position`) bằng lưới 3×3, có xem trước theo khung tỉ lệ của nơi dùng;
  - công tắc **"Ảnh của bên thứ ba"**. Khi bật mới hiện nhóm ghi công (tác giả, giấy phép, link nguồn, chỉnh sửa), và nhóm này bắt buộc khi giấy phép chứa `BY`.
- [ ] `src/server/queries/admin-media.ts`: liệt kê ảnh gần nhất (không cache).

### Thông tin công ty (`/admin/thong-tin-cong-ty`, chỉ admin)

- [ ] Một form chia các mục theo `SiteSettings` (phase 3):
  - **Thông tin chung:** tên, tên ngắn, khẩu hiệu, hotline, email, mã số thuế, thời gian phản hồi, giờ làm việc, năm thành lập, địa chỉ.
  - **Số liệu tin cậy:** đúng 4 mục, không có nút thêm/xoá.
  - **Năng lực:** đúng 3 mục, không có nút thêm/xoá. Gồm tiêu đề, icon, mô tả và các ý; ảnh vẫn do code quản lý.
  - **Chứng nhận:** tên, cơ quan cấp, số hiệu, hiệu lực.
  - **Mốc phát triển.**
  - **Kho:** tên, địa chỉ, diện tích, loại lưu trữ, bán kính giao, điện thoại, giờ nhận hàng, từ khoá bản đồ. Tối thiểu 1 kho, nút xoá bị vô hiệu ở mục cuối.
  - **Cam kết tuân thủ:** tiêu đề, icon, mô tả.
  - **Logo khách hàng:** tên, ngành, logo. Được phép rỗng; khi rỗng thì trang chủ ẩn cả khối.
  - **Chủ đề liên hệ:** tối thiểu 1.
  - **Công tắc** "Hiện thông báo dữ liệu mẫu".
- [ ] `src/components/admin/repeatable-list.tsx`: danh sách lặp có Thêm, Xoá, Lên, Xuống, và nhận `min`/`max` để khoá nút theo ràng buộc. Trình soạn khối ở phase 7 dùng lại.
- [ ] Icon chọn từ các khoá có trong `src/components/icon-map.ts`.
- [ ] Server Action `saveSiteSettings` trong `src/server/actions/site-settings-actions.ts`:
  - dòng đầu tiên gọi `requireUser('admin')`;
  - parse bằng `siteSettingsSchema`;
  - ghi có kiểm tra `version` (khoá lạc quan), lưu `updated_by`;
  - gọi `invalidateSiteSettings()`.
- [ ] Form kiểm tra ngay bằng cùng zod schema, thông báo lỗi tiếng Việt gắn vào đúng trường (giống form báo giá hiện có).

## Quy ước cho mọi Server Action

`'use server'` chỉ được dùng trong `src/server/actions/`, và mỗi hàm export phải gọi `requireUser(...)` ở dòng đầu tiên. Không có Server Action nào dùng để "thử". Phase 9 thêm một bước kiểm tra trong CI cho quy ước này.

## Related Code Files

- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/thong-tin-cong-ty/page.tsx`, `src/app/admin/api/media/route.ts`, `src/components/admin/admin-nav.tsx`, `src/components/admin/media-field.tsx`, `src/components/admin/repeatable-list.tsx`, `src/components/admin/site-settings-form.tsx`, `src/server/actions/site-settings-actions.ts`, `src/server/queries/admin-media.ts`, `src/server/media/read-limited-body.ts`, `src/server/media/read-limited-body.test.ts`

## Implementation Steps

1. Dựng layout admin và thanh điều hướng.
2. Viết `read-limited-body.ts` (đọc stream có giới hạn) và test với body 11 MB không có `Content-Length`.
3. Làm route upload và `media-field`, thử tải ảnh thật.
4. Làm `repeatable-list`, rồi form thông tin công ty theo từng mục.
5. Viết Server Action lưu. Thử đủ vòng: sửa hotline, lưu, xem trang công khai đổi ngay.

## Todo

- [ ] Layout và điều hướng admin
- [ ] `read-limited-body.ts` và test
- [ ] Route upload (guard, Origin, giới hạn byte, chỉ ảnh raster)
- [ ] `media-field.tsx` (alt, điểm cắt, ghi công khi là ảnh bên thứ ba) và `admin-media.ts`
- [ ] `repeatable-list.tsx` có `min`/`max`
- [ ] Form thông tin công ty
- [ ] Server Action lưu (khoá lạc quan, làm mới cache)

## Success Criteria

- Sửa hotline và lưu: header, footer, `/lien-he` và nút gọi ở trang sản phẩm hiện số mới ngay ở lần tải trang tiếp theo, không có build nào chạy.
- Tài khoản `editor` mở `/admin/thong-tin-cong-ty` thì bị chặn. Gọi thẳng `saveSiteSettings` bằng phiên editor cũng bị từ chối.
- Upload khi chưa đăng nhập nhận JSON 401. Upload từ origin khác nhận 403. Upload 11 MB bị cắt và trả lỗi, bộ nhớ của app không tăng quá mức. Upload SVG bị từ chối.
- Không thể lưu form khi đã xoá hết kho hoặc hết chủ đề liên hệ.
- `npm test`, `npm run typecheck`, `npm run lint` sạch.

## Risk Assessment

- **Form rất dài:** chia theo mục, có mục lục neo ở cạnh trái, một nút Lưu cho cả form.
- **Nhiều ảnh upload cùng lúc:** semaphore trong `process-image` (phase 2) giới hạn 2 ảnh xử lý đồng thời.

## Security Considerations

- Route upload và Server Action kiểm tra quyền ở server. Route upload còn kiểm tra `Origin`.
- Trang admin không được cache công khai, và không loader admin nào dùng `'use cache'`.
- Caddy (phase 8) chặn nhúng trang admin trong iframe.
