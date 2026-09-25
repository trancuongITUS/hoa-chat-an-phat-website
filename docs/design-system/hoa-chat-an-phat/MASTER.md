# Design System — Hoá chất An Phát (MASTER)

> **Cách dùng:** Khi xây một trang cụ thể, đọc `pages/<ten-trang>.md` trước.
> Nếu file đó tồn tại, quy tắc trong đó **ghi đè** file MASTER này.
> Nếu không tồn tại, tuân thủ nghiêm ngặt MASTER.

**Dự án:** Website công ty Hoá chất An Phát
**Loại sản phẩm:** B2B Service — nhà phân phối hoá chất công nghiệp
**Stack triển khai:** Next.js (App Router) + Tailwind CSS v4 + shadcn/ui
**Phong cách:** Trust & Authority + Industrial Minimal
**Mẫu trang chủ:** Enterprise Gateway (biến thể B2B Việt Nam, không có cổng đăng nhập khách hàng)
**Ngôn ngữ giao diện:** Tiếng Việt (có diacritics đầy đủ), số liệu kỹ thuật dùng chữ số tabular
**Cập nhật:** 2026-09-23 (thêm ngoại lệ màu cho logo, §2.2)

---

## 1. Nguyên tắc thiết kế

Website bán hoá chất công nghiệp không bán bằng cảm xúc, nó bán bằng **độ tin cậy và
độ chính xác của thông tin**. Người mua là kỹ sư sản xuất, nhân viên mua hàng, QA/QC —
họ cần biết đúng chất, đúng nồng độ, đúng xuất xứ, có chứng từ, giao được bao lâu.

| # | Nguyên tắc | Hệ quả thiết kế |
|---|-----------|-----------------|
| 1 | **Chứng cứ trước lời quảng cáo** | Mọi tuyên bố phải đi kèm số liệu, chứng nhận, hoặc tài liệu tải về (MSDS, COA, CO/CQ). Không dùng tính từ rỗng. |
| 2 | **Thông số là nội dung chính** | Bảng thông số kỹ thuật đứng trên phần mô tả marketing ở trang chi tiết sản phẩm. |
| 3 | **An toàn hiển thị rõ ràng** | Phân loại nguy hại GHS luôn hiện ở cả thẻ sản phẩm lẫn trang chi tiết, kèm pictogram + chữ, không bao giờ chỉ bằng màu. |
| 4 | **Một hành động chính mỗi màn hình** | CTA chính luôn là *Yêu cầu báo giá*. Mọi CTA khác (gọi hotline, gửi email, tải tài liệu) là thứ cấp. |
| 5 | **Không phải sàn thương mại điện tử** | Website không công khai giá, không có giỏ hàng, không có checkout, không thanh toán trực tuyến. Mọi ý định mua đều được điều hướng về form yêu cầu báo giá hoặc hotline. |
| 6 | **Mật độ thông tin cao, không lộn xộn** | Dùng khoảng trắng để nhóm, không dùng để pha loãng. Ưu tiên bảng và danh sách có cấu trúc hơn là thẻ lớn nhiều ảnh. |
| 7 | **Bảo thủ về thị giác** | Không gradient trang trí, không glassmorphism, không màu neon. Độ tin cậy đến từ sự nhất quán và tiết chế. |

---

## 2. Bảng màu

Toàn bộ giá trị dưới đây đã được kiểm tra tỉ lệ tương phản WCAG 2.1 bằng script và
ghi lại kết quả ở §11. Không dùng hex thô trong component — chỉ dùng token ngữ nghĩa.

### 2.1 Thang màu thương hiệu — An Phát Blue

Xanh công nghiệp trầm, nghiêng navy. Truyền đạt sự ổn định và năng lực kỹ thuật.

| Bậc | Hex | Dùng cho |
|-----|-----|----------|
| `primary-50` | `#F0F6FC` | Nền section nhấn nhẹ, nền chip |
| `primary-100` | `#DCEAF7` | Nền hover của item danh sách |
| `primary-200` | `#B9D5EF` | Viền nhấn, đường phân cách trong khối xanh |
| `primary-300` | `#8BB8E2` | Text/link trên nền tối (dark mode) |
| `primary-400` | `#5594CF` | Icon trên nền tối |
| `primary-500` | `#2F72B4` | Trạng thái hover của nền nhạt |
| `primary-600` | `#1D5A97` | **Màu thương hiệu mặc định** — nút chính, link, icon |
| `primary-700` | `#17487A` | Hover của nút chính, màu link ở body text |
| `primary-800` | `#133A61` | Nền header đậm, nền footer |
| `primary-900` | `#102F4E` | Nền hero tối, link active |
| `primary-950` | `#0A1F34` | Nền tương phản cao nhất |

### 2.2 Màu hành động — Safety Orange

