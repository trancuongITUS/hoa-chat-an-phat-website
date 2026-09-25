# Scout Report — Ảnh tạm, ảnh rỗng, ảnh chưa thực tế

Ngày: 2026-09-23. Phạm vi: `src/`, `public/`, đối chiếu `docs/design-system/hoa-chat-an-phat/`.

## Kết luận

Website chưa có một ảnh nội dung thật nào. Mọi vị trí ảnh đều đi qua một component duy nhất
là `src/components/placeholder-image.tsx`. Component này vẽ khung sọc chéo, icon `ImageOff`,
dòng mô tả và nhãn "Ảnh mẫu" hiển thị công khai. Thư mục `public/` không có file ảnh nào,
chỉ có 4 file PDF mẫu. Trong mã nguồn không có chú thích `TODO` hay `FIXME` theo nghĩa đen.
Các chỗ "còn chờ" được ghi bằng chú thích tiếng Việt, liệt kê ở mục D.

Tổng cộng cần khoảng 46 ảnh thật và 6 logo khách hàng, chưa tính ảnh chia sẻ mạng xã hội.

## A. Ảnh tạm dùng `PlaceholderImage` (8 điểm gọi, 7 file)

| # | Vị trí | Ảnh cần thay | Số ảnh | Hiển thị ở |
|---|--------|--------------|--------|-----------|
| 1 | `src/app/page.tsx:44` | Ảnh nền hero: kho chứa và hệ bồn (tone dark, phủ lớp tối 60%) | 1 | Trang chủ |
| 2 | `src/app/page.tsx:185`, nhãn lấy từ `src/data/company.ts:45`, `:53`, `:61` | Kho và bồn, xe bồn chở hoá chất, khu lấy mẫu và kiểm định (16:10) | 3 | Trang chủ, mục "Năng lực cung ứng" |
| 3 | `src/components/certificate-card.tsx:34` (thumbnail) và `:55` (modal) | Bản scan 6 giấy tờ (3:4), nhãn ở `src/data/company.ts:83–123` | 6 | Trang chủ (`page.tsx:223`) và Giới thiệu (`gioi-thieu/page.tsx:117`) |
| 4 | `src/app/gioi-thieu/page.tsx:67` | Văn phòng và khu kho chính tại Bình Dương (4:3) | 1 | Giới thiệu |
| 5 | `src/components/product/product-card.tsx:48` | Ảnh sản phẩm theo quy cách đóng gói đầu tiên (4:3) | 26 | `/san-pham`, trang chủ, sản phẩm liên quan, cuối bài viết |
| 6 | `src/app/san-pham/[slug]/page.tsx:96` | Cùng ảnh sản phẩm như mục 5, khổ lớn | (dùng chung 26 ảnh) | 26 trang chi tiết sản phẩm |
| 7 | `src/components/content/article-card.tsx:45` | Ảnh bìa bài viết (16:9) | 8 | `/tin-tuc` và mục bài liên quan |
| 8 | `src/components/contact/deferred-map.tsx:32` | Ảnh tĩnh bản đồ kho, hiện trước khi người dùng bấm "Xem bản đồ" (16:9) | 1 | `/lien-he` (`lien-he/page.tsx:137`) |

Mục 1 cần ưu tiên. Ảnh hero là LCP, và `home.md` dòng 11 và 43 yêu cầu ảnh kho thật dùng
`next/image` với `priority` và định dạng AVIF. Hiện tại hero chỉ là khung sọc chéo tối màu.

## B. Khung rỗng giữ chỗ (không phải ảnh)

- **Logo khách hàng**: `src/app/page.tsx:245` render 6 ô viền đứt nét chỉ chứa chữ
  (ví dụ "Khách hàng ngành dệt nhuộm"). Dữ liệu nằm ở `src/data/company.ts:234`
  (`CLIENT_LOGO_PLACEHOLDERS`). Theo `home.md` §7, chỉ được đăng logo khi khách đã đồng ý bằng văn bản.

