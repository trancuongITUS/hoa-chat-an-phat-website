# Danh mục & Chi tiết sản phẩm — Override

> Quy tắc trong file này **ghi đè** `../MASTER.md`.
> **Mật độ thông tin: cao.** Đây là trang làm việc, không phải trang giới thiệu.
> **Mục tiêu:** tìm đúng hoá chất, xác nhận thông số, rồi liên hệ công ty để lấy báo giá.
>
> **Ràng buộc nền tảng:** không hiển thị giá, không giỏ hàng, không checkout, không
> thanh toán trực tuyến. Mọi hành động mua đều điều hướng sang form yêu cầu báo giá
> (xem `quote-contact.md`) hoặc hotline.

---

## A. Trang danh mục

### Bố cục

- Desktop (`≥ lg`): sidebar lọc cố định rộng 280px bên trái + lưới sản phẩm 3 cột.
  Sidebar dính, tự cuộn riêng, **không** lồng vùng cuộn gây xung đột với cuộn trang.
- Tablet: lưới 2 cột, bộ lọc thu vào nút "Bộ lọc" mở drawer từ trái.
- Mobile: lưới 1 cột, thanh công cụ dính dưới cùng chứa "Bộ lọc" và "Sắp xếp".
- Gap lưới 24px. Padding card giảm còn 16px để tăng mật độ.

### Bộ lọc

| Nhóm lọc | Kiểu control |
|----------|--------------|
| Ngành ứng dụng | Checkbox nhiều lựa chọn |
| Nhóm hoá chất (axit, bazơ, dung môi, muối, phụ gia…) | Checkbox nhiều lựa chọn |
| Phân loại nguy hại GHS | Checkbox kèm pictogram |
| Dạng tồn tại (lỏng / rắn / khí) | Radio |
| Quy cách đóng gói | Checkbox |
| Xuất xứ | Select có tìm kiếm |
| Tình trạng kho | Radio (Còn hàng / Đặt trước / Tất cả) |

Quy tắc bộ lọc:

- Mỗi nhóm lọc là một `fieldset` có `legend`, mặc định 5 mục đầu, còn lại ẩn sau "Xem thêm".
- Bộ lọc đang áp dụng hiện thành hàng chip có nút X phía trên lưới, kèm nút "Xoá tất cả".
- Trạng thái lọc đồng bộ vào URL query để chia sẻ và deep link được.
- Quay lại từ trang chi tiết phải khôi phục đúng bộ lọc và vị trí cuộn.
- Kết quả cập nhật có debounce 300ms, vùng kết quả có `aria-live="polite"` báo số lượng.

### Trạng thái

- **Đang tải:** skeleton đúng 9 ô ProductCard, giữ nguyên chiều cao lưới để tránh layout shift.
- **Rỗng:** icon `search-x` + "Không tìm thấy hoá chất phù hợp với bộ lọc hiện tại" +
  nút `outline` "Xoá bộ lọc" + nút `cta` "Nhờ tư vấn tìm sản phẩm".
- **Lỗi tải:** thông báo nguyên nhân + nút "Thử lại".
- Danh sách trên 50 mục dùng phân trang (không infinite scroll — người mua cần quay lại đúng vị trí).

---

## B. Trang chi tiết sản phẩm

### Thứ tự khối — thông số đứng trước marketing

| # | Khối | Ghi chú |
|---|------|---------|
| 1 | Breadcrumb | Trang chủ → Danh mục → Nhóm → Tên sản phẩm |
| 2 | Tên sản phẩm (`h1`) + tên hoá học + số CAS | CAS dùng `tabular`, có nút sao chép |
| 3 | Hàng chip GHS | Theo MASTER §7.3, đặt ngay dưới tiêu đề — không đẩy xuống dưới |
| 4 | Ảnh sản phẩm + tình trạng kho + quy cách | Cột trái 5/12 trên `lg` |
| 5 | **Bảng thông số kỹ thuật** | Theo MASTER §7.5 — công thức, nồng độ, tỉ trọng, pH, độ tinh khiết, xuất xứ, mã HS |
| 6 | Khối hành động dính | Nút `cta` "Yêu cầu báo giá" (điều hướng tới `/yeu-cau-bao-gia?sp=<slug>`, mang theo quy cách đang chọn) + `outline` "Gọi tư vấn" (`tel:`). Dính dưới màn hình trên mobile. Không có nút thêm vào giỏ, không hiển thị giá |
| 7 | Tài liệu tải về | MSDS, COA, CO/CQ theo MASTER §7.6 |
| 8 | Ứng dụng và ngành sử dụng | Danh sách gạch đầu dòng, không phải đoạn văn dài |
| 9 | Hướng dẫn bảo quản và xử lý an toàn | Khối `warning` có icon `alert-triangle` |
| 10 | Sản phẩm liên quan | 4 ProductCard |

### Ghi đè component

- **Khối hành động dính (mobile):** thanh dưới cùng cao 72px, nền `neutral-0`,
  `shadow-lg` hướng lên, z-index 20. Nội dung trang phải có `padding-bottom: 72px`.
- **Bảng thông số:** trên mobile chuyển thành `<dl>` xếp dọc. Tuyệt đối không cuộn ngang.
- **Nút sao chép số CAS:** icon `copy`, phản hồi bằng toast "Đã sao chép số CAS 7664-93-9",
  đổi icon sang `check` trong 2s.

### Ghi đè kiểu chữ

- Tên sản phẩm `h1` cho phép xuống dòng tối đa 3 dòng, không ellipsis.
- Toàn bộ giá trị trong bảng thông số và số CAS dùng `tabular-nums`.

### SEO và dữ liệu có cấu trúc

- Mỗi sản phẩm có schema.org `Product`, kèm `identifier` là số CAS.
- Trang danh mục có `BreadcrumbList`.

### Không làm

- ❌ Đặt mô tả marketing phía trên bảng thông số.
- ❌ Ẩn phân loại nguy hại trong tab phải bấm mới thấy.
- ❌ Hiển thị giá dưới mọi hình thức, kể cả "giá từ…" hay "giá tham khảo". An Phát báo giá theo lô qua liên hệ.
- ❌ Giỏ hàng, nút "Mua ngay", trang checkout, hoặc bất kỳ bước thanh toán trực tuyến nào.
- ❌ Bộ lọc theo khoảng giá (không có giá để lọc).
- ❌ Infinite scroll ở trang danh mục.
- ❌ Toàn bộ ProductCard là một thẻ `<a>` bọc ngoài (nuốt sự kiện của nút bên trong).