Cam an toàn công nghiệp, dùng **duy nhất** cho CTA chuyển đổi (Yêu cầu báo giá), ngoại
trừ mảng nhấn trong logo (xem ghi chú dưới bảng).
Không dùng cam cho trạng thái cảnh báo — cảnh báo dùng `warning` ở §2.4.

| Bậc | Hex | Dùng cho |
|-----|-----|----------|
| `cta-50` | `#FFF1E9` | Nền khối CTA nhạt |
| `cta-400` | `#EA7C33` | Nền nút CTA ở dark mode (chữ dùng `ink`) |
| `cta-600` | `#B23F0C` | **Nền nút CTA mặc định** (chữ trắng, 5.82:1) |
| `cta-700` | `#93330A` | Hover/active của nút CTA (7.72:1) |

> **Ngoại lệ duy nhất — logo.** Mực chất lỏng trong biểu tượng Lục giác giọt dùng `cta-600`
> trên nền sáng và `cta-400` trên nền tối. Cam chỉ được xuất hiện **bên trong logo**, không
> lan sang icon, gạch chân, viền hay nền khối. Quy tắc dùng logo: [`brand/brand-identity.md`](brand/brand-identity.md).

> ⚠️ Không dùng `#D45414` hay bất kỳ sắc cam sáng hơn `cta-600` làm nền cho chữ trắng —
> tỉ lệ chỉ đạt 4.14:1, trượt AA cho chữ thường.

> ⚠️ **Trên nền tối** (`primary-800`, `primary-900`, và toàn bộ dark mode), nút CTA phải
> đổi sang `cta-400` với chữ `ink` (`#0C1622`). Lý do: `cta-600` chỉ đạt 2.35:1 so với
> `primary-900`, viền nút gần như tan vào nền và trượt yêu cầu tương phản non-text 3:1.
> `cta-400` đạt 4.83:1 so với nền, chữ `ink` trên nút đạt 6.44:1.

### 2.3 Trung tính

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `neutral-0` | `#FFFFFF` | Nền card, nền modal |
| `neutral-50` | `#F7F9FC` | Nền trang |
| `neutral-100` | `#EEF1F5` | Nền khối phụ, nền hàng chẵn của bảng |
| `neutral-200` | `#DDE3EB` | Đường kẻ bảng, divider |
| `neutral-300` | `#C6CFDA` | Viền trang trí của card |
| `neutral-400` | `#7A8CA3` | **Viền input/control** (3.26:1 — đạt chuẩn non-text) |
| `neutral-500` | `#55657A` | Chữ phụ, nhãn, placeholder |
| `neutral-700` | `#33445A` | Chữ phụ đậm |
| `neutral-900` | `#0F1D2E` | **Chữ chính** |

### 2.4 Màu ngữ nghĩa

Mọi màu ngữ nghĩa bắt buộc đi kèm icon Lucide + nhãn chữ. Màu không bao giờ là
phương tiện truyền đạt duy nhất.

| Token | Nền | Chữ/Icon | Icon Lucide | Ý nghĩa |
|-------|-----|----------|-------------|---------|
| `success` | `#EAF7EF` | `#15803D` | `check-circle-2` | Còn hàng, gửi form thành công, đạt chuẩn |
| `warning` | `#FEF6E7` | `#A15C07` | `alert-triangle` | Hàng đặt trước, tồn kho thấp, lưu ý bảo quản |
| `danger` | `#FEECEC` | `#B91C1C` | `alert-octagon` | Lỗi form, hết hàng, cảnh báo nguy hiểm |
| `info` | `#E9F4FB` | `#0369A1` | `info` | Ghi chú kỹ thuật, thông tin vận chuyển |

### 2.5 Màu phân loại nguy hại GHS

Bộ màu riêng cho chip phân loại nguy hại. **Bắt buộc** hiển thị kèm pictogram GHS
chính thức (hình thoi viền đỏ, dạng SVG) và tên phân loại bằng tiếng Việt.

| Mã | Phân loại | Nền | Chữ |
|----|-----------|-----|-----|
| GHS01 | Chất nổ | `#FDF3E7` | `#92400E` |
| GHS02 | Dễ cháy | `#FEECEC` | `#B91C1C` |
| GHS03 | Oxy hoá | `#FEF6E7` | `#A15C07` |
| GHS04 | Khí nén | `#E9F4FB` | `#0369A1` |
| GHS05 | Ăn mòn | `#FFF1E9` | `#9A3412` |
| GHS06 | Độc cấp tính | `#F8EEFE` | `#7E22CE` |
| GHS07 | Kích ứng / Có hại | `#FEF9E7` | `#A16207` |
| GHS08 | Nguy hại sức khoẻ | `#FDEBF2` | `#BE185D` |
| GHS09 | Nguy hại môi trường | `#EAF7EF` | `#15803D` |

