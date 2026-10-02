---
phase: 7
title: "Phase 7: Admin bài viết và luồng duyệt"
status: todo
priority: P1
effort: "4d"
dependencies: [2, 3, 5, 6]
---

# Phase 7: Admin bài viết và luồng duyệt

<!-- Updated: Red Team 2026-09-30 - submitted_by/updated_by, 404 thật khi gỡ bài, sửa phần bảo mật (JSON-LD đã xử lý ở phase 4) -->
<!-- Updated: Validation 2026-09-30 - biên tập viên được sửa mọi bài -->

## Overview

Biên tập viên tạo và sửa bài bằng trình soạn khối, rồi gửi duyệt. Quản trị viên duyệt, đăng, trả bài hoặc gỡ bài. Bấm đăng thì bài lên site ngay nhờ làm mới cache theo tag, không build lại.

## Mô hình trạng thái

`status` mô tả **bản đang soạn**. `published_snapshot` mô tả **bản đang hiển thị**. Hai thứ này độc lập nhau, nên một bài có thể vừa đang hiển thị bản cũ vừa có bản sửa đang chờ duyệt.

| Hành động | Từ trạng thái | Sang trạng thái | Ai được làm | Tác động lên site |
|-----------|---------------|-----------------|-------------|-------------------|
| Tạo bài | – | `draft` | editor, admin | Không |
| Lưu | `draft` | `draft` | mọi editor, admin | Không |
| Lưu | `published` | `draft` | mọi editor, admin | Không (site vẫn hiện snapshot cũ) |
| Lưu | `in_review` | `in_review` | chỉ admin | Không |
| Gửi duyệt | `draft` | `in_review` | mọi editor, admin (ghi `submitted_by`) | Không |
| Rút lại | `in_review` | `draft` | người gửi (`submitted_by`), admin | Không |
| Trả bài (kèm ghi chú) | `in_review` | `draft` | admin | Không |
| Duyệt và đăng | `in_review`, `draft` | `published` | admin | Chép bản soạn vào snapshot, làm mới cache |
| Gỡ khỏi site | bất kỳ khi có snapshot | `draft` | admin | Snapshot thành `null`, làm mới cache |
| Xoá | bài chưa từng đăng | – | người tạo (`created_by`), admin | Không |
| Xoá | bài đã từng đăng | – | admin | Làm mới cache |

**Quyết định của người dùng:** mọi biên tập viên được sửa mọi bài (nhóm nhỏ). Mỗi lần lưu ghi `updated_by`, nên luôn biết ai sửa cuối.

Biên tập viên **không** sửa được bài đang `in_review` (khoá để người duyệt đọc đúng bản đã gửi). Muốn sửa thì người gửi hoặc admin rút lại trước.

## Requirements

- [ ] Hàm chuyển trạng thái thuần `transition(article, action, user)` trong `src/server/articles/workflow.ts`. Hàm trả về bản cập nhật hoặc lỗi có mã. Mọi Server Action đều đi qua hàm này, và bảng trên chính là bộ test của nó.
- [ ] Mọi thao tác ghi dùng khoá lạc quan: `UPDATE ... WHERE id = $1 AND version = $2`, rồi tăng `version`. Nếu không có dòng nào bị cập nhật, báo "Bài vừa được người khác sửa, tải lại để xem bản mới".
- [ ] Khi đăng, dựng snapshot bằng `buildArticleSnapshot` (đã có từ phase 3):
  - `publishedAt` = ngày của `first_published_at` (giữ nguyên nếu đã từng đăng), `updatedAt` = hôm nay; cả hai dạng `YYYY-MM-DD` theo giờ Việt Nam;
  - `readingMinutes` tự tính; `id` heading đã có được giữ nguyên, chỉ sinh khi thiếu;
  - `cover` = `SiteImage` phân giải từ `media`.
  - Biên tập viên không phải gõ `id` cho heading.
- [ ] Slug tự sinh từ tiêu đề và sửa được **cho đến lần đăng đầu tiên**. Sau đó slug bị khoá để không làm gãy link đã chia sẻ.
- [ ] `related_product_slugs` chỉ nhận slug có trong `PRODUCTS` (kiểm tra ở server).
- [ ] Mọi thao tác lưu ghi `updated_by`; gửi duyệt ghi `submitted_by`, `submitted_at`; duyệt, trả bài hoặc gỡ ghi `reviewed_by`.
- [ ] Server Action nằm trong `src/server/actions/article-actions.ts`, mỗi hàm gọi `requireUser(...)` ở dòng đầu tiên (quy ước ở phase 6).
- [ ] Sau khi đăng, gỡ hoặc xoá bài đã từng đăng, gọi `invalidateArticle(slug)` từ `src/server/cache-tags.ts` (phase 3).

## Màn hình

