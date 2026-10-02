---
phase: 5
title: "Phase 5: Xác thực và phân quyền (Better Auth)"
status: todo
priority: P1
effort: "do người dùng tự làm"
dependencies: [1]
---

# Phase 5: Xác thực và phân quyền (Better Auth)

<!-- Updated: Red Team 2026-09-30 - hợp đồng thêm requireApiUser, build không cần env, src/proxy.ts; thêm checklist gợi ý (không chặn phase nào) -->

> **Người dùng tự triển khai phase này** và sẽ báo lại kết quả. Tài liệu này chỉ chốt **hợp đồng** mà các phase 6, 7 và 8 phụ thuộc vào, kèm một checklist gợi ý. Sau khi có báo cáo, cập nhật phase này và các phase liên quan theo cách làm thực tế.

## Overview

Đăng nhập bằng email và mật khẩu cho trang admin, với 2 vai `editor` và `admin`. Không có đăng ký công khai: quản trị viên tạo tài khoản cho biên tập viên.

## Hợp đồng các phase khác dựa vào

Phase 6 và 7 chỉ dùng ba hàm sau, export từ `src/server/auth-guard.ts`:

```ts
type Role = 'editor' | 'admin'
interface SessionUser { id: string; name: string; email: string; role: Role }

/** Người dùng hiện tại, hoặc null khi chưa đăng nhập. Dùng trong Server Component và Server Action. */
export async function getSessionUser(): Promise<SessionUser | null>

/** Trang và Server Action: chưa đăng nhập thì redirect tới trang đăng nhập;
 *  sai vai thì redirect tới trang "không có quyền" (hoặc ném lỗi trong Server Action). */
export async function requireUser(role?: Role): Promise<SessionUser>

/** Route Handler: không redirect. Trả về người dùng, hoặc một Response JSON 401/403. */
export async function requireApiUser(role?: Role): Promise<SessionUser | Response>
```

Ba điều kiện kỹ thuật các phase sau cần:

1. **`next build` chạy được khi không có biến môi trường.** CI và `docker build` (phase 8, 9) không có `DATABASE_URL` hay `BETTER_AUTH_SECRET`, nên `auth` phải được tạo lười (ví dụ `getAuth()` ghi nhớ ở lần gọi đầu) và dùng `getDb()` của phase 1.
2. **File proxy đặt ở `src/proxy.ts`**, vì app nằm trong `src/app`. File ở gốc repo sẽ bị Next bỏ qua mà không báo lỗi. Matcher `/admin/:path*` **loại trừ `/admin/api/media`**, để proxy không cắt body upload (Next đệm body qua proxy tối đa 10 MB theo mặc định). Proxy chỉ là lớp redirect tiện lợi: mọi trang, Server Action và Route Handler **vẫn phải gọi hàm guard**.
3. **Khoá ngoại:** thêm migration `ON DELETE SET NULL` từ `articles.created_by`, `articles.updated_by`, `articles.submitted_by`, `articles.reviewed_by`, `media.uploaded_by`, `site_settings.updated_by` tới bảng user.

## Requirements (tối thiểu)

- [ ] Better Auth với Drizzle adapter trên Postgres. Bảng auth được sinh thành migration trong `drizzle/`.
- [ ] Trường `role` trên user.
- [ ] Tắt đăng ký công khai. Tạo tài khoản admin đầu tiên bằng script `npm run user:create-admin`. Script chạy được trong image `tools` (phase 8).
- [ ] Admin tạo, khoá và đặt lại mật khẩu cho biên tập viên tại `/admin/tai-khoan`.
- [ ] Giới hạn số lần đăng nhập sai (rate limit có sẵn của Better Auth).
- [ ] Ba hàm guard và ba điều kiện kỹ thuật ở trên.

## Checklist gợi ý khi cấu hình Better Auth (không chặn phase nào)

Đây là các lỗ hổng cấu hình hay gặp. Bạn tự kiểm tra khi làm:

- [ ] `role` khai báo với `input: false`. Kiểm tra: editor gọi `POST /api/auth/update-user` kèm `{"role":"admin"}` phải bị từ chối.
- [ ] Đăng ký tắt ở **server** (không chỉ ẩn nút). Kiểm tra: `POST /api/auth/sign-up/email` khi chưa đăng nhập phải bị từ chối.
- [ ] Vai mặc định là `editor`. Plugin `admin` mặc định dùng `user`, nằm ngoài kiểu `Role`.
- [ ] `requireUser` và `requireApiUser` đọc vai và trạng thái khoá **mới từ DB** mỗi lần, hoặc tắt `cookieCache`. Nếu không, admin bị hạ vai hay tài khoản bị khoá vẫn giữ quyền cho tới khi cookie hết hạn.
- [ ] Các endpoint của plugin `admin` (tạo user, đổi vai, đặt mật khẩu, khoá) chỉ cho vai `admin`.
- [ ] Cookie phiên có `Secure` và `HttpOnly` ở production.

## Related Code Files (dự kiến)

- Create: `src/server/auth.ts`, `src/server/auth-guard.ts`, `src/app/api/auth/[...all]/route.ts`, `src/app/admin/dang-nhap/page.tsx`, `src/app/admin/khong-co-quyen/page.tsx`, `src/app/admin/tai-khoan/page.tsx`, `src/proxy.ts`, `scripts/create-admin.ts`
- Modify: `src/server/db/schema.ts`, `src/server/env.ts`, `.env.example`

## Success Criteria

- Chưa đăng nhập mà mở `/admin` thì bị chuyển tới trang đăng nhập (proxy trả 307).
- Gọi thẳng một Server Action của admin bằng phiên `editor` thì bị từ chối. Gọi `/admin/api/media` khi chưa đăng nhập thì nhận JSON 401, không phải trang HTML.
- Tài khoản bị khoá không đăng nhập được, và phiên đang mở của tài khoản đó mất hiệu lực.
- `DATABASE_URL= BETTER_AUTH_SECRET= npm run build` thành công sau khi đã gộp code auth.
- `npm run typecheck` và `npm run lint` sạch.

## Báo cáo cần gửi lại để cập nhật plan

- Chữ ký thực tế của ba hàm guard và file chứa chúng.
- Tên bảng và cột user thực tế (để sửa khoá ngoại).
- Đường dẫn trang đăng nhập, trang "không có quyền", và cách tạo admin đầu tiên.
- Dùng plugin `admin` của Better Auth hay tự viết phần quản lý tài khoản.
- Có dùng `cookieCache` không.
