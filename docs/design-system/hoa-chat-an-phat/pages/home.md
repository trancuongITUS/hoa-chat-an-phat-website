# Trang chủ — Override

> Quy tắc trong file này **ghi đè** `../MASTER.md`. Mọi thứ không nêu ở đây lấy từ MASTER.
> **Mẫu:** Enterprise Gateway (biến thể B2B Việt Nam)
> **Mục tiêu chuyển đổi:** gửi yêu cầu báo giá hoặc gọi hotline trong lần truy cập đầu.

## Cấu trúc section

| # | Section | Nội dung bắt buộc |
|---|---------|-------------------|
| 1 | **Hero** | `display` nêu rõ An Phát bán gì cho ai ("Cung ứng hoá chất công nghiệp cho sản xuất, xử lý nước và dệt nhuộm"). Đoạn dẫn `body-lg`. Nút `cta` "Yêu cầu báo giá" + nút `outline` "Gọi 0xxx xxx xxx". Nền `primary-900`, ảnh kho/bồn chứa thật làm nền phủ `rgb(12 22 34 / .6)`. Không dùng ảnh stock phòng lab kiểu minh hoạ. |
| 2 | **Dải tin cậy** | 4 số liệu: số năm hoạt động, số mã hàng, số khách hàng doanh nghiệp, thời gian giao trung bình. Dùng `tabular`. Ngay dưới hero, nền `neutral-0`. |
| 3 | **Chọn theo ngành ứng dụng** | Lưới 6 thẻ: Xử lý nước · Dệt nhuộm · Thực phẩm · Mạ và xi mạ · Cao su nhựa · Vệ sinh công nghiệp. Mỗi thẻ có icon Lucide, tên ngành, 1 dòng mô tả, link tới danh mục đã lọc sẵn. Đây là cơ chế "path selection" thay cho "I am a...". |
| 4 | **Nhóm hoá chất chủ lực** | 8 `ProductCard` theo spec MASTER §7.4. Có link "Xem toàn bộ danh mục". |
| 5 | **Năng lực cung ứng** | 3 khối: kho bãi và bồn chứa, đội xe bồn/xe tải có giấy phép vận chuyển hàng nguy hiểm, quy trình kiểm định lô hàng. Mỗi khối kèm ảnh thật. |
| 6 | **Chứng nhận và giấy phép** | Lưới logo/giấy tờ: Giấy phép kinh doanh hoá chất, ISO 9001, phiếu kiểm nghiệm mẫu. Bấm vào mở lightbox xem bản scan. Đây là phần quan trọng nhất về độ tin cậy — **không** đặt xuống footer. |
| 7 | **Khách hàng tiêu biểu** | Dải logo đơn sắc `neutral-400`, hover về màu gốc. Chỉ dùng logo đã có quyền sử dụng. |
| 8 | **Khối CTA cuối** | Nền `primary-800`, tiêu đề `h2`, nút `cta` "Yêu cầu báo giá", kèm hotline (`tel:`) và email (`mailto:`) dạng link thứ cấp. Không có nút chat. |

## Ghi đè bố cục

- Hero tràn viền tới 1440px; các section còn lại giữ max-width 1280px.
- Padding dọc section: 96px desktop / 64px tablet / 48px mobile (giữ như MASTER).
- Dải tin cậy (#2) đè lên hero 48px bằng `margin-top: -48px` trên `lg`, giữ nguyên dòng trên mobile.

## Ghi đè màu

- Hero và khối CTA cuối chạy trên nền tối `primary-900` / `primary-800`: chữ dùng
  `#E6EDF5` (11.57:1), chữ phụ dùng `#9AAABE` (5.76:1), nút `outline` đổi viền sang
  `#8BB8E2` (6.53:1) và chữ `#E6EDF5`.
- Nút `cta` trong hero và khối CTA cuối dùng biến thể nền tối: nền `cta-400` `#EA7C33`
  + chữ `ink` `#0C1622`. Không dùng `cta-600` ở đây — viền nút chỉ đạt 2.35:1 so với nền.
- Xen kẽ nền section: `neutral-0` → `neutral-50` → `neutral-0` để phân tách mà không cần kẻ viền.

## Chuyển động

- Số liệu ở dải tin cậy đếm lên khi vào viewport, 600ms, chỉ chạy một lần, tắt hoàn toàn khi `prefers-reduced-motion`.
- Thẻ ngành ứng dụng và ProductCard vào theo stagger 40ms/item, dịch lên 12px + fade.
- Ảnh hero **không** parallax.

## Hiệu năng

- Ảnh hero là LCP: dùng `next/image` với `priority`, định dạng AVIF, kích thước khai báo sẵn.
- Dải logo khách hàng và lưới chứng nhận `loading="lazy"`.
- Section 5–8 nạp bằng `dynamic()` nếu bundle trang chủ vượt 180KB gzip.

## Không làm

- ❌ Carousel tự chạy ở hero.
- ❌ Video nền tự phát có tiếng.
- ❌ Nhiều hơn một nút `cta` hiển thị cùng lúc trong một khung nhìn.
