---
title: Lập kế hoạch CMS tự viết và hạ tầng VPS
date: 2026-09-30
summary: "Plan 10 phase cho CMS tự viết (Postgres, ảnh trên đĩa VPS, Docker Compose); red-team 15 phát hiện đều được áp dụng; validate 4 quyết định"
---

# Lập kế hoạch CMS tự viết và hạ tầng VPS

## What happened

- Tư vấn (ak:advise) rồi lập kế hoạch (ak:plan, chế độ hard) cho CMS tự viết trong app Next.js 16: bài viết và thông tin công ty, 2 vai editor/admin, luồng nháp → chờ duyệt → đăng, nội dung lên ngay không build lại.
- Kế hoạch: `plans/260930-1002-self-built-cms-vps-deploy/` (10 phase, 159 đầu việc). Nghiên cứu: `plans/reports/researcher-260930-1659-nextjs16-selfhost-cms-stack.md`.
- Hướng hạ tầng đổi giữa chừng. Ban đầu đề xuất Cloudflare Workers + D1. Sau khi người dùng làm rõ rằng hosting miễn phí chỉ dùng cho demo, còn production là mỗi khách một VPS, hướng chuyển sang một Docker image chạy mọi nơi: Postgres + Caddy + Compose.
- Red-team 4 persona trả về 38 phát hiện, gộp còn 15 (1 Critical, 11 High, 3 Medium). Người dùng duyệt từng phát hiện và nhận cả 15. Các phát hiện đáng chú ý:
  - stored XSS qua 3 thẻ JSON-LD (`breadcrumbs.tsx:31` bị bỏ sót);
  - `proxy.ts` phải đặt ở `src/`;
  - bọc cả cây trong Suspense làm `notFound()` trả 200;
  - `not-found.tsx` trong route group không bắt được URL lạ;
  - seed và restore chạy ở tiến trình khác nên không làm mới được cache trong bộ nhớ;
  - thứ tự ghi tag trong `deploy.sh` làm mất điểm rollback.

## Decision

- Ảnh lưu trên ổ đĩa VPS (volume Docker), phục vụ qua `/media/*`. Không dùng R2 cho ảnh; R2 chỉ là đích backup được khuyến nghị.
- Production khởi tạo bằng khung cài đặt (`seed --settings-template`). Dữ liệu mẫu đầy đủ chỉ dùng cho demo.
- Biên tập viên được sửa mọi bài. Rút lại bài theo `submitted_by`.
- Nơi chạy demo để sau. Trước mắt chạy local ở `https://localhost` bằng đúng stack production.
- Better Auth do người dùng tự làm. Phase 5 chỉ chốt hợp đồng (`getSessionUser`, `requireUser`, `requireApiUser`, build không cần env, `src/proxy.ts`) cùng một checklist gợi ý.
- Mô hình cache (`cacheComponents` hay `unstable_cache`) do spike 4 tiêu chí ở phase 3 quyết định.

## Lessons

- Tool Write chuyển chuỗi thoát Unicode viết trong nội dung (backslash-u003c) thành ký tự thật, khiến câu "escape `<`" thành vô nghĩa. Khi ghi hướng dẫn escape, mô tả bằng chữ thay vì viết chuỗi thoát.
- Với `cacheComponents`, `'use cache'` chạy ngay lúc build, và `generateStaticParams` trả mảng rỗng là lỗi build.
- `next lint` đã bị gỡ ở Next 16, nên `npm run lint` của dự án đang hỏng.
- Hook của dự án chặn đọc `node_modules`, nên tài liệu Next 16 phải lấy từ web. Các điểm chưa xác minh được giữ lại thành spike.

## Next steps

- Người dùng: cài Docker; tự làm phase 5 và báo lại chữ ký hàm guard cùng bảng user.
- Thực thi bằng `/ak:cook plans/260930-1002-self-built-cms-vps-deploy/plan.md`, bắt đầu từ phase 1, rồi đến các spike ở phase 2 và 3.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
