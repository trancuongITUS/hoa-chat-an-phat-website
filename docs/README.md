# Website Hoá chất An Phát

Website B2B giới thiệu và phân phối hoá chất công nghiệp. Không có giỏ hàng, không có
checkout, không hiển thị giá — mọi ý định mua đều dẫn về form yêu cầu báo giá hoặc hotline.

Nguồn thiết kế bắt buộc: [`design-system/hoa-chat-an-phat/`](design-system/hoa-chat-an-phat/).
Khi dựng một trang, đọc `pages/<ten-trang>.md` trước; quy tắc trong đó ghi đè `MASTER.md`.
Logo và nhận diện thương hiệu (đã chốt biểu tượng Lục giác giọt):
[`design-system/hoa-chat-an-phat/brand/brand-identity.md`](design-system/hoa-chat-an-phat/brand/brand-identity.md).

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:3210
npm run build      # bản phát hành
npm start          # chạy bản đã build, cổng 3210
npm run typecheck  # tsc --noEmit
npx eslint src     # lint
```

Cổng 3210 cố định cho dự án này. Nếu cổng bận, dừng tiến trình đang giữ nó thay vì đổi
sang cổng khác.

## Cấu trúc

| Thư mục | Nội dung |
|---------|----------|
| `src/app/` | Route theo App Router; mỗi thư mục là một trang trong design system |
| `src/components/ui/` | Primitive dùng chung: Button, Field, Dialog/Drawer, Toaster, trạng thái rỗng và skeleton |
| `src/components/layout/` | Header + mega menu, footer, breadcrumb, điều phối tiêu điểm khi chuyển trang |
| `src/components/product/` | ProductCard, SpecTable, HazardChip, khối tài liệu, khối hành động |
| `src/components/content/` | ArticleCard, callout, mục lục và thanh tiến trình đọc |
| `src/data/` | Toàn bộ nội dung: sản phẩm, bài viết, thông tin công ty, phân loại |
| `src/lib/` | Lọc danh mục, nghiệp vụ form báo giá, tiện ích dùng chung |

Route ↔ đặc tả: `/` → `home.md` · `/san-pham` và `/san-pham/[slug]` → `products.md` ·
`/gioi-thieu` → `about.md` · `/tin-tuc` và `/tin-tuc/[slug]` → `news.md` ·
`/yeu-cau-bao-gia` và `/lien-he` → `quote-contact.md`. `/nguon-anh` là trang ghi công ảnh,
không có đặc tả riêng.

## Token thiết kế

Toàn bộ màu, thang chữ, bo góc, đổ bóng và chuyển động khai báo trong
`src/app/globals.css`, ánh xạ 1–1 với MASTER §2–§6. Component chỉ dùng token ngữ nghĩa
(`bg-primary-600`, `text-on-dark`, `shadow-md`), không viết hex thô.

Mỗi token màu khai báo song song cả light và dark. Dark mode **chưa** nằm trong phạm vi
phát hành đầu và chưa được kiểm thử, nhưng token không được để khuyết một bên.

`cn()` trong `src/lib/utils.ts` cấu hình `tailwind-merge` để nhận thang chữ tuỳ biến
(`text-h1`, `text-body-lg`, `text-label`…) là nhóm cỡ chữ. Thiếu cấu hình này,
`tailwind-merge` coi chúng là màu chữ và loại mất class màu đứng trước.

## Những chỗ cần thay khi có dữ liệu thật

Bản dựng hiện chạy trên **dữ liệu mẫu**, có ghi chú ngay đầu mỗi tệp và một dòng thông
báo ở chân trang (bật/tắt bằng `IS_SAMPLE_CONTENT` trong `src/data/company.ts`).

| Cần thay | Ở đâu |
|----------|-------|
| Tên công ty, hotline, email, địa chỉ, mã số thuế, số liệu năng lực, giấy tờ, kho | `src/data/company.ts` |
| Danh mục hoá chất | `src/data/products.ts` — tên, công thức, số CAS, mã HS và phân loại GHS lấy từ dữ liệu tra cứu công khai nên chính xác; tình trạng kho, quy cách, xuất xứ và ngày chứng từ là chỗ dành sẵn |
| Bài viết | `src/data/articles.ts` — cần người phụ trách kỹ thuật rà soát trước khi phát hành |
| Tài liệu MSDS/COA/CO/CQ | `public/tai-lieu/` — thay bằng tệp thật; dung lượng hiển thị đọc trực tiếp từ tệp nên không bao giờ lệch |
| Ảnh | `src/data/images.ts` — ảnh minh hoạ có giấy phép tự do (Wikimedia Commons), tệp WebP ở `public/images/`. Ảnh kho, xe bồn, văn phòng và bài "kho Hải Phòng" không phải của An Phát, phải thay bằng ảnh thật. Vị trí chưa có ảnh (chứng nhận, bản đồ, PAC, polyacrylamide) tự hiện `PlaceholderImage`. Nguồn, giấy phép và gợi ý cắt/làm mờ của từng ảnh nằm trong `assets/raw-images/image-map.json`; trang `/nguon-anh` ghi công tác giả theo điều kiện CC BY/BY-SA, nên ảnh thêm mới phải có đủ trường `credit` |
| Pictogram GHS | `src/components/ghs-pictogram.tsx` — thay bằng tệp SVG chính thức của UN, giữ nguyên hình thoi viền đỏ |

## Backend cho form báo giá

Dự án chưa có backend. `submitQuoteRequest()` trong `src/lib/rfq.ts` là **điểm nối duy
nhất**: hiện nó mở ứng dụng email của người dùng với nội dung yêu cầu đã soạn sẵn, nên
form làm việc thật chứ không giả vờ đã gửi.

Khi có API, thay phần thân hàm bằng lời gọi `fetch` và trả về mã yêu cầu do máy chủ cấp.
Không nơi nào khác cần sửa. Lưu ý sửa lại màn hình xác nhận trong
`src/components/quote/quote-form.tsx` cho khớp: hiện nó nói yêu cầu "đã được soạn xong",
không nói "đã gửi".

Form liên hệ ngắn ở `src/components/contact/contact-form.tsx` hoạt động theo cùng nguyên tắc.

## Ràng buộc không được vi phạm

- Không hiển thị giá dưới bất kỳ hình thức nào, kể cả "giá tham khảo".
- Không giỏ hàng, không checkout, không huy hiệu số lượng ở header.
- Không nút chat nổi. An Phát chưa có Zalo OA; ngoại lệ duy nhất là link chia sẻ Zalo
  công khai ở cuối bài viết.
- Phân loại nguy hại GHS luôn hiện kèm pictogram và chữ, không bao giờ chỉ bằng màu.
- Bảng thông số không cuộn ngang trên mobile — chuyển sang danh sách định nghĩa xếp dọc.
- Mỗi khung nhìn tối đa một nút `cta`. Lưới sản phẩm ở trang chủ và trong bài viết dùng
  `quoteEmphasis="outline"` để nút `cta` duy nhất thuộc về hero và khối CTA cuối trang.