### 2.6 Dark mode

Dark mode là **biến thể tông màu giảm bão hoà**, không phải đảo ngược màu sáng.
Nút CTA ở dark mode dùng `cta-400` với chữ màu `ink` (`#0C1622`) thay vì chữ trắng.

> **Phạm vi:** dark mode được đặc tả đầy đủ ở đây nhưng **không nằm trong phạm vi bản
> phát hành đầu tiên** — website B2B này không có nhu cầu thực tế. Token dark vẫn phải
> được khai báo song song trong `globals.css` ngay từ đầu (xem §6) để khi bật lên sau này
> không phải rà lại toàn bộ hệ màu. Quy tắc bắt buộc: **mỗi khi thêm một token màu mới,
> khai báo đồng thời cả hai chế độ.** Không kiểm thử dark mode ở bản đầu, nhưng cũng
> không được để token khuyết một bên.

| Vai trò | Light | Dark |
|---------|-------|------|
| `background` | `#F7F9FC` | `#0C1622` |
| `surface` (card) | `#FFFFFF` | `#132232` |
| `surface-raised` (modal, popover) | `#FFFFFF` | `#1A2C40` |
| `foreground` | `#0F1D2E` | `#E6EDF5` |
| `muted-foreground` | `#55657A` | `#9AAABE` |
| `border` (trang trí) | `#DDE3EB` | `#2A3D52` |
| `border-control` (input, nút viền) | `#7A8CA3` | `#5A7389` |
| `brand` | `#1D5A97` | `#8BB8E2` |
| `cta` | `#B23F0C` | `#EA7C33` |
| `ring` (focus) | `#1D5A97` | `#8BB8E2` |

---

## 3. Chữ

### 3.1 Bộ font

| Vai trò | Font | Lý do |
|---------|------|-------|
| Tiêu đề | **Be Vietnam Pro** (600, 700) | Thiết kế riêng cho tiếng Việt, dấu thanh cân đối ở mọi cỡ, không bị va chạm với dấu mũ |
| Nội dung | **Noto Sans** (400, 500, 600) | Phủ diacritics đầy đủ, x-height cao, đọc tốt ở 16px trên màn hình kém |
| Số liệu kỹ thuật | **Noto Sans** + `font-variant-numeric: tabular-nums` | Cột số trong bảng thông số không nhảy khi đổi giá trị |

Nạp bằng `next/font/google` với `display: 'swap'`, subset `['latin', 'vietnamese']`,
và chỉ preload font tiêu đề. Không nạp qua thẻ `@import` (chặn render).

```ts
// app/fonts.ts
import { Be_Vietnam_Pro, Noto_Sans } from 'next/font/google'

export const fontHeading = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'], weight: ['600', '700'],
  variable: '--font-be-vietnam-pro', display: 'swap', preload: true,
})
export const fontBody = Noto_Sans({
  subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600'],
  variable: '--font-noto-sans', display: 'swap', preload: false,
})
```

### 3.2 Thang chữ

Cỡ mobile ghi trong ngoặc khi khác desktop. Body tối thiểu 16px trên mobile để iOS
không tự động zoom khi focus vào input.

| Token | Cỡ / Dòng | Weight | Font | Dùng cho |
|-------|-----------|--------|------|----------|
| `display` | 48/56 (32/40) | 700 | Heading | Tiêu đề hero trang chủ |
| `h1` | 36/44 (28/36) | 700 | Heading | Tiêu đề trang |
| `h2` | 30/38 (24/32) | 700 | Heading | Tiêu đề section |
| `h3` | 24/32 (20/28) | 600 | Heading | Tiêu đề khối, tên sản phẩm ở trang chi tiết |
| `h4` | 20/28 | 600 | Heading | Tên sản phẩm trên thẻ, tiêu đề card |
| `h5` | 18/26 | 600 | Heading | Tiêu đề nhóm trong bảng thông số |
| `body-lg` | 18/30 | 400 | Body | Đoạn dẫn (lead) dưới tiêu đề |
| `body` | 16/26 | 400 | Body | Nội dung mặc định |
| `body-sm` | 14/22 | 400 | Body | Chú thích bảng, mô tả phụ |
| `label` | 14/20 | 500 | Body | Nhãn input, nhãn chip |
| `caption` | 12/18 | 500 | Body | Ghi chú tài liệu, ngày cập nhật |
| `overline` | 12/16 | 600, `tracking: 0.06em`, in hoa | Body | Nhãn danh mục phía trên tiêu đề |

### 3.3 Quy tắc chữ