- `/admin/bai-viet`: bảng bài viết, lọc theo trạng thái (Nháp, Chờ duyệt, Đã đăng, Đã đăng có bản sửa chưa duyệt), tìm theo tiêu đề. Cột gồm tiêu đề, chuyên mục, trạng thái, người sửa cuối, thời điểm sửa.
- `/admin/bai-viet/moi` và `/admin/bai-viet/[id]`: form gồm hai phần.
  - **Thông tin bài:** tiêu đề, slug, tóm tắt, chuyên mục (`ARTICLE_CATEGORIES`), tác giả hiển thị và vai trò, nổi bật, nguồn tham chiếu (mỗi dòng một nguồn), sản phẩm liên quan (chọn nhiều, có ô tìm), ảnh bìa (tải lên hoặc chọn ảnh đã có, bắt buộc có `alt`; ghi công tác giả bắt buộc khi giấy phép là CC BY/BY-SA).
  - **Nội dung:** danh sách khối. Mỗi khối có bộ chọn loại, trường nhập theo loại, và các nút Lên, Xuống, Xoá, Thêm khối bên dưới. Bảng thông số cho thêm và xoá hàng; danh sách nhập mỗi dòng một mục.
  - Thanh hành động hiện đúng các nút mà vai và trạng thái hiện tại cho phép, lấy từ `workflow.ts` để giao diện và server không lệch nhau.
  - Hiện `review_note` nổi bật khi bài bị trả.
- `/admin/bai-viet/[id]/xem-truoc`: hiển thị bản soạn bằng **đúng component** của trang công khai (`ArticleView`, tách ở phase 4), có dải "Bản xem trước — chưa đăng".

## Related Code Files

- Create: `src/server/articles/workflow.ts`, `src/server/articles/workflow.test.ts`, `src/server/actions/article-actions.ts`, `src/server/queries/admin-articles.ts`, `src/app/admin/bai-viet/page.tsx`, `src/app/admin/bai-viet/moi/page.tsx`, `src/app/admin/bai-viet/[id]/page.tsx`, `src/app/admin/bai-viet/[id]/xem-truoc/page.tsx`, `src/components/admin/article-form.tsx`, `src/components/admin/block-editor.tsx`, `src/components/admin/product-picker.tsx`
- Reuse: `src/server/articles/build-snapshot.ts` và `src/lib/slugify.ts` (phase 3), `src/components/content/article-view.tsx` (phase 4), `src/components/admin/media-field.tsx` và `src/components/admin/repeatable-list.tsx` (phase 6), `src/components/ui/*`

## Implementation Steps

1. Viết `workflow.ts` cùng bộ test phủ đủ mọi dòng trong bảng trạng thái, cả trường hợp bị từ chối.
2. Viết các Server Action. Mỗi action gọi `requireUser()`, parse input bằng zod, gọi `transition`, ghi có kiểm tra `version`, làm mới cache khi snapshot đổi.
3. Làm trang danh sách, rồi form (phần thông tin trước, trình soạn khối sau, dựa trên `repeatable-list`), rồi trang xem trước.
4. Chạy thử đủ vòng: editor tạo, gửi; admin trả kèm ghi chú; editor sửa, gửi lại; admin đăng; editor sửa bài đã đăng; admin đăng lại; admin gỡ.

## Todo

- [ ] `workflow.ts` và test theo bảng trạng thái
- [ ] Server Action bài viết (có khoá lạc quan và làm mới cache)
- [ ] Trang danh sách có bộ lọc
- [ ] Form thông tin bài và bộ chọn sản phẩm
- [ ] Trình soạn khối (thêm, sửa, lên/xuống, xoá)
- [ ] Trang xem trước
- [ ] Chạy thử đủ vòng duyệt bằng hai tài khoản

## Success Criteria

- Admin bấm "Duyệt và đăng" thì bài xuất hiện ở `/tin-tuc` và `/tin-tuc/<slug>` trong vòng 5 giây, không có build nào chạy.
- Editor sửa bài đã đăng thì trang công khai không đổi cho đến khi admin đăng lại.
- Gọi action "đăng" bằng phiên `editor` thì bị từ chối và database không đổi.
- Sau khi gỡ bài, `curl -o /dev/null -w '%{http_code}' /tin-tuc/<slug>` trả **404**.
- Editor B không rút lại được bài do editor A gửi duyệt.
- Hai tab cùng sửa một bài: tab lưu sau nhận thông báo xung đột, không ghi đè.
- Bài có mọi loại khối hiển thị ở trang xem trước giống hệt trang công khai sau khi đăng.
- `npm test`, `npm run typecheck`, `npm run lint` sạch.

## Risk Assessment

- **Trình soạn khối phình to:** chỉ làm lên/xuống, chưa làm kéo thả. Kéo thả để sau khi có phản hồi thật từ người dùng.
- **Giao diện và server lệch quy tắc quyền:** cả hai cùng đọc `workflow.ts`.
- **Slug trùng:** ràng buộc `UNIQUE` ở DB; báo lỗi thân thiện khi vi phạm.

## Security Considerations

- Mọi Server Action kiểm tra quyền ở server. Việc ẩn nút chỉ để tiện dùng.
- Nội dung khối được render thành text của React. Tiêu đề, tóm tắt và tác giả còn đi vào JSON-LD (breadcrumb và trang bài viết); cả hai chỗ đã dùng `serializeJsonLd` từ phase 4, và luật ESLint chặn cách viết cũ. Trang xem trước dùng lại đúng các component đó, nên được bảo vệ như nhau.
- Đây vẫn là nội dung do người dùng nhập. Admin nên đọc kỹ bài trước khi duyệt; CSP ở Caddy (phase 8) là lớp phòng vệ thứ hai.
- Trang admin đặt `robots: noindex` và không bao giờ được cache công khai.
