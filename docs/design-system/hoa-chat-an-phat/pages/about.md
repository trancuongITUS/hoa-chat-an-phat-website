# Giới thiệu — Override

> Quy tắc trong file này **ghi đè** `../MASTER.md`.
> **Mục tiêu:** chuyển người đọc đang phân vân sang trạng thái tin tưởng đủ để gửi yêu cầu báo giá.

## Cấu trúc section

| # | Section | Nội dung bắt buộc |
|---|---------|-------------------|
| 1 | **Tiêu đề trang** | `h1` + đoạn dẫn `body-lg`, nền `neutral-0`, có breadcrumb phía trên. |
| 2 | **Câu chuyện công ty** | Khối văn bản `max-w-[68ch]` cạnh ảnh thật của kho/văn phòng. Nêu năm thành lập, lĩnh vực, quy mô. Không dùng sáo ngữ. |
| 3 | **Dòng thời gian** | Mốc phát triển theo năm, bố cục dọc trên mobile, ngang trên `lg`. Năm dùng `tabular`. |
| 4 | **Giấy phép và chứng nhận** | Lưới thẻ tài liệu theo spec MASTER §7.6 — mỗi giấy tờ có tên, cơ quan cấp, số hiệu, hiệu lực, nút xem bản scan. |
| 5 | **Năng lực kho vận** | Bảng: địa điểm kho, diện tích, loại hình lưu trữ (bồn / kệ / khu hoá chất nguy hại), bán kính giao hàng. |
| 6 | **Đội ngũ** | Chỉ đưa nhân sự thật, có ảnh thật, chức danh và lĩnh vực phụ trách. Nếu không có ảnh thật thì bỏ hẳn section này. |
| 7 | **An toàn và tuân thủ** | Cam kết về vận chuyển hàng nguy hiểm, lưu trữ, xử lý sự cố tràn đổ, tập huấn nhân viên. |
| 8 | **CTA** | Nút `cta` "Yêu cầu báo giá" + `outline` "Xem danh mục sản phẩm". |

## Ghi đè bố cục

- Nội dung văn bản giới hạn 68ch; ảnh nằm cột phải 5/12 trên `lg`, xếp dưới trên mobile.
- Dòng thời gian trên `lg` dùng thanh ngang với mốc tròn 12px màu `primary-600`,
  đường nối 2px `neutral-200`.

## Ghi đè kiểu chữ

- Trích dẫn (nếu có) dùng `body-lg` weight 500, viền trái 3px `primary-600`, padding trái 20px.
  Không nghiêng cả đoạn — chữ nghiêng làm dấu tiếng Việt khó đọc.

## Component riêng của trang

- **CertificateCard**: ảnh thu nhỏ bản scan (tỉ lệ 3:4, viền 1px `neutral-200`) + tên +
  cơ quan cấp + số hiệu (`tabular`) + hiệu lực. Bấm mở modal xem full, modal có nút tải PDF.
- **TimelineItem**: năm (`h4`, `tabular`) + tiêu đề mốc (`label`) + mô tả (`body-sm`).

## Không làm

- ❌ Ảnh stock doanh nhân bắt tay, phòng lab minh hoạ, quả địa cầu.
- ❌ Con số thành tích không có nguồn.
- ❌ Đội ngũ dùng ảnh avatar tạo sẵn hoặc ảnh mua sẵn.