- Độ dài dòng: 60–75 ký tự trên desktop, 35–60 trên mobile. Áp `max-w-[68ch]` cho khối văn bản dài.
- Phân cấp bằng **cỡ + weight + khoảng cách**, không bằng màu.
- Tiêu đề đi tuần tự `h1 → h6`, không nhảy bậc. Mỗi trang đúng một `h1`.
- Không cắt chuỗi bằng ellipsis ở tên hoá chất — tên IUPAC dài là bình thường, cho xuống dòng.
  Nếu buộc phải cắt (ví dụ trong breadcrumb), gắn `title` chứa tên đầy đủ.
- Số CAS, mã HS, nồng độ, khối lượng luôn dùng `tabular-nums`.

---

## 4. Không gian, bo góc, đổ bóng, lớp

### 4.1 Khoảng cách — thang 4pt

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96` (px)

| Ngữ cảnh | Giá trị |
|----------|---------|
| Khoảng cách icon–chữ trong nút | 8 |
| Padding trong card | 24 (mobile 16) |
| Khoảng cách giữa các field trong form | 20 |
| Khoảng cách giữa các card trong lưới | 24 |
| Padding dọc của section | 96 desktop / 64 tablet / 48 mobile |
| Khoảng cách tối thiểu giữa 2 vùng chạm | 8 |

### 4.2 Container

| Breakpoint | Gutter | Max-width nội dung |
|------------|--------|--------------------|
| < 640px | 16 | 100% |
| 640–1023px | 24 | 100% |
| ≥ 1024px | 32 | 1280 |
| Section tràn viền (hero, dải logo) | — | 1440 |

Lưới: 12 cột, gap 24px từ `lg` trở lên; 1 cột trên mobile, 2 cột từ `sm`.

### 4.3 Bo góc

| Token | Giá trị | Áp cho |
|-------|---------|--------|
| `radius-xs` | 2px | Chỉ báo nhỏ, thanh tiến trình |
| `radius-sm` | 4px | Chip, badge vuông, ô checkbox |
| `radius-md` | 8px | **Mặc định** — nút, input, select |
| `radius-lg` | 12px | Card, khối tài liệu tải về |
| `radius-xl` | 16px | Modal, sheet, khối hero |
| `radius-full` | 9999px | Chip GHS, avatar, chỉ báo trạng thái |

### 4.4 Đổ bóng

Bóng nhẹ, mang tính công nghiệp. Ở dark mode dùng viền `border` thay vì bóng.

| Token | Giá trị | Áp cho |
|-------|---------|--------|
| `shadow-xs` | `0 1px 2px rgba(15,29,46,.06)` | Nút ở trạng thái nghỉ |
| `shadow-sm` | `0 1px 3px rgba(15,29,46,.08), 0 1px 2px rgba(15,29,46,.06)` | Card ở trạng thái nghỉ |
| `shadow-md` | `0 4px 12px rgba(15,29,46,.08)` | Card hover, header khi cuộn |
| `shadow-lg` | `0 12px 24px rgba(15,29,46,.10)` | Dropdown, popover, mega menu |
| `shadow-xl` | `0 24px 48px rgba(15,29,46,.14)` | Modal, sheet |

### 4.5 Thang z-index

`0` nội dung · `10` phần tử dính trong trang · `20` header dính · `30` lớp phủ nền ·
`40` drawer / mega menu · `50` modal · `60` popover / tooltip · `70` toast

Header dính cao 72px (desktop) / 60px (mobile) — mọi anchor link phải có
`scroll-margin-top` tương ứng để tiêu đề không bị header che.

---

## 5. Chuyển động

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `duration-fast` | 150ms | Hover, đổi màu, focus ring |
| `duration-base` | 200ms | Mở accordion, đổi tab, hiện chip |
| `duration-slow` | 300ms | Mở modal, trượt drawer, mega menu |
| `duration-exit` | 120ms | Mọi animation thoát (≈60% thời lượng vào) |
| `ease-out` | `cubic-bezier(.22,1,.36,1)` | Phần tử đi vào |
| `ease-in` | `cubic-bezier(.4,0,1,1)` | Phần tử đi ra |
| `ease-standard` | `cubic-bezier(.4,0,.2,1)` | Chuyển trạng thái tại chỗ |
| `stagger` | 40ms/item | Lưới sản phẩm, danh sách chứng nhận |

Quy tắc:

- Chỉ animate `transform` và `opacity`. Không animate `width`, `height`, `top`, `left`.
- Tối đa 2 phần tử chuyển động mỗi khung nhìn. Chuyển động phải diễn đạt quan hệ
  nhân–quả (modal bung ra từ nút đã bấm), không trang trí.
- Mọi animation phải ngắt được: người dùng chạm là dừng ngay, không chặn input.
- `prefers-reduced-motion: reduce` → tắt transform và stagger, chỉ giữ đổi opacity ≤ 100ms.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Token triển khai (Tailwind v4 + shadcn/ui)

Đặt vào `app/globals.css`. shadcn/ui đọc các biến `--background`, `--foreground`,
`--primary`, `--border`, `--ring`… nên khối dưới đây map thẳng vào hệ token của nó.

```css
@import "tailwindcss";

