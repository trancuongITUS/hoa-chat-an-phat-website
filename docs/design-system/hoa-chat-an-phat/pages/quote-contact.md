# Yêu cầu báo giá & Liên hệ — Override

> Quy tắc trong file này **ghi đè** `../MASTER.md`.
> **Đây là trang chuyển đổi chính của toàn site.** Mọi quyết định thiết kế ưu tiên
> giảm ma sát khi điền form.
>
> **Ràng buộc nền tảng:** website không có giỏ hàng, không có checkout, không thanh toán
> trực tuyến. Mọi hành động mua đều kết thúc ở việc liên hệ công ty. Form dưới đây là
> đích đến duy nhất của mọi nút "Yêu cầu báo giá" trên toàn site.

---

## A. Form yêu cầu báo giá (RFQ)

### Form một trang, ba nhóm trường

Không dùng luồng nhiều bước và không tích luỹ trạng thái giữa các trang. Người dùng
bấm "Yêu cầu báo giá" ở bất kỳ đâu sẽ tới thẳng form này với sản phẩm đã được điền sẵn.

| Nhóm (`fieldset`) | Trường | Ghi chú |
|-------------------|--------|---------|
| **1. Sản phẩm cần báo giá** | Mỗi dòng gồm: tên hoá chất (có gợi ý tìm kiếm), quy cách, số lượng, đơn vị | Dòng đầu điền sẵn từ tham số URL khi đến từ trang sản phẩm. Nút "Thêm dòng" cho tối đa 10 dòng, nút xoá dòng có toast "Hoàn tác". |
| **2. Thông tin liên hệ** | Tên người liên hệ\*, Số điện thoại\*, Email\*, Tên công ty\*, Mã số thuế, Địa chỉ nhận hàng | `autocomplete`: `name`, `tel`, `email`, `organization`, `street-address` |
| **3. Yêu cầu bổ sung** | Thời gian cần hàng, hình thức giao (nhận tại kho An Phát / giao tận nơi), ghi chú | Không bắt buộc, đặt trong khối `<details>` mở sẵn trên desktop, đóng sẵn trên mobile |

### Điền sẵn từ trang sản phẩm

Nút "Yêu cầu báo giá" trên `ProductCard` và trang chi tiết điều hướng tới
`/yeu-cau-bao-gia?sp=<slug>` (kèm `&qc=<quy-cách>` nếu người dùng đã chọn quy cách).
Form đọc tham số, điền dòng sản phẩm đầu tiên, và hiển thị chip xác nhận
"Đang yêu cầu báo giá cho: **Axit sulfuric 98%**" phía trên nhóm 1 để người dùng biết
ngữ cảnh đã được giữ. Nếu tham số không khớp sản phẩm nào, bỏ qua im lặng và để dòng trống.

### Quy tắc form

- Trường bắt buộc đánh dấu bằng dấu `*` **và** chữ "bắt buộc" trong `aria-label`.
- Validate khi `blur`, không validate theo từng phím gõ.
- Lỗi hiện ngay dưới field, có icon `alert-circle`, bọc `role="alert"`.
  Nếu nhiều lỗi, hiện tóm tắt đầu form với anchor tới từng field và tự đưa tiêu điểm
  về field lỗi đầu tiên.
- Lưu nháp vào `localStorage` (khoá theo tên form, hết hạn 7 ngày) để không mất dữ liệu
  khi lỡ thoát. Đây là bản nháp của một form, không phải giỏ hàng — không hiển thị
  huy hiệu số lượng ở header, không có trang "giỏ".
- Nút gửi: trạng thái `loading` khoá nút + spinner, giữ nguyên chiều rộng nút.
- Thành công: chuyển sang màn hình xác nhận có mã yêu cầu (`tabular`), thời gian phản hồi
  cam kết, và nút "Tải bản sao yêu cầu (PDF)". Không chỉ hiện một dòng toast rồi xoá form.
- Thất bại: giữ nguyên toàn bộ dữ liệu đã nhập, nêu nguyên nhân, cho nút "Gửi lại"
  và số hotline dự phòng.

### Ghi đè bố cục

- Desktop: form 7/12 cột bên trái + khối trợ lực dính 4/12 bên phải (hotline, giờ làm việc,
  cam kết thời gian phản hồi, đường dẫn tới danh mục sản phẩm).
- Mobile: một cột; khối trợ lực rút gọn thành một thẻ hotline đặt ngay dưới tiêu đề.
- Khoảng cách giữa các field 20px; ba nhóm trường cách nhau 40px và có `legend` rõ ràng.
- Chiều cao input tối thiểu 48px trên trang này (cao hơn mặc định 44px của MASTER) để
  giảm sai sót khi nhập trên điện thoại ngoài công trường.
- Nhóm 1 trên mobile: mỗi dòng sản phẩm là một khối `radius-md` viền `neutral-200`,
  các trường xếp dọc. Không bao giờ dựng thành bảng cuộn ngang.

---

## B. Trang liên hệ

### Cấu trúc

| # | Khối | Nội dung |
|---|------|----------|
| 1 | Kênh liên hệ nhanh | Hotline (`tel:`), Email (`mailto:`), giờ làm việc. Mỗi kênh là một thẻ có icon Lucide, vùng chạm ≥ 44px. |
| 2 | Danh sách địa điểm | Văn phòng và từng kho: địa chỉ đầy đủ, số điện thoại riêng, giờ tiếp nhận hàng, nút "Chỉ đường" mở Google Maps. |
| 3 | Bản đồ | Nhúng **sau** tương tác (ảnh tĩnh + nút "Xem bản đồ") để không kéo iframe nặng vào lần tải đầu. |
| 4 | Form liên hệ ngắn | Tối đa 4 trường: Tên, Số điện thoại, Nội dung, và select "Chủ đề". Không dùng lại form RFQ ở đây. |

### Ghi đè màu

- Thẻ hotline dùng nền `cta-50` viền 1px `cta-600` để nổi hơn các kênh còn lại — hotline
  là kênh chuyển đổi nhanh nhất với khách hàng công nghiệp Việt Nam.
- Các thẻ kênh còn lại nền `neutral-0` viền `neutral-200`.

### Kênh chat

An Phát **chưa có Zalo OA chính thức**. Không đặt nút Zalo, Messenger hay widget chat
của bên thứ ba lên giao diện cho tới khi có kênh thật được vận hành — một nút chat
không ai trực còn tệ hơn là không có nút nào. Khi mở kênh, thêm vào khối 1 dưới dạng
một thẻ kênh nữa, giữ nguyên spec thẻ hiện tại; không dùng bong bóng chat nổi góc màn hình
vì nó che nút hành động dính ở trang chi tiết sản phẩm trên mobile.

### Không làm

- ❌ Form RFQ nhiều bước hoặc dài hơn 12 trường.
- ❌ Placeholder thay cho nhãn.
- ❌ CAPTCHA hiện ngay từ đầu — chỉ kích hoạt khi phát hiện hành vi bất thường.
- ❌ Hiển thị huy hiệu số lượng kiểu giỏ hàng ở header.
- ❌ Bắt buộc email ở form liên hệ ngắn; email chỉ bắt buộc ở luồng RFQ vì báo giá cần gửi văn bản.
- ❌ Xoá trắng form khi gửi thất bại.
- ❌ Nhúng iframe bản đồ ngay khi tải trang.
