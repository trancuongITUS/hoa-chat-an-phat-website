---
phase: 2
title: "Phase 2: Lưu trữ ảnh trên đĩa và xử lý media"
status: todo
priority: P1
effort: "1d"
dependencies: [1]
---

# Phase 2: Lưu trữ ảnh trên đĩa và xử lý media

<!-- Updated: Validation 2026-09-30 - ảnh lưu trên ổ đĩa VPS (volume Docker), bỏ R2/S3 cho ảnh -->
<!-- Updated: Red Team 2026-09-30 - giới hạn bộ nhớ khi xử lý ảnh, SVG chỉ qua seed, position, source_key, tiền tố khoá media/ -->

## Overview

Ảnh được xử lý ở server bằng `sharp` và lưu vào **thư mục `MEDIA_DIR` trên đĩa**. Thư mục này là volume Docker trên VPS, và là `./.data/media` khi chạy local. Ảnh được phục vụ cùng domain qua route `/media/[...key]`. Vì không có host bên ngoài nào xuất hiện trong `next.config`, một Docker image dùng được cho mọi môi trường. Sao lưu ảnh ra ngoài VPS nằm ở phase 9.

## Quyết định thiết kế

- **Upload đi qua server, lưu trên đĩa của VPS** (quyết định của người dùng). Mỗi khách không cần tài khoản lưu trữ bên ngoài cho ảnh.
- **`sharp` chuẩn hoá mọi ảnh:** giải mã ảnh thật, xoay theo EXIF, xoá metadata, thu về tối đa 2400px chiều ngang, chuyển sang WebP.
- **Chỉ ảnh raster đi qua route upload** (JPEG, PNG, WebP). SVG chỉ được nhận ở đường seed, ví dụ logo mẫu. Khi đó SVG được raster hoá ở mật độ đủ cho khung 240×80 hiển thị trên màn hình 3x (ảnh rộng 720px), để logo không bị mờ. `next/image` chặn SVG, nên không cần `dangerouslyAllowSVG`.
- **Khoá bất biến** `media/<yyyy>/<mm>/<uuid>.webp`. Thay ảnh nghĩa là ảnh mới với URL mới, nên cache tối ưu ảnh không bao giờ phục vụ ảnh cũ.
- **Ghi file an toàn:** ghi vào file tạm cùng thư mục rồi `rename`, để không bao giờ có file ghi dở.

## Requirements

- [ ] `src/server/storage.ts` (import `server-only`):
  - `writeObject(key, buffer)`: ghi tạm rồi đổi tên;
  - `openObjectStream(key)`: trả về `ReadableStream`, hoặc `null` khi không có file;
  - `objectPath(key)`: chỉ nhận khoá khớp `^media/\d{4}/\d{2}/[0-9a-f-]{36}\.webp$`, và kiểm tra lại rằng đường dẫn thật nằm trong `MEDIA_DIR`.
- [ ] `src/server/media/process-image.ts`:
  - nhận `Buffer` và `{ allowSvg?: boolean }`, trả `{ buffer, width, height, mime: 'image/webp' }`;
  - giới hạn đầu vào 10 MB, và `limitInputPixels: 40_000_000` cho sharp;
  - xử lý tối đa 2 ảnh cùng lúc (một semaphore đơn giản trong module);
  - từ chối file không giải mã được, và SVG khi `allowSvg` không bật.
- [ ] `src/server/media/save-media.ts`: `saveMedia({ buffer, alt, position, credit, sourceKey, uploadedBy, allowSvg })`.
  - Nếu có `sourceKey` và khoá đó đã tồn tại, trả về bản ghi cũ (dùng cho seed).
  - Nếu không: xử lý ảnh, ghi file, thêm dòng `media`, trả về `SiteImage` (`src: /media/<yyyy>/<mm>/<uuid>.webp`).
  - Seed (phase 3) và route upload (phase 6) cùng dùng hàm này.
- [ ] `GET /media/[...key]` (Route Handler):
  - ghép lại khoá `media/` + các đoạn đường dẫn và kiểm tra bằng `objectPath`, sai thì trả 404;
  - stream file kèm `Content-Type: image/webp` và `Cache-Control: public, max-age=31536000, immutable`;
  - không redirect.
