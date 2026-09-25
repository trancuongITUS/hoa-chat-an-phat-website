# Báo cáo dựng website Hoá chất An Phát

**Ngày:** 2026-09-23 · **Nguồn spec:** `docs/design-system/hoa-chat-an-phat/`
**Kế hoạch:** `plans/260921-1610-website-an-phat/PLAN.md`

## Kết quả

Đã dựng xong toàn bộ 5 nhóm trang trên Next.js 16 (App Router) + Tailwind CSS v4 +
Radix, đúng MASTER.md và 5 file override. `npm run build` tạo 42 route, `tsc --noEmit`
và `eslint src` đều sạch.

Đã kiểm tra bố cục thật trên trình duyệt ở 375, 768, 1024 và 1440px cho cả 8 trang:
không trang nào cuộn ngang, không cặp màu nào trượt tương phản WCAG AA, mỗi trang đúng
một `h1` và tiêu đề không nhảy bậc.

## Phạm vi đã giao

| Trang | Route | Đặc tả |
|-------|-------|--------|
| Trang chủ, 8 section | `/` | `home.md` |
| Danh mục có bộ lọc | `/san-pham` | `products.md` §A |
| Chi tiết sản phẩm | `/san-pham/[slug]` | `products.md` §B |
| Giới thiệu | `/gioi-thieu` | `about.md` |
| Danh sách tin tức | `/tin-tuc` | `news.md` §A |
| Bài viết | `/tin-tuc/[slug]` | `news.md` §B |
| Yêu cầu báo giá | `/yeu-cau-bao-gia` | `quote-contact.md` §A |
| Liên hệ | `/lien-he` | `quote-contact.md` §B |

Kèm theo: hệ token đầy đủ trong `globals.css` (light và dark khai báo song song), header
với mega menu, footer, và toàn bộ component MASTER §7. Dữ liệu mẫu gồm 26 hoá chất và
8 bài viết.

## Những lỗi đã tìm ra khi kiểm tra trên trình duyệt

Ba lỗi dưới đây chỉ lộ ra khi xem trang thật, không lỗi nào bị biên dịch hay lint bắt được.

**Nút trên nền tối mất màu chữ.** `tailwind-merge` xếp mọi class `text-<tên lạ>` vào nhóm
màu chữ, nên `text-label` và `text-on-dark` bị coi là xung khắc và class màu bị loại. Nút
"Gọi hotline" trong hero render chữ `#0F1D2E` trên nền `primary-900` — gần như vô hình.
Đã khai báo thang chữ tuỳ biến thành nhóm cỡ chữ trong `cn()` (`src/lib/utils.ts`).

**Nút trong ProductCard bị bóp còn 20px trên mobile.** `flex-1` trong container xếp dọc
đặt `flex-basis: 0` theo chiều cao, làm hai nút co lại dưới một nửa chiều cao thật. Đã
đổi thành `w-full sm:flex-1`.

**Trang tin tức nhảy bậc tiêu đề h1 → h3.** Lưới bài viết dùng `h3` mà không có tiêu đề
cấp 2 ở giữa. Đã thêm `h2` cho vùng danh sách, ẩn về mặt thị giác.

Ngoài ra đã nâng vùng chạm lên 44px trên mobile cho nút `sm`, nút icon, logo, link hotline
ở header, `summary` của nhóm 3 trong form báo giá và link điện thoại của từng kho, theo
MASTER §7.1.

## Hành vi đã kiểm chứng trực tiếp

- Lọc danh mục đồng bộ vào URL: bấm "Dung môi" cho `?nhom=dung-moi`, kết quả từ 26 còn 6,
  chip bộ lọc hiện đúng.
- Form báo giá điền sẵn từ trang sản phẩm: `?sp=axit-sulfuric-98&qc=Phuy 200 lít` điền
  đúng dòng đầu và hiện chip xác nhận ngữ cảnh.
- Validate form: gửi khi thiếu dữ liệu cho tóm tắt 5 lỗi có anchor, thông báo nêu nguyên
  nhân và cách sửa, tiêu điểm nhảy về field lỗi đầu tiên.
