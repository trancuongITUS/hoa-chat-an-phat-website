# Nhận diện thương hiệu — Hoá chất An Phát

> **Trạng thái:** v1.0 — đã chốt biểu tượng **Lục giác giọt** (23/09/2026).
> Màu, chữ và nguyên tắc thị giác kế thừa [`../MASTER.md`](../MASTER.md). Tệp này chỉ
> bổ sung phần thương hiệu: tên, logo, cách dùng logo.

## 1. Nền tảng

| Âm tiết | Nghĩa dùng cho thương hiệu |
|---------|----------------------------|
| **An** | An toàn, an tâm: đúng chất, đúng nồng độ, đủ chứng từ, giao không sự cố |
| **Phát** | Phát hàng (việc hằng ngày của nhà phân phối) và phát triển |

**Tính cách:** Chính xác · Đáng tin · Tiết chế · Có trách nhiệm. Giọng văn theo MASTER §9.

**Khẩu hiệu đề xuất** (chưa chốt):

- Đúng chất. Đủ chứng từ. Giao an toàn.
- An toàn trong từng lô hàng phát đi.
- Hoá chất công nghiệp, chứng từ đầy đủ.

> “An Phát” là tên phổ biến. Logo luôn đi kèm dòng mô tả “Hoá chất công nghiệp”. Công ty
> chưa có logo đăng ký trước đó; cần tra cứu nhãn hiệu tại Cục Sở hữu trí tuệ trước khi nộp
> đơn đăng ký cho biểu tượng này.

## 2. Logo — Lục giác giọt

Hình lục giác của vòng benzen, bên trong khoét một giọt chất lỏng. Mực chất lỏng màu cam là
“đúng mức”: đúng nồng độ, đúng định lượng, đúng lô hàng. Tên viết hoa đầu từ “An Phát”
(Be Vietnam Pro Bold), dòng mô tả “HOÁ CHẤT CÔNG NGHIỆP” (SemiBold, in hoa, tracking +120).

Hướng dựng logo từ chữ “Á” (vòng 1) và ba hướng biểu tượng khác (vòng 2) đã bị loại.

### Tệp gốc — [`logo/`](logo/)

Chữ đã chuyển thành nét, tệp không phụ thuộc font trên máy. Không có `clipPath` hay `id`,
nên nhúng nhiều lần trên cùng trang không xung đột.

| Tệp | Dùng khi |
|-----|----------|
| `an-phat-lockup.svg` | **Bản chính** — header, tiêu đề chứng từ, nhãn hàng |
| `an-phat-lockup-dark.svg` | Logo ngang trên nền `primary-800` trở lên |
| `an-phat-stacked.svg` / `-dark` | Logo đứng — bìa hồ sơ năng lực, biển hiệu kho |
| `an-phat-symbol.svg` / `-dark` | Biểu tượng riêng — dấu mộc, tem, góc tài liệu |
| `an-phat-symbol-mono.svg` | Một màu — fax, in lụa, khắc laser |
| `an-phat-favicon.svg` | Favicon; giọt tô trắng để rõ trên thanh tab tối |
| `an-phat-app-icon.svg`, `apple-icon.png` | Ảnh đại diện mạng xã hội, icon màn hình chính (180px) |

### Trong code

| Nơi | Tệp |
|-----|-----|
| Biểu tượng dùng lại được (header, footer) | `src/components/brand-mark.tsx` — hình học khớp `an-phat-symbol.svg` |
| Favicon | `src/app/icon.svg` (bản sao `an-phat-favicon.svg`) |
| Icon iOS | `src/app/apple-icon.png` |

Khi sửa hình logo, cập nhật đồng thời tệp trong `logo/` và `brand-mark.tsx`.

## 3. Màu logo

| Vai trò | Nền sáng | Nền tối | Token |
|---------|----------|---------|-------|
| Lục giác, chữ logo | `#133A61` | `#FFFFFF` | `primary-800` / `neutral-0` |
| Mực chất lỏng | `#B23F0C` | `#EA7C33` | `cta-600` / `cta-400` |
| Dòng mô tả | `#55657A` | `#B9D5EF` | `neutral-500` / `primary-200` |
| Đơn sắc | `#0A1F34` | — | `primary-950` |

Cam trong logo là ngoại lệ đã ghi ở MASTER §2.2: chỉ nằm bên trong logo.

## 4. Quy tắc dùng

- **Khoảng trống:** tối thiểu 1x quanh logo, x = 1/5 chiều cao biểu tượng.
- **Kích thước tối thiểu:** biểu tượng 16px / 5 mm; logo ngang 120px / 30 mm. Nhỏ hơn thì
  bỏ dòng mô tả.
- **Nền tối** (`primary-800` trở lên): dùng bản `-dark`. Không đặt bản navy lên nền xanh.
- **Không được:** kéo giãn, xoay, đổi màu mực chất lỏng, thêm bóng đổ, viền, gradient hay hiệu ứng.
- **Trên nhãn hàng nguy hiểm:** logo nằm ở dải đầu nhãn và nhường chỗ cho thông tin GHS.
  Pictogram GHS dùng tệp chính thức (MASTER §8).
- **Trên xe:** biển báo hàng nguy hiểm màu cam theo quy định đặt tách khỏi logo.
