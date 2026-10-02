---
phase: 4
title: "Phase 4: Chuyển trang công khai sang đọc database"
status: todo
priority: P1
effort: "3d"
dependencies: [3]
---

# Phase 4: Chuyển trang công khai sang đọc database

<!-- Updated: Red Team 2026-09-30 - route group chuyển về đây, not-found ở gốc, Suspense hẹp, 404 thật, JSON-LD an toàn, error boundary, so sánh bằng Playwright, client-marquee -->

## Overview

Mọi trang công khai đọc bài viết và thông tin công ty từ các loader của phase 3, thay vì từ `src/data/articles.ts` và `src/data/company.ts`. **Giao diện và mã HTTP phải giống hệt trước khi chuyển.** Đây là mốc an toàn: kể cả khi admin chưa có, site vẫn chạy đúng trên dữ liệu đã seed. Sản phẩm vẫn đọc từ `src/data/products.ts`.

## Hiện trạng cần xử lý (đã scout và red-team xác minh)

- **Server component đọc `COMPANY` hoặc mảng công ty:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/gioi-thieu/page.tsx`, `src/app/lien-he/page.tsx`, `src/app/yeu-cau-bao-gia/page.tsx`, `src/app/not-found.tsx`, `src/app/tin-tuc/[slug]/page.tsx`, `src/components/layout/site-footer.tsx`.
- **Client component** (`'use client'`) import thẳng dữ liệu công ty: `src/components/layout/site-header.tsx`, `src/components/contact/contact-form.tsx` (`CONTACT_TOPICS[0]` ở dòng 33), `src/components/quote/quote-form.tsx`, `src/components/product/product-actions.tsx`, `src/components/home/trust-stats.tsx`.
- `src/lib/rfq.ts` dùng `COMPANY.email` để dựng link `mailto:`. Chuyển email thành tham số (caller duy nhất: `quote-form.tsx`).
- `src/components/content/article-card.tsx` và `src/app/nguon-anh/page.tsx` đọc `ARTICLE_COVERS` theo slug.
- `src/components/home/client-marquee.tsx` đọc `client.src`. Logo chuyển sang `logo: SiteImage`.
- `src/app/page.tsx` lấy ảnh năng lực từ `CAPABILITIES[i].image`. Sau phase này, ảnh năng lực lấy từ `CAPABILITY_IMAGES[i]` trong code.
- **Domain bị hard-code** `https://hoachatanphat.example.com` ở `src/app/layout.tsx:13` và `src/app/tin-tuc/[slug]/page.tsx:20`. Chuyển sang `SITE_URL`, đọc lúc chạy.
- **Ba thẻ JSON-LD** dùng `JSON.stringify` trần trong `dangerouslySetInnerHTML`: `src/components/layout/breadcrumbs.tsx:31`, `src/app/tin-tuc/[slug]/page.tsx:79`, `src/app/san-pham/[slug]/page.tsx:69`. Sau phase này, tiêu đề, tóm tắt và tác giả do biên tập viên nhập sẽ đi vào hai trong ba chỗ này.
- **Dự án chưa có `error.tsx` hay `global-error.tsx`.**
- Chỗ dùng `searchParams` hoặc `new Date()`: `src/app/tin-tuc/page.tsx`, `src/app/san-pham/page.tsx`, `src/components/layout/site-footer.tsx`, `src/components/quote/quote-form.tsx`, `src/lib/rfq.ts`. Cần xử lý nếu phase 3 chọn mô hình A.

## Requirements

### Bước 0: tách route group (làm trước khi chụp trạng thái "trước")

- [ ] Chuyển mọi route công khai vào `src/app/(site)/`. URL không đổi.
- [ ] Tạo `src/components/layout/site-chrome.tsx` gồm: link "Bỏ qua tới nội dung chính", `SiteHeader`, `RouteFocus`, `<main id="noi-dung-chinh">`, `SiteFooter`.
- [ ] `(site)/layout.tsx` dùng `SiteChrome`. Root `layout.tsx` chỉ giữ `<html>`, font, `globals.css` và `Toaster`.
- [ ] **`src/app/not-found.tsx` ở lại thư mục gốc** và tự bọc nội dung bằng `SiteChrome`, vì chỉ `not-found` ở gốc mới bắt được URL không khớp route nào.
- [ ] Chạy lại build, kiểm tra `/khong-ton-tai` trả 404 và có header, rồi mới chụp trạng thái "trước".

### Chuyển nguồn dữ liệu