@theme {
  --font-heading: var(--font-be-vietnam-pro), ui-sans-serif, system-ui, sans-serif;
  --font-body:    var(--font-noto-sans), ui-sans-serif, system-ui, sans-serif;

  --color-primary-50:  #F0F6FC;  --color-primary-500: #2F72B4;
  --color-primary-100: #DCEAF7;  --color-primary-600: #1D5A97;
  --color-primary-200: #B9D5EF;  --color-primary-700: #17487A;
  --color-primary-300: #8BB8E2;  --color-primary-800: #133A61;
  --color-primary-400: #5594CF;  --color-primary-900: #102F4E;
                                 --color-primary-950: #0A1F34;

  --color-cta-50:  #FFF1E9;  --color-cta-600: #B23F0C;
  --color-cta-400: #EA7C33;  --color-cta-700: #93330A;

  --color-neutral-0:   #FFFFFF;  --color-neutral-400: #7A8CA3;
  --color-neutral-50:  #F7F9FC;  --color-neutral-500: #55657A;
  --color-neutral-100: #EEF1F5;  --color-neutral-700: #33445A;
  --color-neutral-200: #DDE3EB;  --color-neutral-900: #0F1D2E;
  --color-neutral-300: #C6CFDA;

  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px;

  --shadow-xs: 0 1px 2px rgb(15 29 46 / .06);
  --shadow-sm: 0 1px 3px rgb(15 29 46 / .08), 0 1px 2px rgb(15 29 46 / .06);
  --shadow-md: 0 4px 12px rgb(15 29 46 / .08);
  --shadow-lg: 0 12px 24px rgb(15 29 46 / .10);
  --shadow-xl: 0 24px 48px rgb(15 29 46 / .14);

  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-in:  cubic-bezier(.4, 0, 1, 1);
}

:root {
  --background: #F7F9FC;  --foreground: #0F1D2E;
  --card: #FFFFFF;        --card-foreground: #0F1D2E;
  --popover: #FFFFFF;     --popover-foreground: #0F1D2E;
  --primary: #1D5A97;     --primary-foreground: #FFFFFF;
  --secondary: #EEF1F5;   --secondary-foreground: #0F1D2E;
  --cta: #B23F0C;         --cta-foreground: #FFFFFF;
  --muted: #EEF1F5;       --muted-foreground: #55657A;
  --accent: #F0F6FC;      --accent-foreground: #17487A;
  --destructive: #B91C1C; --destructive-foreground: #FFFFFF;
  --success: #15803D;     --warning: #A15C07;  --info: #0369A1;
  --border: #DDE3EB;      --border-control: #7A8CA3;
  --input: #7A8CA3;       --ring: #1D5A97;
}

.dark {
  --background: #0C1622;  --foreground: #E6EDF5;
  --card: #132232;        --card-foreground: #E6EDF5;
  --popover: #1A2C40;     --popover-foreground: #E6EDF5;
  --primary: #8BB8E2;     --primary-foreground: #0C1622;
  --secondary: #1A2C40;   --secondary-foreground: #E6EDF5;
  --cta: #EA7C33;         --cta-foreground: #0C1622;
  --muted: #1A2C40;       --muted-foreground: #9AAABE;
  --accent: #17487A;      --accent-foreground: #E6EDF5;
  --destructive: #F87171; --destructive-foreground: #0C1622;
  --success: #4ADE80;     --warning: #FBBF24;  --info: #7DD3FC;
  --border: #2A3D52;      --border-control: #5A7389;
  --input: #5A7389;       --ring: #8BB8E2;
}

body { background: var(--background); color: var(--foreground); font-family: var(--font-body); }
h1, h2, h3, h4, h5 { font-family: var(--font-heading); }
.tabular { font-variant-numeric: tabular-nums; }

:where(a, button, [role="button"], input, select, textarea, summary):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## 7. Đặc tả component

Mọi component dựng trên shadcn/ui, chỉnh lại theo token ở trên. Không tự viết lại
control gốc khi shadcn đã có.

### 7.1 Button

| Biến thể | Nền | Chữ | Viền | Hover | Dùng khi |
|----------|-----|-----|------|-------|----------|
| `cta` | `cta-600` | trắng | — | nền `cta-700` | **Yêu cầu báo giá** — tối đa 1 trên mỗi màn hình |
| `cta` *(trên nền tối)* | `cta-400` | `ink` `#0C1622` | — | nền `#F0894A` | Cùng vai trò, dùng khi đặt trên `primary-800/900` hoặc dark mode |
| `primary` | `primary-600` | trắng | — | nền `primary-700` | Hành động chính không phải chuyển đổi (Gửi form, Lọc) |
| `outline` | trong suốt | `primary-700` | 1px `neutral-400` | nền `primary-50` | Hành động thứ cấp (Tải MSDS, Xem chi tiết) |
| `ghost` | trong suốt | `neutral-700` | — | nền `neutral-100` | Hành động trong bảng, nút đóng |
| `destructive` | `#B91C1C` | trắng | — | `#991B1B` | Xoá một dòng sản phẩm trong form báo giá |