## C. Ảnh còn thiếu hoàn toàn

- **Ảnh chia sẻ mạng xã hội (OG image)**: `src/app` không có `opengraph-image`. Khối `openGraph`
  ở `src/app/layout.tsx:19` và `src/app/tin-tuc/[slug]/page.tsx:34` không khai báo `images`.
  Link chia sẻ lên Zalo hoặc Facebook sẽ không có ảnh xem trước.
- `metadataBase` ở `src/app/layout.tsx:13` và `SITE_ORIGIN` ở `src/app/tin-tuc/[slug]/page.tsx:20`
  đang là `https://hoachatanphat.example.com`. Khi có OG image, URL tuyệt đối của ảnh sẽ trỏ sai
  domain cho đến khi sửa giá trị này.

## D. Chú thích "còn chờ" liên quan đến ảnh

- `src/components/placeholder-image.tsx:5–14` ghi rõ An Phát chưa cung cấp ảnh kho, ảnh sản phẩm
  và bản scan chứng nhận. Đây là điểm thay duy nhất: khi có ảnh thật thì đổi sang `next/image` có
  khai báo `width` và `height`. Chú thích này nói "MASTER §12 cấm dùng ảnh stock", nhưng MASTER §12
  thực tế không có dòng đó. Quy định gần nhất nằm ở `pages/home.md` dòng 11: ảnh hero phải là ảnh
  kho hoặc bồn chứa thật, không dùng ảnh stock phòng lab kiểu minh hoạ.
- `src/app/gioi-thieu/page.tsx:20–21`: section "Đội ngũ" cố tình chưa làm vì cần ảnh thật của nhân
  sự thật. Khi có ảnh thì thêm section này.

## E. Tài nguyên mẫu đi kèm (không phải ảnh, nhưng gắn với các ảnh trên)

- `public/tai-lieu/{msds,coa,co,cq}-mau.pdf`: mỗi file khoảng 1,1 KB. Toàn bộ 26 sản phẩm trỏ tới
  4 file này qua `src/data/products.ts:20–25`.
- Nút "Tải bản PDF" trong modal chứng nhận (`src/components/certificate-card.tsx:58`) trỏ cứng
  `/tai-lieu/cq-mau.pdf` cho cả 6 giấy tờ. Khi có bản scan thật, cần thêm trường file PDF riêng
  vào kiểu `Certificate` (`src/data/company.ts:64`).
- `IS_SAMPLE_CONTENT = true` (`src/data/company.ts:10`) làm footer hiện băng thông báo dữ liệu mẫu
  (`src/components/layout/site-footer.tsx:88`).

## Đã kiểm tra và không có vấn đề

- `src/app/icon.svg` và `src/app/apple-icon.png` giống hệt từng byte với file logo chính thức trong
  `docs/design-system/hoa-chat-an-phat/brand/logo/`.
- `src/components/brand-mark.tsx` và `src/components/ghs-pictogram.tsx` là SVG vẽ bằng code theo
  chuẩn, không phải ảnh tạm.
- `ProductCardSkeleton` trong `src/app/san-pham/loading.tsx` là skeleton lúc tải trang, được thiết kế
  như vậy.

## Câu hỏi chưa giải quyết

- Trang chi tiết bài viết (`src/app/tin-tuc/[slug]/page.tsx`) không có ảnh bìa, chỉ thẻ bài viết
  mới có. Cần xem lại `news.md` để biết trang chi tiết có bắt buộc ảnh bìa hay không.
- Ảnh tĩnh bản đồ (mục A.8) nên là ảnh chụp bản đồ thật hay chỉ là một nền trung tính? Nếu dùng ảnh
  chụp từ Google Maps thì cần kiểm tra điều khoản sử dụng.
- Ảnh sản phẩm là mỗi mã một ảnh riêng, hay một ảnh chung cho từng loại bao bì (can, phuy, bao)?
  Câu trả lời quyết định cần 26 ảnh hay chỉ vài ảnh.
