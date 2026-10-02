---
phase: 3
title: "Phase 3: Seed dữ liệu và lớp đọc nội dung có cache"
status: todo
priority: P1
effort: "2d"
dependencies: [1, 2]
---

# Phase 3: Seed dữ liệu và lớp đọc nội dung có cache

<!-- Updated: Red Team 2026-09-30 - spike thêm tiêu chí 404 và phần tĩnh, seed chỉ thêm mới, cache không nhận ghi từ ngoài app, ràng buộc SiteSettings, id heading giữ nguyên, ngày theo giờ VN, cache-tags server-only -->
<!-- Updated: Validation 2026-09-30 - hai chế độ seed: demo (đủ mẫu) và production (chỉ khung cài đặt); bỏ ảnh scan chứng nhận và ảnh năng lực khỏi CMS -->

## Overview

Script seed chạy lại được nhiều lần, có hai chế độ:
- **`--demo`:** đưa toàn bộ nội dung mẫu (8 bài viết, thông tin công ty, logo mẫu) vào DB và `MEDIA_DIR`.
- **`--settings-template`:** dùng cho production của khách thật. Chỉ tạo một khung thông tin công ty có dữ liệu giữ chỗ, bật thông báo "dữ liệu mẫu", không có bài viết và không có logo.

Phase này cũng dựng lớp đọc nội dung công khai có cache theo tag, và chứa **spike quan trọng nhất của kế hoạch**: chọn mô hình cache của Next 16.

## Spike bắt buộc: chọn mô hình cache (làm đầu tiên)

Nghiên cứu (`plans/reports/researcher-260930-1659-nextjs16-selfhost-cms-stack.md` §1) cho biết hai điều:
- khi bật `cacheComponents`, `'use cache'` chạy ngay lúc build;
- `generateStaticParams` trả mảng rỗng thì build lỗi.

Red-team chỉ ra thêm: nếu bọc cả cây trong `<Suspense>`, `notFound()` sẽ trả mã 200 thay vì 404, vì phản hồi đã được stream.

Làm spike trên một nhánh riêng, thử **mô hình A** trước:

1. Bật `cacheComponents: true`.
2. Viết `getSiteSettings()` (`'use cache'` + `cacheTag('site-settings')` + `cacheLife('max')`).
3. Chỉ header và footer, mỗi cái nằm trong một `<Suspense>` hẹp riêng, đọc settings qua `await connection()`. Fallback có cùng kích thước để không nhảy bố cục.
4. `tin-tuc/[slug]`:
   - `generateStaticParams` trả `[{ slug: '__placeholder__' }]`;
   - trang gọi `await connection()` rồi lấy bài **ngay ở cấp trang, ngoài mọi `<Suspense>`**, để `notFound()` chạy trước khi phản hồi được gửi đi.

**Mô hình A đạt khi thoả đủ bốn tiêu chí:**
1. `DATABASE_URL= npm run build` thành công và log không có kết nối DB nào.
2. `curl -o /dev/null -w '%{http_code}' /tin-tuc/khong-co` trả **404**, và trang sản phẩm có slug sai cũng trả 404.
3. Có ít nhất một phần tĩnh thật sự: phần thân trang sản phẩm hoặc trang giới thiệu được prerender, chỉ header/footer là stream.
4. Sửa một dòng trong DB rồi gọi `updateTag` từ một Server Action thử: trang đổi ngay. **Xoá action thử này trước khi đóng phase.**

**Không đạt thì dùng mô hình B:**
- tắt `cacheComponents`;
- loader gọi `await connection()` rồi đọc qua `unstable_cache` với `tags`;
- Server Action gọi `revalidateTag(tag, { expire: 0 })`.

Trước khi chọn B, đọc `node_modules/next/dist/docs/` để chắc `unstable_cache` chưa bị gỡ (theo `AGENTS.md`). Phase 4 và 7 chỉ phụ thuộc vào tên loader và tên tag, nên việc đổi mô hình không lan ra ngoài `src/server/queries/` và `src/server/cache-tags.ts`. Ghi quyết định vào Validation Log của `plan.md`.

## Requirements

### Nguồn seed