Kích thước: `sm` cao 36px / padding 12–16 · `md` cao 44px / padding 16–24 (mặc định)
· `lg` cao 52px / padding 20–32. Trên mobile mọi nút tối thiểu 44×44px.

Trạng thái bắt buộc: `hover` (150ms), `focus-visible` (ring 2px offset 2px),
`active` (scale 0.98), `disabled` (opacity 0.5 + `cursor: not-allowed` + `aria-disabled`),
`loading` (spinner `loader-2` quay + `aria-busy` + khoá nút, giữ nguyên chiều rộng).

### 7.2 Input / Select / Textarea

- Nhãn **luôn hiển thị** phía trên field. Placeholder không bao giờ thay thế nhãn.
- Cao tối thiểu 44px, cỡ chữ 16px (tránh iOS auto-zoom), viền 1px `neutral-400`.
- Focus: viền `primary-600` + ring `0 0 0 3px rgb(29 90 151 / .18)`.
- Helper text đặt cố định dưới field bằng `caption`, màu `neutral-500`.
- Lỗi: viền `#B91C1C`, thông báo lỗi ngay dưới field, có icon `alert-circle`,
  bọc trong `role="alert"`. Validate khi `blur`, không validate theo từng phím gõ.
- Dùng đúng `type` và `autocomplete`: `type="tel" autocomplete="tel"`,
  `type="email" autocomplete="email"`, `autocomplete="organization"` cho tên công ty.

### 7.3 Chip phân loại nguy hại (HazardChip)

Chip bo `radius-full`, cao 24px, padding 4/10, `label` 12px weight 600.
Cấu trúc bắt buộc: pictogram GHS (SVG 16px) + tên phân loại tiếng Việt.
Màu lấy từ §2.5. Thuộc tính `title` chứa mô tả đầy đủ của phân loại.

### 7.4 ProductCard

Bố cục dọc: ảnh (tỉ lệ 4:3, `next/image` có `width`/`height`, `loading="lazy"` từ
hàng thứ hai trở đi) → tên sản phẩm (`h4`, cho xuống dòng, tối đa 2 dòng) →
tên hoá học + số CAS (`body-sm`, `tabular`) → hàng chip GHS → xuất xứ + quy cách
(`caption`) → chỉ báo tồn kho → nút `outline` "Xem chi tiết" + nút `cta` "Yêu cầu báo giá".

Thẻ **không** hiển thị giá và **không** có hành động thêm vào giỏ. Nút `cta` điều hướng
thẳng tới form yêu cầu báo giá kèm tham số sản phẩm; không tích luỹ trạng thái, không
có huy hiệu số lượng ở header.

Card bo `radius-lg`, viền 1px `neutral-200`, `shadow-sm`. Hover: `shadow-md` +
`translateY(-2px)` trong 150ms — **không** dùng `scale` để tránh xô lệch bố cục.
Toàn bộ card không phải một link — chỉ tên sản phẩm và nút là vùng chạm, để nút
"Yêu cầu báo giá" không bị nuốt sự kiện.

### 7.5 SpecTable (bảng thông số kỹ thuật)

Hai cột: tên chỉ tiêu (`label`, `neutral-500`) / giá trị (`body`, `neutral-900`, `tabular`).
Hàng chẵn nền `neutral-100`. Kẻ ngang 1px `neutral-200`, không kẻ dọc.
Trên mobile (< 640px) chuyển thành danh sách định nghĩa xếp dọc, không cuộn ngang.
Nếu bảng có thể sắp xếp, nút sắp xếp phải có `aria-sort`.

### 7.6 Khối tài liệu tải về (MSDS / COA / CO / CQ)

Mỗi mục là một hàng: icon `file-text` → tên tài liệu → định dạng và dung lượng
(`caption`, ví dụ "PDF · 240 KB") → ngày ban hành → nút `outline` "Tải về".
Nêu rõ dung lượng trước khi tải là yêu cầu bắt buộc, không phải tuỳ chọn.

### 7.7 Header + Mega menu

Header dính, cao 72px, nền `neutral-0`, khi cuộn quá 8px thêm `shadow-md` (150ms).
Cấu trúc: logo → menu chính (Sản phẩm ▾ · Ngành ứng dụng ▾ · Về An Phát · Tin tức ·
Liên hệ) → hotline dạng link `tel:` → nút `cta` "Yêu cầu báo giá".