- [ ] `next.config.ts`: `images.localPatterns = [{ pathname: '/media/**', search: '' }, { pathname: '/images/**', search: '' }]`.
- [ ] Script `scripts/upload-sample-media.ts` gọi `saveMedia` với một ảnh trong `assets/processed-images/`, dùng cho spike và kiểm thử khi chưa có admin. Chạy bằng `tsx --conditions=react-server`, để các module `server-only` không ném lỗi ngoài Next.

Route upload `POST /admin/api/media` và trường `media-field` cần đăng nhập, nên nằm ở **phase 6**.

## Spike bắt buộc (làm đầu tiên)

1. Chạy `next build && next start`.
2. Tải một ảnh lên bằng `scripts/upload-sample-media.ts`.
3. Mở `/_next/image?url=%2Fmedia%2F<yyyy>%2F<mm>%2F<uuid>.webp&w=640&q=75`.

- Trả **200** với `content-type` là ảnh: dùng `next/image` như bình thường.
- Không đạt: `ContentImage` thêm `unoptimized` cho mọi `src` bắt đầu bằng `/media/`. Ảnh đã được thu nhỏ lúc upload nên mất tối ưu theo breakpoint là chấp nhận được. **Không bật** `dangerouslyAllowLocalIP`, vì đó là rủi ro SSRF.

Ghi kết quả vào mục Validation Log của `plan.md`. Phase 8 chạy lại spike này trong container.

## Related Code Files

- Create: `src/server/storage.ts`, `src/server/storage.test.ts`, `src/server/media/process-image.ts`, `src/server/media/process-image.test.ts`, `src/server/media/save-media.ts`, `src/app/media/[...key]/route.ts`, `scripts/upload-sample-media.ts`
- Modify: `next.config.ts`, `package.json` (`sharp`), `.env.example` (`MEDIA_DIR`), `src/components/content-image.tsx` (chỉ khi spike không đạt)

## Implementation Steps

1. `npm i sharp`.
2. Viết `storage.ts` và test:
   - khoá hợp lệ đọc và ghi được;
   - `../`, khoá sai mẫu và symlink ra ngoài `MEDIA_DIR` đều bị từ chối.
3. Viết `process-image.ts` và test với:
   - JPEG có EXIF xoay;
   - PNG;
   - SVG (bị từ chối khi không có `allowSvg`, raster 720px khi có);
   - file giả mạo đổi đuôi;
   - ảnh vượt 40 megapixel.
4. Viết `save-media.ts` và route `/media/[...key]`.
5. Viết `scripts/upload-sample-media.ts` rồi chạy spike.

## Todo

- [ ] `storage.ts` và test chống thoát thư mục
- [ ] `process-image.ts` (giới hạn pixel, semaphore, SVG theo cờ) và test
- [ ] `save-media.ts` (dedupe theo `source_key`)
- [ ] Route `/media/[...key]`
- [ ] `scripts/upload-sample-media.ts`
- [ ] Spike tối ưu ảnh qua `/_next/image`

## Success Criteria

- Chạy script với một JPEG 6 MB thì `MEDIA_DIR` có một file WebP rộng ≤ 2400px, và bảng `media` có đúng `width`, `height`.
- Chạy script hai lần với cùng `sourceKey` thì vẫn chỉ có một dòng `media` và một file.
- `/media/..%2F..%2Fetc%2Fpasswd` và các khoá sai mẫu trả 404.
- `curl -I /media/<yyyy>/<mm>/<uuid>.webp` có `cache-control: public, max-age=31536000, immutable`.
- Spike `/_next/image` đạt, hoặc phương án dự phòng đã được áp dụng và ghi lại.

## Risk Assessment

- **Optimizer không nhận `src` do route handler phục vụ** (chưa được tài liệu xác nhận): đã có spike và phương án dự phòng.
- **`sharp` không được đóng vào standalone:** khai báo là dependency trực tiếp; phase 8 kiểm tra lại trong container.
- **Mất ảnh khi mất VPS:** phase 9 sao lưu `MEDIA_DIR` ra ngoài hằng đêm.

## Security Considerations

- Kiểm tra đường dẫn hai lớp (regex khoá và so với đường dẫn thật) chống path traversal.
- Giới hạn kích thước, số pixel và số ảnh xử lý đồng thời để một người dùng không làm app hết bộ nhớ.
- SVG không bao giờ được lưu hay phục vụ nguyên dạng.