- [ ] `src/components/site-settings-provider.tsx` (client) cung cấp `SiteSettingsView` qua context cho client component (`useSiteSettings()`). Provider và phần đọc settings nằm trong `SiteChrome`, và mỗi đảo phụ thuộc settings (header, footer) có **`<Suspense>` hẹp riêng** với fallback cùng kích thước. Không bọc cả cây.
- [ ] Server component đọc thẳng `await getSiteSettings()`.
- [ ] `generateMetadata` của layout dùng `SITE_URL` và tên công ty từ settings, chỉ đọc lúc chạy (sau `connection()`).
- [ ] Tách phần thân trang bài viết thành `src/components/content/article-view.tsx` (gồm `ArticleBlockView`). Trang công khai và trang xem trước ở phase 7 dùng chung component này.
- [ ] `/tin-tuc/[slug]` lấy bài ở cấp trang, **ngoài mọi `<Suspense>`**, để bài không tồn tại hoặc đã gỡ trả **404 thật**.
- [ ] `/tin-tuc` và `relatedArticles` chuyển sang `getPublishedArticles()`. Logic lọc, phân trang, bài nổi bật và bài liên quan giữ nguyên.
- [ ] `ArticleCard` dùng `article.cover`. `ClientMarquee` dùng `logo`.
- [ ] Trang chủ ẩn cả khối logo khách hàng khi `clientLogos` rỗng, vì khung cài đặt cho production không có logo.
- [ ] `/nguon-anh` gộp ghi công từ ba nguồn, **bỏ qua ảnh không có `credit`**:
  - ảnh trong code (`SITE_IMAGES`, `PRODUCT_IMAGES`, `CAPABILITY_IMAGES`);
  - logo khách hàng trong settings;
  - ảnh bìa của các bài đã đăng.
- [ ] Dải "dữ liệu mẫu" ở chân trang đọc `showSampleNotice`.

### An toàn và lỗi

- [ ] `src/lib/json-ld.ts` export `serializeJsonLd(value)`: `JSON.stringify`, rồi thay mỗi ký tự `<`, `>`, `&`, U+2028, U+2029 bằng chuỗi thoát Unicode tương ứng (dấu gạch chéo ngược, chữ `u`, bốn chữ số hex). Dùng ở **cả ba** thẻ JSON-LD. Test với tiêu đề chứa `</script><script>`.
- [ ] `eslint.config.mjs` thêm hai luật:
  - `no-restricted-syntax` cấm `JSON.stringify` nằm trực tiếp trong `dangerouslySetInnerHTML`;
  - `no-restricted-imports` cấm `src/app/**` và `src/components/**` import `@/data/seed/*`.
- [ ] Thêm `src/app/global-error.tsx` và `src/app/(site)/error.tsx`. Cả hai có thông báo tiếng Việt, hotline dự phòng viết cứng (không đọc DB) và nút tải lại.

### Dọn dẹp

- [ ] Xoá `src/data/company.ts`, `ARTICLE_COVERS`, `public/images/articles/` và `public/images/clients/`. Bản gốc đã nằm trong `assets/processed-images/`.

## Kiểm tra giống hệt trước và sau

Dùng Playwright (`npm i -D playwright`) trong `scripts/parity-capture.ts`. Với mỗi route, lưu ba thứ:
- mã HTTP;
- `document.body.innerText` sau khi trang tải xong (kể cả phần stream);
- danh sách `id` của mọi heading.

Không so HTML thô.

- **Route:**
  - `/`, `/gioi-thieu`, `/lien-he`, `/yeu-cau-bao-gia`, `/san-pham`, `/nguon-anh`;
  - `/tin-tuc`, `/tin-tuc?chuyenmuc=an-toan-tuan-thu`, `/tin-tuc?trang=1`;
  - cả 8 `/tin-tuc/<slug>`, 3 `/san-pham/<slug>`;
  - `/khong-ton-tai`, `/tin-tuc/khong-co`, `/san-pham/khong-co`.
- **"Trước":** sau bước 0, trên dữ liệu cũ. **"Sau":** sau khi chuyển, trên DB đã chạy `seed --demo`.
- **Chênh lệch được phép:** `readingMinutes`, và thứ tự ghi công trên `/nguon-anh`. Mã HTTP và `id` heading phải giống hệt.
- **Ảnh chụp màn hình:** trang chủ, `/tin-tuc`, một bài viết và `/lien-he`, ở 375px và 1440px. So bằng mắt, đặc biệt là điểm cắt ảnh bìa (`position`) và độ nét của logo.

## Related Code Files