Mega menu mở bằng cả hover **và** click/Enter, đóng bằng `Esc`, bẫy tiêu điểm khi
mở bằng bàn phím. Mục đang ở được đánh dấu bằng `aria-current="page"` + gạch chân
2px `primary-600` — không chỉ bằng màu chữ.

Dưới `lg`: chuyển thành drawer trượt từ phải, có nút đóng rõ ràng, nội dung nền
khoá cuộn. Hotline và nút "Yêu cầu báo giá" luôn nằm trong vùng nhìn thấy đầu drawer.

### 7.8 Toast, Modal, Empty state, Skeleton

- **Toast**: góc dưới phải (desktop) / trên cùng (mobile), tự tắt sau 4s, `aria-live="polite"`,
  không cướp tiêu điểm. Hành động huỷ được thì kèm nút "Hoàn tác".
- **Modal**: `radius-xl`, `shadow-xl`, nền phủ `rgb(12 22 34 / .55)` có `backdrop-blur(4px)`.
  Bẫy tiêu điểm, đóng bằng `Esc` và nút X. Nếu form trong modal có dữ liệu chưa lưu,
  hỏi xác nhận trước khi đóng.
- **Empty state**: icon `search-x` 48px màu `neutral-400` + câu giải thích nguyên nhân
  + một hành động khôi phục ("Xoá bộ lọc" hoặc "Liên hệ tư vấn"). Không để trắng trơn.
- **Skeleton**: dùng khi chờ > 300ms, khung có đúng kích thước nội dung thật để
  không gây layout shift. Không dùng spinner toàn trang.

---

## 8. Icon và hình ảnh

- Bộ icon: **Lucide**, stroke 1.5px, cỡ 16/20/24. Một bộ duy nhất trên toàn site.
- **Tuyệt đối không dùng emoji làm icon.**
- Pictogram GHS là SVG chính thức, không vẽ lại, không đổi màu viền đỏ.
- Nút chỉ có icon phải có `aria-label` mô tả hành động.
- Ảnh sản phẩm: WebP/AVIF, khai báo `width`/`height` hoặc `aspect-ratio`, `srcset`
  theo breakpoint. Ảnh hero preload, ảnh dưới màn hình đầu `loading="lazy"`.
- Ảnh có nghĩa cần `alt` mô tả ("Can 25 lít axit sulfuric 98% nhãn An Phát"),
  ảnh trang trí để `alt=""`.

---

## 9. Ngôn từ trên giao diện

| Đúng | Sai |
|------|-----|
| "Yêu cầu báo giá" | "Get a quote", "Liên hệ ngay!!!" |
| "Còn hàng tại kho Bình Dương" | "Có sẵn" |
| "Tải MSDS (PDF · 240 KB)" | "Download" |
| "Số CAS 7664-93-9" | "Mã: 7664939" |
| "Liên hệ báo giá" | "Thêm vào giỏ", "Mua ngay", "999.000đ" |
| "Vui lòng nhập số điện thoại có 10 chữ số" | "Dữ liệu không hợp lệ" |

Thông báo lỗi phải nêu **nguyên nhân + cách sửa**. Thông báo thành công nêu rõ
điều gì sẽ xảy ra tiếp theo ("Đã gửi yêu cầu. Bộ phận kinh doanh sẽ phản hồi trong 4 giờ làm việc").

---

## 10. Hợp đồng khả dụng (Accessibility)

Mục tiêu: **WCAG 2.1 AA**, riêng chữ nội dung chính đạt AAA.

- Tương phản chữ thường ≥ 4.5:1; chữ lớn ≥ 3:1; viền control và chỉ báo trạng thái ≥ 3:1.
- Focus ring nhìn thấy được trên mọi phần tử tương tác — không bao giờ `outline: none`
  mà không thay bằng chỉ báo khác.
- Thứ tự Tab khớp thứ tự thị giác. Có "Bỏ qua tới nội dung chính" ở đầu trang.
- Mọi thông tin truyền bằng màu đều có thêm icon hoặc chữ (đặc biệt là chip GHS và
  trạng thái tồn kho).
- Hỗ trợ phóng chữ hệ thống tới 200% mà không mất nội dung, không cuộn ngang.
- Sau khi chuyển trang, đưa tiêu điểm về vùng `main`.
- Không tắt zoom trong thẻ meta viewport.
- Breadcrumb bắt buộc ở các trang sâu từ 3 cấp (Trang chủ → Danh mục → Sản phẩm).

**Ngoại lệ có chủ đích:** chữ ở trạng thái `disabled` (`#8496AC` trên `#EEF1F5`, 2.67:1)
không đạt 4.5:1. Đây là ngoại lệ WCAG cho phép với control vô hiệu hoá; bù lại bằng
`aria-disabled="true"` và lý do vô hiệu hoá viết bằng chữ bên cạnh.

