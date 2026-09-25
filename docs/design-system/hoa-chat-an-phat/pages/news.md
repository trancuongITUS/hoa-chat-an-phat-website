# Tin tức & Kiến thức ngành — Override

> Quy tắc trong file này **ghi đè** `../MASTER.md`.
> **Mục tiêu:** thu hút tìm kiếm tự nhiên bằng nội dung kỹ thuật, rồi dẫn sang danh mục
> sản phẩm liên quan.

---

## A. Trang danh sách

### Bố cục

- Desktop: lưới 3 cột, bài nổi bật đầu tiên chiếm 2 cột × 1 hàng.
- Tablet 2 cột, mobile 1 cột. Gap 24px.
- Bộ lọc dạng hàng chip theo chuyên mục: **Kiến thức hoá chất · Ứng dụng theo ngành ·
  An toàn & Tuân thủ · Tin công ty**. Chip đang chọn nền `primary-600` chữ trắng,
  đồng thời có `aria-pressed="true"` — không chỉ phân biệt bằng màu.
- Phân trang ở cuối, không infinite scroll.

### ArticleCard

Ảnh bìa 16:9 (`next/image`, lazy từ hàng 2) → chip chuyên mục (`overline`) → tiêu đề
(`h4`, tối đa 3 dòng, không ellipsis giữa chừng) → đoạn tóm tắt (`body-sm`, 2 dòng) →
ngày đăng + thời gian đọc (`caption`, `tabular`).

Card bo `radius-lg`, viền `neutral-200`. Hover `shadow-md` + `translateY(-2px)`.
Vùng bấm là ảnh và tiêu đề.

---

## B. Trang bài viết

### Bố cục

- Cột nội dung chính giới hạn **68ch**, căn giữa.
- Trên `xl`: mục lục dính ở cột trái, đánh dấu mục đang đọc bằng thanh dọc 2px
  `primary-600` **và** chữ đậm.
- Thanh tiến trình đọc 2px `primary-600` dính sát dưới header.

### Ghi đè kiểu chữ

- Cỡ chữ thân bài tăng lên **18/30** (`body-lg`) thay vì 16/26 — đây là trang đọc dài.
- Khoảng cách giữa các đoạn 20px; trước `h2` là 48px, trước `h3` là 32px.
- `h2` trong bài có đường kẻ trên 1px `neutral-200`, padding-top 24px.
- Bảng dữ liệu kỹ thuật trong bài dùng spec SpecTable của MASTER §7.5, cho phép
  bọc trong vùng cuộn ngang **chỉ khi** bảng có hơn 3 cột, và phải có gợi ý cuộn.
- Khối code hoặc công thức hoá học dùng nền `neutral-100`, `radius-sm`, padding 16px.

### Khối chèn trong bài

- **Callout an toàn:** nền `warning`, icon `alert-triangle`, dùng cho lưu ý xử lý hoá chất.
- **Callout kỹ thuật:** nền `info`, icon `info`.
- **Khối sản phẩm liên quan:** chèn giữa bài hoặc cuối bài, hiển thị 2 ProductCard —
  đây là cầu nối chuyển đổi chính của trang tin.

### Cuối bài

Tác giả (nếu là bài kỹ thuật, nêu rõ chuyên môn) → ngày cập nhật gần nhất →
nút chia sẻ (Facebook, Zalo, sao chép link) → 3 bài liên quan → khối CTA `cta` "Yêu cầu báo giá".

Nút chia sẻ Zalo dùng link chia sẻ công khai, không phụ thuộc Zalo OA — đây là ngoại lệ
duy nhất được phép nhắc tới Zalo khi công ty chưa có kênh OA. Không đặt nút "Chat Zalo"
ở bất kỳ đâu.

### SEO

- Schema.org `Article` với `datePublished` và `dateModified`.
- Bài kiến thức kỹ thuật nêu rõ nguồn tham chiếu (tiêu chuẩn TCVN, ASTM, nhà sản xuất).

### Không làm

- ❌ Quảng cáo xen giữa bài.
- ❌ Pop-up đăng ký nhận tin che nội dung khi vừa vào trang.
- ❌ Chữ thân bài nghiêng cả đoạn (khó đọc với dấu tiếng Việt).
- ❌ Ảnh bìa không khai báo kích thước (gây CLS).
