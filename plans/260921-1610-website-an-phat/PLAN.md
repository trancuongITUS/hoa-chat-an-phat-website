# Website Hoá chất An Phát — Kế hoạch dựng

**Ngày:** 2026-09-21 · **Nguồn spec:** `docs/design-system/hoa-chat-an-phat/`

## Outcome

Website B2B Next.js (App Router) + Tailwind v4 + shadcn/ui triển khai đúng MASTER.md
và 5 file override trong `pages/`. Không giá, không giỏ hàng, không checkout.

## Quyết định của người dùng (2026-09-21)

1. **Nội dung:** seed data đánh dấu rõ là mẫu. Tên hoá chất và số CAS dùng dữ liệu
   công khai có thật; tên công ty, hotline, số liệu năng lực để dạng placeholder rõ
   ràng. Ảnh dùng khối màu token có nhãn, đúng aspect-ratio.
2. **Phạm vi:** toàn bộ 5 nhóm trang.
3. **RFQ:** chưa cần backend — form validate và xác nhận hoàn toàn phía client,
   một điểm nối duy nhất để gắn backend sau.

## Non-goals

- Dark mode không kiểm thử ở bản đầu (token vẫn khai báo song song — MASTER §2.6).
- Không CMS, không database, không thanh toán, không widget chat.

## Acceptance criteria

Checklist bàn giao MASTER §13, cộng với: bố cục đúng ở 375/768/1024/1440px,
`npm run build` và `tsc --noEmit` sạch, không hex thô trong component.

## Phases

1. Nền tảng: scaffold, token `globals.css`, fonts, tiện ích.
2. Component MASTER §7 + shadcn primitives.
3. Lớp dữ liệu seed.
4. Trang: chủ · danh mục · chi tiết · giới thiệu · tin tức · bài viết · RFQ · liên hệ.
5. Kiểm tra: build, typecheck, đo bố cục thực tế ở 4 breakpoint.