---

## 11. Kết quả kiểm tra tương phản

Đo bằng công thức tương phản WCAG 2.1 trên các cặp màu thực tế của hệ thống.

| Cặp màu | Tỉ lệ | Mức |
|---------|-------|-----|
| `neutral-900` trên `neutral-50` (chữ chính) | 16.12:1 | AAA |
| `neutral-500` trên `neutral-0` (chữ phụ) | 5.95:1 | AA |
| `primary-600` trên trắng (link, icon) | 7.09:1 | AAA |
| Trắng trên `primary-600` (nút chính) | 7.09:1 | AAA |
| Trắng trên `cta-600` (nút báo giá) | 5.82:1 | AA |
| Trắng trên `cta-700` (nút báo giá hover) | 7.72:1 | AAA |
| `neutral-400` trên `neutral-50` (viền input) | 3.26:1 | AA non-text |
| `success` / `warning` / `danger` trên nền chip tương ứng | 4.55 / 4.83 / 5.68:1 | AA |
| Chip GHS — cặp thấp nhất (GHS09) | 4.55:1 | AA |
| Dark: `foreground` trên `background` | 15.43:1 | AAA |
| Dark: `muted-foreground` trên `background` | 7.69:1 | AAA |
| Dark: `primary-300` trên `background` | 8.71:1 | AAA |
| Dark: `ink` trên `cta-400` (nút báo giá) | 6.44:1 | AA |
| `cta-400` so với nền `primary-900` (viền nút) | 4.83:1 | AA non-text |
| `foreground` sáng `#E6EDF5` trên `primary-900` | 11.57:1 | AAA |
| `muted-foreground` sáng `#9AAABE` trên `primary-800` | 4.91:1 | AA |
| Dark: `border-control` trên `background` | 3.68:1 | AA non-text |

---

## 12. Chống chỉ định

- ❌ Gradient tím/hồng kiểu AI, glassmorphism, nền neon.
- ❌ Thiết kế vui nhộn, minh hoạ hoạt hình, font bo tròn mềm.
- ❌ Giấu chứng nhận, giấy phép kinh doanh hoá chất, hoặc thông tin an toàn xuống footer.
- ❌ Emoji thay icon.
- ❌ Dùng màu làm phương tiện duy nhất để chỉ mức độ nguy hại.
- ❌ Nhiều hơn một CTA chính trên cùng một màn hình.
- ❌ Hover là cách duy nhất để lộ thông tin hoặc hành động.
- ❌ Đổi trạng thái tức thời không transition, hoặc transition > 400ms.
- ❌ Hiệu ứng hover làm xô lệch bố cục (`scale` trên card trong lưới).
- ❌ Bảng thông số cuộn ngang trên mobile.
- ❌ Cắt tên hoá chất bằng ellipsis mà không có `title`.
- ❌ Viết hex thô trong component thay vì token ngữ nghĩa.
- ❌ Giỏ hàng, trang checkout, cổng thanh toán trực tuyến, hoặc huy hiệu số lượng ở header.
- ❌ Hiển thị giá bán dưới bất kỳ hình thức nào, kể cả "giá tham khảo".
- ❌ Nút chat nổi của kênh chưa được vận hành (An Phát chưa có Zalo OA).
- ❌ Khai báo token màu chỉ cho light mode mà bỏ trống biến tương ứng ở `.dark`.

---

## 13. Checklist trước khi bàn giao

- [ ] Không có emoji làm icon; toàn bộ icon từ Lucide, stroke 1.5px
- [ ] `cursor-pointer` trên mọi phần tử bấm được
- [ ] Hover/focus/active/disabled/loading đủ 5 trạng thái cho nút và input
- [ ] Focus ring nhìn thấy được khi điều hướng bằng bàn phím
- [ ] Tương phản chữ ≥ 4.5:1, viền control ≥ 3:1 — kiểm ở cả light và dark
- [ ] Mọi chip GHS có pictogram + chữ, không chỉ màu
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] Kiểm tra bố cục ở 375 / 768 / 1024 / 1440px, không cuộn ngang
- [ ] Nội dung không bị header dính che (đã set `scroll-margin-top`)
- [ ] Ảnh có `width`/`height`, CLS < 0.1
- [ ] Nhãn input hiển thị, lỗi nằm ngay dưới field và có `role="alert"`
- [ ] Bảng thông số chuyển sang danh sách dọc trên mobile
- [ ] Số liệu kỹ thuật dùng `tabular-nums`
- [ ] Đúng một `h1` mỗi trang, tiêu đề không nhảy bậc
- [ ] Có link "Bỏ qua tới nội dung chính"