- Mega menu: mở bằng Enter, đóng bằng `Esc`, tiêu điểm trả về đúng nút đã mở.
- Khối hành động dính ở trang chi tiết trên mobile: cao đúng 72px, nằm sát đáy, trang
  chừa đúng 72px padding nên không che nội dung.
- `prefers-reduced-motion`: animation tắt hoàn toàn, số liệu ở dải tin cậy hiện thẳng giá
  trị cuối thay vì đếm lên.

## Hai chỗ đã diễn giải khi spec tự mâu thuẫn

**Nút `cta` trong lưới sản phẩm.** MASTER §7.4 quy định mỗi ProductCard có một nút `cta`,
nhưng `home.md` cấm hiển thị nhiều hơn một nút `cta` trong cùng khung nhìn. Đã thêm tham số
`quoteEmphasis` cho ProductCard: trang danh mục giữ `cta` theo MASTER §7.4 vì đó là trang
làm việc nơi báo giá là hành động chính, còn trang chủ và khối sản phẩm trong bài viết
dùng `outline` để nút `cta` duy nhất thuộc về hero và khối CTA cuối trang.

**Nút "Tải bản sao yêu cầu (PDF)".** Không có backend thì không có nơi sinh PDF. Màn hình
xác nhận dùng nút "Lưu bản sao (in ra PDF)" mở hộp thoại in của trình duyệt — hành vi
thật, nhãn nói đúng việc nó làm, kèm bản sao yêu cầu dạng văn bản ngay trên màn hình.

## Giới hạn của bản dựng này

- **Dữ liệu mẫu.** Tên công ty, hotline, địa chỉ, số hiệu giấy tờ và số liệu năng lực là
  chỗ dành sẵn, cố tình để dạng dễ nhận ra. Chân trang có dòng thông báo, tắt bằng
  `IS_SAMPLE_CONTENT`. Tên hoá chất, công thức, số CAS, mã HS và phân loại GHS lấy từ dữ
  liệu tra cứu công khai nên chính xác.
- **Ảnh.** Chưa có ảnh thật nào. `PlaceholderImage` giữ đúng tỉ lệ khung nên không gây
  layout shift, và nêu rõ ảnh nào cần đặt vào vị trí đó.
- **Pictogram GHS.** Là bản dựng vector của bộ ký hiệu UN, không phải tệp SVG chính thức.
  Cần thay trước khi phát hành; `ghs-pictogram.tsx` là điểm thay duy nhất.
- **Form không gửi lên máy chủ.** Theo quyết định chưa làm backend, `submitQuoteRequest()`
  mở ứng dụng email của người dùng với nội dung đã soạn sẵn. Màn hình xác nhận nói yêu cầu
  "đã được soạn xong", không nói đã gửi.
- **Section "Đội ngũ" ở trang giới thiệu không có.** `about.md` yêu cầu bỏ hẳn section nếu
  không có ảnh thật của nhân sự thật.
- **Dark mode chưa kiểm thử.** Token khai báo song song đầy đủ theo MASTER §2.6 nhưng
  không nằm trong phạm vi phát hành đầu.
- **Bài viết cần rà soát chuyên môn.** Nội dung kỹ thuật dựa trên kiến thức hoá học phổ
  thông và thực hành vận hành thông dụng; cần người phụ trách kỹ thuật của An Phát duyệt
  và bổ sung nguồn tham chiếu cụ thể trước khi phát hành.

## Câu hỏi cần bạn quyết

1. Tên miền thật là gì? Hiện `metadataBase` và link chia sẻ bài viết dùng
   `https://hoachatanphat.example.com`.
2. Khi nào có ảnh thật của kho, bồn chứa, xe bồn và bản scan giấy tờ? Đây là phần còn
   thiếu lớn nhất so với yêu cầu "chứng cứ trước lời quảng cáo" của MASTER §1.
3. Có muốn tôi nối backend cho form báo giá luôn không, và theo hướng nào — gửi email qua
   dịch vụ như Resend, hay lưu vào database?