- [ ] Chuyển các nguồn dữ liệu:
  - `src/data/articles.ts` sang `src/data/seed/articles.ts`, giữ nguyên `id` của heading;
  - nội dung của `src/data/company.ts` sang `src/data/seed/site-settings-demo.ts` (đủ mẫu, có logo);
  - thêm `src/data/seed/site-settings-template.ts`: giữ chỗ như bản mẫu, `showSampleNotice: true`, `clientLogos: []`;
  - logo mẫu từ `public/images/clients/` sang `assets/processed-images/clients/`;
  - ảnh bìa đọc từ `assets/processed-images/articles/`, giữ `alt`, `position` và `credit` từ `ARTICLE_COVERS`.

### Script seed

- [ ] `scripts/seed.ts --demo | --settings-template`:
  - **Chỉ thêm mới, không bao giờ ghi đè.** Bài viết dùng `INSERT … ON CONFLICT (slug) DO NOTHING`. `site_settings` chỉ được ghi khi chưa có dòng nào. Không có cờ `--force`.
  - **Từ chối chạy** khi `articles` đã có bài do người dùng tạo (`created_by IS NOT NULL`). Khi đó in ra lý do.
  - Ảnh đi qua `saveMedia` với `sourceKey` là sha256 của file nguồn, nên chạy lại không tải trùng. Logo SVG dùng `allowSvg: true`.
  - Bài seed có `status = 'published'`, snapshot dựng bằng `buildArticleSnapshot`, `first_published_at` lấy từ `publishedAt` gốc.
  - Kết thúc bằng lời nhắc in ra màn hình: *"Nếu app đang chạy, chạy `docker compose restart app` để nạp dữ liệu mới"*. Seed chạy ở tiến trình khác nên không làm mới được cache trong bộ nhớ của app.

### Dựng snapshot và slug

- [ ] `src/server/articles/build-snapshot.ts` (dùng chung với phase 7):
  - **giữ `id` heading đã có**, chỉ sinh bằng `slugify` khi thiếu, và thêm hậu tố khi trùng;
  - tính `readingMinutes` theo 200 chữ/phút;
  - `publishedAt` và `updatedAt` dạng `YYYY-MM-DD`, tính theo múi giờ `Asia/Ho_Chi_Minh`;
  - kiểm tra kết quả bằng `articleSnapshotSchema`.
- [ ] `src/lib/slugify.ts`: bỏ dấu tiếng Việt, xử lý `đ`, chuyển sang kebab-case. Có test.

### Loader công khai

- [ ] `src/server/queries/public-content.ts` gồm:
  - `getPublishedArticles()` (tag `articles`): danh sách snapshot **không kèm `blocks`**, sắp xếp bài nổi bật trước rồi theo ngày đăng giảm dần (đúng quy tắc của `ARTICLES_SORTED` hiện tại).
  - `getPublishedArticle(slug)` (tag `articles` và `article:<slug>`).
  - `getSiteSettings()` (tag `site-settings`): trả `SiteSettingsView`, tự sinh các trường suy ra (`hotlineHref` từ `hotlineDisplay`, `phoneHref` cho từng kho, `slug` và `scanLabel` cho chứng nhận). **Khi chưa có dòng `site_settings` thì ném lỗi rõ ràng** ("Chưa có thông tin công ty — chạy seed"), không trả giá trị rỗng để bị cache. Spike kiểm tra rằng lỗi không bị cache.
- [ ] `src/server/cache-tags.ts` import `server-only` và **không có `'use server'`**. Module này chứa hằng số tên tag, `invalidateArticle(slug)` và `invalidateSiteSettings()`. Chỉ các Server Action trong `src/server/actions/` (phase 6, 7) được gọi chúng.

### Hình dạng `SiteSettings` (zod ở `src/lib/content-schemas.ts`)

- [ ] Các trường:
  - `company`: các trường của `COMPANY` hiện tại, bỏ `hotlineHref` vì tự suy ra;
  - `showSampleNotice`: thay cho `IS_SAMPLE_CONTENT`;
  - `trustStats`: **đúng 4 mục**;
  - `capabilities`: **đúng 3 mục**, chỉ gồm tiêu đề, icon, mô tả và các ý. Ảnh năng lực và nhãn ảnh vẫn nằm trong code và ghép theo vị trí;
  - `certificates`: tên, cơ quan cấp, số hiệu, hiệu lực. `slug` và `scanLabel` tự suy ra. Không có ảnh scan;
  - `timeline`;
  - `warehouses`: **ít nhất 1 mục**, giữ `mapQuery`, bỏ `phoneHref`;
  - `compliance`;
  - `clientLogos`: có thể rỗng, mỗi mục kèm `logo: SiteImage`;
  - `contactTopics`: **ít nhất 1 mục**.
