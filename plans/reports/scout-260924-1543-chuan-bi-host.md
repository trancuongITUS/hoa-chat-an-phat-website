# Scout: cần làm gì trước khi host website An Phát

Ngày 2026-09-24. Rà soát mã nguồn và chạy thử bản production trên máy.

## Kết luận

Về mặt build, website đã sẵn sàng: `npm run build` chạy sạch và sinh 45 trang, `tsc` không lỗi,
`eslint src` không lỗi, `npm audit` không có lỗ hổng. Chạy `next start` thì mọi route trả 200,
trang không tồn tại trả 404, tối ưu ảnh hoạt động.

Chưa host được là vì **nội dung và danh tính**, không phải vì mã: site vẫn chạy dữ liệu mẫu,
chưa có tên miền thật, form báo giá chỉ mở ứng dụng email. Ngoài ra còn thiếu vài thứ kỹ thuật
nhỏ mà một site công khai nên có (robots, sitemap, header bảo mật).

## Việc bắt buộc (chặn phát hành)

1. **Chọn nơi host.** `/san-pham` và `/tin-tuc` là route động (đọc `searchParams` để lọc), nên cần
   máy chủ Node chứ không xuất tĩnh thuần được. Lựa chọn:
   - Vercel: triển khai Next.js không cần cấu hình. Lưu ý gói Hobby miễn phí không cho dùng cho
     mục đích thương mại; website công ty cần gói Pro.
   - VPS hoặc container tự quản: thêm `output: 'standalone'` vào `next.config.ts`, chạy sau
     Nginx/Caddy để có HTTPS. Cần Node ≥ 20.9 (máy hiện dùng Node 24).
   - Muốn host tĩnh (Cloudflare Pages, GitHub Pages, S3): phải chuyển phần lọc của hai trang trên
     sang phía client, rồi dùng `output: 'export'`. Tối ưu ảnh của `next/image` cũng phải tắt.
2. **Tên miền thật.** `https://hoachatanphat.example.com` đang ghi cứng ở hai nơi:
   `src/app/layout.tsx:13` (`metadataBase`) và `src/app/tin-tuc/[slug]/page.tsx:20` (`SITE_ORIGIN`,
   dùng cho link chia sẻ). Nên gom về một hằng số hoặc biến môi trường.
3. **Thay dữ liệu mẫu** theo bảng trong `docs/README.md`, rồi đặt `IS_SAMPLE_CONTENT = false`
   (`src/data/company.ts:12`) để tắt dòng cảnh báo ở chân trang. Trọng tâm:
   - `src/data/company.ts`: hotline `0000 000 000`, email `kinhdoanh@example.com`, mã số thuế,
     địa chỉ, số liệu năng lực, giấy chứng nhận, kho.
   - `src/data/products.ts`: tình trạng kho, quy cách, xuất xứ, ngày chứng từ.
   - `src/data/articles.ts`: cần người phụ trách kỹ thuật duyệt.
   - `public/tai-lieu/*.pdf`: bốn tệp mẫu chỉ khoảng 1 KB, phải thay bằng MSDS/COA/CO/CQ thật.
   - Ảnh kho, xe bồn, văn phòng và bài "kho Hải Phòng" không phải của An Phát.
4. **Form báo giá và liên hệ.** `submitQuoteRequest()` (`src/lib/rfq.ts:210`) mở `mailto:`. Máy
   không cài ứng dụng email (phần lớn máy văn phòng dùng webmail) sẽ không gửi được gì, và công ty
   không biết đã mất khách. Với site B2B mà mọi chuyển đổi đi qua form, nên có backend trước khi
   phát hành: một Route Handler gửi thư qua dịch vụ như Resend, kèm chống spam (honeypot hoặc
   Turnstile) và giới hạn tần suất. Đây là quyết định ngày 2026-09-21 ("chưa cần backend"), cần
   bạn chốt lại. Nếu nối backend thì sửa luôn màn hình xác nhận trong `quote-form.tsx` như
   README đã ghi.

## Nên làm trước khi phát hành

5. **`robots.ts` và `sitemap.ts`.** Hiện `/robots.txt` và `/sitemap.xml` đều 404. Có sẵn danh sách
   `PRODUCTS` và `ARTICLES` nên sitemap chỉ cần vài dòng. Nếu phải đưa lên mạng khi còn dữ liệu
   mẫu (ví dụ bản staging), chặn index để Google không lưu số điện thoại giả.
6. **Header bảo mật** qua `headers()` trong `next.config.ts`: `Strict-Transport-Security`,
   `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` hoặc CSP `frame-ancestors`.
   Nếu thêm CSP thì phải cho phép iframe `google.com/maps` và các script JSON-LD. Đặt
   `poweredByHeader: false` để bỏ `X-Powered-By: Next.js`.
7. **Script `lint` hỏng.** `npm run lint` gọi `next lint`, lệnh này đã bị gỡ ở Next 16 nên báo
   lỗi "Invalid project directory". Đổi thành `eslint .`.
8. **Chưa có `error.tsx` / `global-error.tsx`.** Site gần như tĩnh nên rủi ro thấp, nhưng nếu
   route động lỗi lúc chạy thì người dùng sẽ thấy trang lỗi mặc định, không có header và footer.
9. **Ảnh chia sẻ mạng xã hội.** Chưa có `opengraph-image` nên link gửi qua Zalo hoặc Facebook sẽ
   không có ảnh xem trước. Các trang cũng chưa khai báo `alternates.canonical`.
10. **Lỗi khôi phục bản nháp** (đã nêu trong báo cáo hiệu năng 260924, chưa sửa): `loadDraft()`
    kiểm tra bằng `partial(quoteRequestSchema)` nên bản nháp điền dở bị bỏ, trái với lời hứa trên
    form.
11. **Đưa mã vào git.** Thư mục hiện không phải git repo. Vercel và phần lớn nền tảng khác triển
    khai từ git. `assets/` nặng 78 MB (ảnh gốc và ảnh đã xử lý, site không dùng tới); cân nhắc
    loại khỏi repo hoặc lưu riêng.

## Ngoài kỹ thuật nhưng liên quan tới việc host

- Form thu tên, số điện thoại, email: theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân,
  nên có trang chính sách quyền riêng tư và dòng đồng ý ở form, nhất là khi có backend lưu dữ liệu.
- Nếu dùng tên miền `.vn`, cần đăng ký qua nhà đăng ký được VNNIC công nhận.
- Nên có công cụ đo lường (Google Search Console, và analytics nếu muốn) ngay từ ngày đầu.

## Câu hỏi chưa giải quyết

- Bạn muốn host ở đâu: Vercel, VPS tự quản, hay host tĩnh? Câu trả lời quyết định mục 1 và cách
  làm mục 4.
- Tên miền chính thức là gì?
- Có nối backend cho form trước khi phát hành không? Nếu có thì gửi email, lưu database, hay cả hai?
- Có cần bản staging công khai (đã chặn index) để công ty duyệt nội dung thật trước không?
