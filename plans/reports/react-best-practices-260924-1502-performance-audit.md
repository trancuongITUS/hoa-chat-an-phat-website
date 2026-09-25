# Audit hiệu năng React/Next.js — 2026-09-24

Rà soát theo bộ quy tắc Vercel React Best Practices (skill `ak-react-best-practices`).
Mọi con số đo trên bản build production (`next build` + `next start`), tải từng chunk JS
qua HTTP và tính tổng byte thô lẫn gzip mà trình duyệt thực sự nhận.

## Kết quả

| Trang | JS gzip trước | JS gzip sau | Giảm |
|-------|--------------:|------------:|-----:|
| `/` | 237,1 KB | 227,4 KB | −9,7 KB |
| `/san-pham` | 239,9 KB | 230,1 KB | −9,8 KB |
| `/san-pham/[slug]` | 237,1 KB | 227,4 KB | −9,7 KB |
| `/yeu-cau-bao-gia` | 326,5 KB | 248,7 KB | **−77,8 KB (−24%)** |
| `/lien-he` | 323,0 KB | 245,1 KB | **−77,9 KB (−24%)** |
| `/tin-tuc` | 234,8 KB | 225,1 KB | −9,7 KB |
| `/gioi-thieu` | 236,4 KB | 226,6 KB | −9,8 KB |

Phần còn lại (~225 KB gzip) chủ yếu là runtime React 19 + Next.js, có mặt ở mọi ứng dụng App Router.

## Đã sửa

### 1. Toàn bộ dữ liệu sản phẩm lọt vào JS của mọi trang (`bundle-*`, `server-serialization`) — CRITICAL

Chuỗi import: `site-header.tsx` (client, nằm trong layout) → `layout/navigation.ts` →
`FILTER_KEYS` từ `lib/catalog.ts` → module này import `PRODUCTS` và tính facet ở top-level.
Vì có tính toán ở top-level, bundler không loại được mảng `PRODUCTS`, nên chunk 95,7 KB
chứa toàn bộ danh mục được tải trên mọi trang, kể cả `/tin-tuc`. Điều này trái với chú
thích trong `san-pham/page.tsx` ("toàn bộ dữ liệu sản phẩm không phải gửi xuống trình duyệt").

- `src/lib/catalog.ts` giờ chỉ còn hợp đồng URL (khóa tham số, kiểu, parse/build query), không import dữ liệu.
- `src/lib/catalog-search.ts` (mới) chứa `CATALOG_FACETS` và `filterProducts`, chỉ server component dùng.
- `FilterPanel` và `MobileCatalogToolbar` nhận `facets` qua props từ trang danh mục.
- `QuoteForm` không còn import `PRODUCTS`; trang `/yeu-cau-bao-gia` truyền danh sách rút gọn
  (`slug`, `name`, `chemicalName`, `cas`, `packaging`) qua prop `products`.

Xác minh: sau khi sửa, chuỗi CAS `7664-93-9` không còn xuất hiện trong bất kỳ chunk JS nào.

### 2. Zod đóng gói cả ~40 locale vào trang form (`bundle-*`) — CRITICAL

`import { z } from 'zod'` kéo theo chunk 391 KB thô / 90 KB gzip trên `/yeu-cau-bao-gia` và `/lien-he`.
Chuyển sang `zod/mini` (cùng package `zod`, không thêm dependency) **với import theo tên**.
Chỉ đổi sang `zod/mini` mà vẫn dùng namespace `z` thì chưa đủ: namespace chứa `z.locales` nên
toàn bộ locale vẫn bị đóng gói (đo được chỉ giảm 16 KB). Import theo tên thì giảm được 78 KB.

- `src/lib/rfq.ts`, `src/components/contact/contact-form.tsx`.
- Kiểm tra tương đương: chạy schema cũ (classic) và mới (mini) trên 16 input (hợp lệ, thiếu trường,
  sai định dạng, trim, `partial` cho bản nháp). Kết quả và thông báo lỗi giống hệt nhau, trừ
  giới hạn 1–10 dòng: bản mini không nạp locale nên tôi đặt message tiếng Việt thay cho message
  tiếng Anh mặc định trước đây. UI vốn đã chặn hai trường hợp này nên người dùng không gặp.

### 3. `ProductActions` nhận cả bản ghi `Product` (`server-serialization`) — MEDIUM

Component client chỉ dùng `slug` và `packaging` nhưng nhận toàn bộ sản phẩm (thông số, chứng
từ, mô tả), nên tất cả bị serialize vào RSC payload. Giờ trang chi tiết chỉ truyền hai trường đó.
Chưa đo mức giảm payload riêng cho thay đổi này.

### 4. `ReadingProgress` render lại theo từng sự kiện cuộn (`rerender-*`) — LOW

`setState` trong listener `scroll` làm React render lại hàng chục lần mỗi giây. Giờ ghi thẳng
`transform` qua ref; component không render lại khi cuộn. Đã xác minh thanh đi từ `scaleX(0)`
→ `0.5` ở giữa bài → `1` ở cuối bài.

## Đã rà soát, không cần sửa

- **Waterfall phía server**: dữ liệu là module tĩnh trong bộ nhớ, không có `await` tuần tự.
- **Barrel import `lucide-react`**: Next.js tối ưu sẵn qua `optimizePackageImports` mặc định.
- **Ảnh**: dùng `next/image` với `sizes`; ảnh LCP (hero, ảnh sản phẩm) có `preload`; bật AVIF/WebP.
- **Font**: `next/font`, chỉ preload font tiêu đề.
- **Bản đồ Google**: đã hoãn tải iframe tới khi người dùng bấm (`DeferredMap`).
- **State dẫn xuất**: `SiteHeader`, `FilterPanel` đồng bộ state trong lượt render thay vì effect — đúng mẫu.
- **Theo dõi media/scroll**: dùng `useSyncExternalStore`, listener `passive`.

## Xác minh

- `npm run typecheck`, `npx eslint src`: sạch. `npm run build`: thành công, chế độ render của các route không đổi.
- Kiểm tra trên trình duyệt (bản production): bộ lọc desktop và drawer mobile hiển thị đủ facet
  và cập nhật URL; form báo giá điền sẵn đúng sản phẩm và quy cách từ `?sp=&qc=`, gợi ý 26 hoá chất,
  hiện lỗi validate tiếng Việt; form liên hệ hiện lỗi đúng; không có lỗi console.

## Phát hiện ngoài phạm vi hiệu năng (chưa sửa)

**Bản nháp form báo giá không khôi phục khi form còn điền dở.** `loadDraft()` trong
`src/lib/rfq.ts` kiểm tra bản nháp bằng `quoteRequestSchema.partial()`. `partial()` chỉ cho phép
thiếu khóa; một trường có mặt nhưng rỗng (ví dụ `contactName: ''`) vẫn trượt check `min(1)`,
nên cả bản nháp bị bỏ. Hệ quả: bản nháp chỉ được khôi phục khi mọi trường bắt buộc đã hợp lệ,
trái với dòng hứa hẹn trên form ("có thoát ra giữa chừng cũng không mất dữ liệu đã nhập").
Đã xác minh với cả zod classic lẫn mini. Hướng sửa: kiểm tra bản nháp bằng một schema chỉ xét
kiểu dữ liệu (chuỗi, mảng dòng) thay vì schema nghiệp vụ.

## Câu hỏi còn mở

- Có muốn sửa lỗi khôi phục bản nháp ở trên không?