- [ ] Icon chỉ nhận các khoá có trong `src/components/icon-map.ts`.

## Related Code Files

- Create: `scripts/seed.ts`, `src/data/seed/articles.ts` (chuyển từ `src/data/articles.ts`), `src/data/seed/site-settings-demo.ts`, `src/data/seed/site-settings-template.ts`, `src/server/articles/build-snapshot.ts`, `src/server/articles/build-snapshot.test.ts`, `src/lib/slugify.ts`, `src/lib/slugify.test.ts`, `src/server/queries/public-content.ts`, `src/server/cache-tags.ts`, `assets/processed-images/clients/*.svg` (chuyển từ `public/images/clients/`)
- Modify: `src/lib/content-schemas.ts`, `src/data/images.ts` (thêm `CAPABILITY_IMAGES` theo thứ tự 3 năng lực), `package.json` (`db:seed`), `next.config.ts` (`cacheComponents` nếu mô hình A đạt)
- Chưa xoá trong phase này: `src/data/company.ts`, `ARTICLE_COVERS`. Trang công khai vẫn dùng chúng cho đến phase 4.

## Implementation Steps

1. Làm spike và chốt mô hình cache.
2. Viết `slugify.ts` và `build-snapshot.ts` kèm test. Test gồm: giữ id có sẵn, sinh id khi thiếu, hậu tố khi trùng, và ngày khi đăng lúc 06:30 giờ Việt Nam (tức 23:30 UTC hôm trước).
3. Mở rộng `content-schemas.ts` với `SiteSettings` và test các ràng buộc số lượng.
4. Viết hai nguồn settings và `scripts/seed.ts` (chạy bằng `tsx --conditions=react-server`). **Sao lưu DB trước khi chạy trên bất kỳ môi trường nào đã có dữ liệu** (`pg_dump`).
5. Viết `public-content.ts` và `cache-tags.ts`.
6. Chạy `--demo` hai lần liên tiếp và kiểm tra số dòng không đổi. Tạo một bài có `created_by` rồi chạy seed lần nữa: seed phải từ chối.

## Todo

- [ ] Spike chọn mô hình cache (4 tiêu chí) và ghi quyết định
- [ ] `slugify.ts` và test
- [ ] `build-snapshot.ts` (giữ id, ngày theo giờ VN) và test
- [ ] Schema `SiteSettings` có ràng buộc và test
- [ ] Nguồn seed demo và khung production
- [ ] `scripts/seed.ts` (chỉ thêm mới, từ chối khi có dữ liệu người dùng, dedupe ảnh)
- [ ] `public-content.ts` (ném lỗi khi thiếu settings) và `cache-tags.ts` (server-only)
- [ ] Xoá Server Action thử của spike

## Success Criteria

- Đạt 4 tiêu chí của mô hình A, hoặc đã chuyển sang mô hình B và ghi lý do.
- Chạy `--demo` hai lần: vẫn đúng 8 bài, số dòng `media` bằng số ảnh nguồn, có 1 dòng `site_settings`.
- `--settings-template` trên DB trống: có 1 dòng `site_settings`, 0 bài, 0 ảnh.
- Seed từ chối chạy khi đã có bài do người dùng tạo.
- `getPublishedArticle('chon-pac-hay-phen-nhom-cho-tram-xu-ly-nuoc-thai')` trả về đủ trường như dữ liệu gốc, kể cả id heading (`co-che-keo-tu`). Chỉ `readingMinutes` được phép khác, và phải ghi lại chênh lệch.
- `grep -rn "use server" src/server/cache-tags.ts src/server/queries` không có kết quả.
- `npm test`, `npm run typecheck`, `npm run lint` sạch.

## Risk Assessment

- **Mô hình A tốn công mà không có phần tĩnh:** tiêu chí 3 buộc phải chứng minh lợi ích trước khi giữ mô hình này.
- **Dữ liệu sửa ngoài app không hiện lên site:** mọi thao tác ghi từ bên ngoài (seed, restore, sửa tay) phải kết thúc bằng `docker compose restart app`. Phase 9 đưa việc này vào script.
- **`readingMinutes` tự tính khác số đang ghi tay:** chấp nhận, vì đây là số ước lượng.

## Security Considerations

- Seed đọc cấu hình từ env và không in giá trị bí mật ra log.
- Seed không bao giờ ghi đè dữ liệu người dùng.
- `cache-tags.ts` không phải Server Action, nên không ai gọi được nó từ trình duyệt.