- Create: `src/app/(site)/layout.tsx`, `src/components/layout/site-chrome.tsx`, `src/components/site-settings-provider.tsx`, `src/components/content/article-view.tsx`, `src/lib/json-ld.ts`, `src/lib/json-ld.test.ts`, `src/app/global-error.tsx`, `src/app/(site)/error.tsx`, `scripts/parity-capture.ts`
- Move (vào `src/app/(site)/`): `page.tsx`, `gioi-thieu/`, `lien-he/`, `nguon-anh/`, `san-pham/`, `tin-tuc/`, `yeu-cau-bao-gia/`
- Modify:
  - Trang: `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/(site)/page.tsx`, `src/app/(site)/gioi-thieu/page.tsx`, `src/app/(site)/lien-he/page.tsx`, `src/app/(site)/yeu-cau-bao-gia/page.tsx`, `src/app/(site)/nguon-anh/page.tsx`, `src/app/(site)/tin-tuc/page.tsx`, `src/app/(site)/tin-tuc/[slug]/page.tsx`, `src/app/(site)/san-pham/page.tsx`, `src/app/(site)/san-pham/[slug]/page.tsx`.
  - Component: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/breadcrumbs.tsx`, `src/components/contact/contact-form.tsx`, `src/components/quote/quote-form.tsx`, `src/components/product/product-actions.tsx`, `src/components/home/trust-stats.tsx`, `src/components/home/client-marquee.tsx`, `src/components/content/article-card.tsx`.
  - Khác: `src/lib/rfq.ts`, `src/data/images.ts`, `src/data/types.ts` (`ClientLogo.logo`), `eslint.config.mjs`, `package.json`.
- Delete: `src/data/company.ts`, `public/images/articles/`, `public/images/clients/`

## Implementation Steps

1. Bước 0: tách route group, `SiteChrome`, `not-found` ở gốc. Build và kiểm tra.
2. Chụp trạng thái "trước".
3. `serializeJsonLd` và hai luật ESLint (làm sớm, vì đây là lỗi bảo mật).
4. Dựng provider và `<Suspense>` hẹp cho header/footer.
5. Chuyển lần lượt: header và footer; trang chủ (kèm `client-marquee`, ảnh năng lực); giới thiệu; liên hệ và báo giá (kèm `rfq.ts`); trang 404. Chạy `npm run dev` sau mỗi nhóm.
6. Tách `ArticleView`, rồi chuyển `/tin-tuc`, `/tin-tuc/[slug]` và `ArticleCard`.
7. Chuyển `/nguon-anh`, thêm `error.tsx` và `global-error.tsx`.
8. Dọn dẹp, chụp trạng thái "sau" và so sánh.

## Todo

- [ ] Tách route group, `SiteChrome`, `not-found` ở gốc
- [ ] Chụp trạng thái "trước" bằng Playwright
- [ ] `serializeJsonLd` ở 3 chỗ, test và luật ESLint
- [ ] Provider và `<Suspense>` hẹp
- [ ] Chuyển các trang và component dùng thông tin công ty (kèm `client-marquee`, ẩn khối logo khi rỗng)
- [ ] Tách `ArticleView`; chuyển tin tức (404 thật) và `ArticleCard`
- [ ] Chuyển `/nguon-anh` (bỏ qua ảnh không có ghi công)
- [ ] `global-error.tsx` và `(site)/error.tsx`
- [ ] Xoá dữ liệu cũ; chụp "sau" và so sánh

## Success Criteria

- Kết quả so sánh của Playwright không có khác biệt ngoài hai loại được phép. Mã HTTP khớp từng route, kể cả **404** cho `/khong-ton-tai`, `/tin-tuc/khong-co`, `/san-pham/khong-co`.
- Đặt tiêu đề một bài thành `</script><script>alert(1)</script>` trong DB: trang bài viết không chạy script, và JSON-LD vẫn hợp lệ.
- Sửa `hotlineDisplay` trong DB rồi restart app: header, footer, trang liên hệ và nút gọi trong trang sản phẩm đều đổi.
- Tắt Postgres: trang lỗi thân thiện hiện ra, không phải trang trắng hay stack trace.
- `DATABASE_URL= npm run build` vẫn thành công.
- `grep -rn "hoachatanphat.example.com" src` không còn kết quả.
- `npm test`, `npm run typecheck`, `npm run lint` sạch.

## Risk Assessment

- **Phase lớn, chạm nhiều file:** chia commit theo từng bước. Mỗi commit phải build được.
- **Fallback của `<Suspense>` gây nhảy bố cục (CLS):** fallback cùng kích thước; kiểm tra bằng ảnh chụp.
- **Cả site phụ thuộc DB:** giảm thiểu bằng cache trong bộ nhớ (chỉ lần đọc đầu tiên sau khi khởi động là chạm DB) và error boundary. Phase 8 tách health check để một lần DB chập chờn không gây rollback.

## Security Considerations

- Mọi thẻ JSON-LD đi qua `serializeJsonLd`, và luật ESLint chặn cách viết cũ quay lại.
- Link nguồn ảnh chỉ nhận `http:`/`https:` (đã kiểm tra ở `imageCreditSchema`, phase 1).
