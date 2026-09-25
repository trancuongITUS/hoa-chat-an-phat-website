# Rà soát chuyển động — website Hoá chất An Phát

Ngày: 2026-09-24 · Phạm vi: toàn bộ `src/` · Chỉ đọc code, chưa sửa code nguồn.
Token tham chiếu: [`motion-tokens-260924-1419.dtcg.json`](motion-tokens-260924-1419.dtcg.json)

## Kết luận nhanh

Nền chuyển động hiện tại khá kỷ luật: có token (`globals.css` §5), chỉ animate
`transform`/`opacity`, và đã có nhánh `prefers-reduced-motion`. Có ba vấn đề cần sửa trước:

1. Hiệu ứng nhấc thẻ khi hover **không chạy** trên ProductCard và ArticleCard.
2. Dải logo khách hàng chạy liên tục nhưng **không có nút dừng** cho người dùng bàn phím hoặc cảm ứng (WCAG 2.2.2, mức A).
3. Nhánh giảm chuyển động tắt luôn cả hiệu ứng mờ dần (fade), trái với MASTER §5 (MASTER yêu cầu giữ opacity ≤ 100ms).

Chỗ còn thiếu nhiều nhất là chuyển động **nhân–quả** (Causality): xoá hoặc thêm dòng trong
form báo giá và đổi bộ lọc danh mục hiện đang làm nội dung nhảy mà không có chuyển tiếp nào.

## 1. Bộ thông số (dials)

Chọn preset `ecommerce-mass`: tempo **neutral**, amplitude **moderate**, character **mechanical**.

- **Số lần một người thấy tương tác trong ngày:** người mua hàng lọc danh mục và xem thông số
  khoảng 10–50 lần trong một phiên làm việc. Con số này nằm giữa hai ngưỡng nên chọn tempo `neutral`.
- **Con trỏ lướt qua nhiều mục hay dừng ở một mục:** lưới thẻ lớn nên con trỏ thường dừng
  trên từng thẻ, nhưng danh sách bộ lọc thì bị lướt nhanh. Vì vậy chọn `moderate`: dịch
  chuyển tối đa 16px, phóng to tối đa 2%, và vẫn giữ quy tắc của MASTER là không `scale` thẻ trong lưới.
- **Chất chuyển động (character):** thương hiệu an toàn và kỹ thuật nên chọn `mechanical`.
  MASTER đã có sẵn đường cong riêng (`ease-out` .22,1,.36,1). Đây là dial rẻ nhất để đổi
  nên **giữ đường cong của MASTER**.
- **Không tách hai bộ token.** Đã cân nhắc dùng `marketing-landing` cho trang chủ và
  bác bỏ, vì MASTER cấm chuyển động trang trí và giới hạn số phần tử chuyển động
  trong mỗi khung nhìn. Amplitude `expressive` sẽ mâu thuẫn trực tiếp với hai quy tắc đó.

### Đối chiếu giá trị sinh ra với token MASTER

| Vai trò | Máy sinh | MASTER / code hiện tại | Quyết định |
|---|---|---|---|
| Feedback (hover, nhấn) | 100ms | `duration-fast` 150ms | Giữ 150ms. Vẫn nằm trong khoảng 50–150ms và là quyết định của MASTER |
| Orientation gần (modal, mega menu) | 300ms | `duration-slow` 300ms | Khớp |
| Orientation vừa (drawer ~400px) | 400ms | 300ms | Giữ 300ms, nằm trong khoảng cho phép (xem câu hỏi 2) |
| Causality / Attention gần | 250ms | `duration-base` 200ms | Dùng 200ms. Vẫn trong khoảng 150–500ms và không phải tạo thêm token |
| Thoát (exit) | ≤ vào | `duration-exit` 120ms | Khớp |
| Độ trễ trước khi hiện trạng thái chờ | 200ms | MASTER: skeleton khi chờ > 300ms | **Thêm token** `--duration-continuity-delay: 300ms` |
| Dịch chuyển tối đa | 16px | rise-in 12px, hover 2px | Đạt |
| Phóng to/thu nhỏ tối đa | 2% | nút bấm 0.98 đạt; **modal `zoom-in-95` = 5% vượt ngưỡng** | Sửa thành 0.98 |
| Stagger | tối đa 60ms/mục, tổng ≤ 500ms | 40ms/mục, **viết cứng trong TSX** | Thêm token `--stagger: 40ms` (MASTER §5 có liệt kê nhưng `globals.css` chưa khai báo) |

Theo MASTER §5: phần tử đi vào dùng `--ease-out`, phần tử đi ra dùng `--ease-in`, chuyển trạng thái tại chỗ dùng `--ease-standard`.

## 2. Danh sách cần sửa hoặc thêm

### P0 — Lỗi thật, sửa trước

> **Đính chính (kiểm trên trình duyệt, 2026-09-24):** chẩn đoán ở mục 1 dưới đây **sai**.
> Tailwind v4 dùng thuộc tính `translate` cho `hover:-translate-y-0.5`, nên animation giữ
> `transform: none` không đè được nó và thẻ vẫn nhấc lên khi hover. Lỗi thật là một lỗi khác:
> transition của thẻ và nút khai báo `transform`, trong khi Tailwind v4 đổi `translate`/`scale`.
> Vì vậy thẻ nhấc lên và nút lún xuống **tức thì, không có transition**. Đã sửa bằng cách
> liệt kê `translate` (thẻ) và `scale` (nút) trong danh sách transition.

**1. Hover nhấc thẻ không chạy trên ProductCard và ArticleCard** — vai trò Feedback
- Vị trí: `globals.css:415-417`, `product-card.tsx:41-45`, `article-card.tsx:31-35`
- Nguyên nhân: `.animate-rise-in` dùng `animation-fill-mode: both`. Sau khi chạy xong,
  animation vẫn giữ `transform: none`. Theo cascade của CSS, giá trị do animation giữ lại
  thắng khai báo thường, nên `hover:-translate-y-0.5` bị ghi đè; khi hover chỉ còn đổi bóng.
  Thẻ ngành ở trang chủ không bị lỗi này vì animation gắn trên `li` còn hover gắn trên `Link` bên trong.
- Cách sửa: đổi `both` → `backwards`. Giá trị đầu vẫn được giữ trong lúc chờ stagger,
  và không còn giữ giá trị cuối sau khi animation kết thúc.
- Kiểm chứng: mới suy ra từ quy tắc cascade, **chưa kiểm trên trình duyệt**.

**2. Dải logo khách hàng vi phạm WCAG 2.2.2** — không gắn được vai trò nào, là trang trí
- Vị trí: `client-marquee.tsx`, `globals.css:422-452`
- Dải chạy vô hạn (32s mỗi vòng), nằm cạnh nội dung khác, và chỉ dừng khi `:hover` hoặc
  `:active`. Người dùng bàn phím không có cách dừng. Người dùng cảm ứng phải giữ ngón tay để dừng.
- Trang chủ đã dùng hiệu ứng thương hiệu duy nhất của trang cho phần số liệu đếm lên.
  Hiện dải logo cũng chỉ chứa placeholder.
- Đề xuất: **(a)** chuyển thành lưới tĩnh — bố cục này đã có sẵn trong nhánh reduced-motion;
  hoặc **(b)** giữ dải chạy, thêm nút "Tạm dừng / Chạy tiếp" nhìn thấy được và dừng khi `:focus-within`.
  `linear` là đúng cho vòng lặp, không cần đổi. (Xem câu hỏi 1.)

### P1 — Lệch MASTER hoặc thiếu vai trò quan trọng

**3. Nhánh reduced-motion tắt cả opacity** — Gate 1
- Vị trí: `globals.css:475-482`. Quy tắc `*` ép mọi `transition-duration` về 0.01ms, nên
  modal, drawer và mega menu hiện ra bằng cú cắt cảnh. MASTER §5 yêu cầu "chỉ giữ đổi opacity ≤ 100ms".
- Đề xuất: bỏ phần dịch chuyển và phóng to của tw-animate trong media query (đặt biến
  translate/scale lúc vào và lúc ra về 0 hoặc 1), giới hạn thời lượng ở 100ms thay vì 0.01ms.
  Giữ nguyên các nhánh riêng cho marquee và rise-in.
- Lưu ý khi làm: tên biến của tw-animate-css cần đối chiếu trong `node_modules` (lần rà này không đọc được).

**4. Xoá / thêm / hoàn tác dòng trong form báo giá** — vai trò Causality (thiếu hoàn toàn)
- Vị trí: `quote-form.tsx`, danh sách `request.lines`
- Hiện tại: xoá dòng làm các dòng bên dưới nhảy lên ngay. "Hoàn tác" chèn lại tức thì.
  "Thêm dòng" hiện dòng mới đột ngột ở cuối danh sách.
- **Điều kiện trước:** danh sách đang dùng `key={index}`. Phải có id ổn định cho từng dòng,
  nếu không React sẽ tái dùng DOM sai dòng và không làm được animation lúc thoát.
- Khi vào (thêm dòng hoặc hoàn tác): opacity 0→1 kết hợp `translateY(8px)`, `--duration-base`, `--ease-out`.
- Khi thoát: thu gọn bằng `grid-template-rows: 1fr → 0fr` kết hợp opacity, `--duration-exit`, `--ease-in`. Không animate `height`.

**5. Đổi bộ lọc hoặc chuyển trang danh mục** — vai trò Continuity kết hợp Causality, Gate 4
- Vị trí: `filter-panel.tsx` (debounce 300ms rồi `router.replace`), `catalog-controls.tsx`, `san-pham/page.tsx`
- Hiện tại: trong khoảng chờ debounce cộng thời gian tải từ máy chủ, giao diện không phản hồi gì.
  Khi có kết quả, thẻ cũ biến mất tức thì còn thẻ mới chạy `rise-in`, nên lưới lẫn lộn thẻ đứng yên và thẻ đang trồi lên.
- Đề xuất:
  - Bọc `router.replace` trong `useTransition`. Khi `isPending`, lưới nhận `aria-busy` và
    mờ về khoảng 0.6. Chỉ làm mờ sau `--duration-continuity-delay` để tránh nháy khi phản hồi nhanh.
  - **Bỏ `rise-in` trên lưới `/san-pham`**. Người mua thấy lưới này nhiều lần trong một phiên,
    nên theo Gate 4 cần bỏ. ProductCard nhận thêm prop để tắt animation; trang chủ vẫn giữ.
  - Dòng "N kết quả" chỉ cần thêm fade theo `--duration-base`. Không dùng FLIP để sắp lại vị trí thẻ,
    vì như vậy quá nhiều chuyển động cho một thao tác lặp lại liên tục.

**6. Lỗi trong form xuất hiện đột ngột** — vai trò Attention
- Vị trí: thông báo lỗi dưới field (`field.tsx`) và khối tóm tắt lỗi (`quote-form.tsx`, `contact-form.tsx`)
- Đề xuất: khi vào, opacity kết hợp `translateY(-4px)`, `--duration-base`, `--ease-out`.
  Khi người dùng sửa xong thì cho lỗi biến mất ngay, vì đó là hệ quả trực tiếp của thao tác họ vừa làm.
  Lỗi đã có icon kèm chữ, không chỉ dựa vào màu, nên đạt yêu cầu.

**7. Skeleton hiện ngay lập tức** — vai trò Continuity
- Vị trí: `san-pham/loading.tsx`, `ui/states.tsx`
- MASTER §7.8 quy định "skeleton khi chờ > 300ms", nhưng hiện skeleton hiện ngay, nên khi phản hồi nhanh sẽ thấy lưới xám nháy lên.
- Đề xuất: bọc skeleton để nó mờ dần vào với `animation-delay: var(--duration-continuity-delay)` và `fill-mode: backwards`.

### P2 — Đồng bộ và hoàn thiện

**8. Chuyển mọi thời lượng viết cứng sang token**
- `dialog.tsx` đang dùng `duration-300` và `duration-120`; `site-header.tsx:225` dùng `duration-200`;
  `globals.css:416` viết cứng `300ms`; stagger viết `40ms` trong 3 file TSX.
  Đổi toàn bộ sang `var(--duration-*)` và `var(--stagger)`.
- Modal, drawer và mega menu chưa khai báo easing, nên đang dùng easing mặc định của tw-animate
  (nhiều khả năng là `ease`, **chưa kiểm**). Cần gắn `--ease-out` cho chiều vào và `--ease-in` cho chiều ra.
- Modal chứng nhận đang dùng `zoom-in-95` và `zoom-out-95`: đổi thành 98 để nằm trong giới hạn amplitude.

**9. Mega menu** — vai trò Orientation
- Chiều vào: giữ `slide-in-from-top-1` (4px). Thời lượng đổi sang `--duration-base`, vì menu được mở rất nhiều nên nên chọn mức thấp của khoảng cho phép.
- Chiều ra: hiện menu bị gỡ khỏi DOM ngay. Chấp nhận giữ như vậy vì tần suất mở cao.
- Mở bằng hover đang không có độ trễ, nên con trỏ lướt ngang thanh menu sẽ làm menu bật lên liên tục.
  Nên thêm độ trễ khoảng 100ms trước khi mở bằng hover. Click và Enter vẫn mở ngay.

**10. Link đổi màu tức thì khi hover** — vai trò Feedback
- Vị trí: link ở footer, breadcrumb, hàng checkbox/radio bộ lọc, link con trong drawer mobile,
  tên thẻ sản phẩm và bài viết, trang `/nguon-anh`.
- MASTER §9 cấm "đổi trạng thái tức thời không transition". Cần thêm `transition-colors duration-[var(--duration-fast)]`.

**11. Trang chủ: `rise-in` chạy khi lưới còn nằm ngoài màn hình** — vai trò Orientation (yếu)
- Animation chạy lúc tải trang, lúc đó lưới ngành và lưới sản phẩm thường còn nằm dưới màn hình đầu tiên, nên người dùng không thấy.
- Đề xuất: chỉ bắt đầu khi lưới vào khung nhìn, dùng IntersectionObserver và chạy một lần.
  Có thể tái dùng mẫu của `TrustStats`.

**12. Bản đồ nhúng** — vai trò Continuity
- Vị trí: `deferred-map.tsx`. Khi bấm "Xem bản đồ", ảnh tĩnh bị thay ngay bằng iframe trắng trong lúc Google Maps tải.
- Đề xuất: giữ ảnh tĩnh phía dưới, iframe mờ dần vào khi `onLoad` với `--duration-base`.

**13. Cuộn mượt khi bấm mục lục bài viết** — vai trò Orientation
- Hiện bấm mục lục thì trang nhảy thẳng tới mục. Nên dùng `scroll-behavior: smooth`.
  Nhánh reduced-motion đã đặt sẵn `auto !important`, nên không cần xử lý thêm cho trường hợp đó.
- Trước khi làm, đọc hướng dẫn về scroll behavior của Next 16 trong `node_modules/next/dist/docs/`
  (theo AGENTS.md), để cuộn mượt không ảnh hưởng tới lúc chuyển trang.

### P3 — Tuỳ chọn, giá trị thấp

- Nút sao chép số CAS: icon Copy → Check hiện đổi đột ngột. Có thể làm mờ chéo (crossfade) 100–150ms.
- "Xem thêm N mục" trong bộ lọc: có thể mở rộng bằng `grid-template-rows` với `--duration-base`.
- Chip bộ lọc đang áp dụng: có thể fade khi chip xuất hiện.

### Không nên thêm

- Hiệu ứng vào cho hero hoặc parallax: home.md cấm parallax, và hero là phần tử LCP.
- Chuyển cảnh giữa các trang (View Transitions): ít giá trị với site B2B chủ yếu để đọc và tra cứu.
- Hiện dần từng section khi cuộn, trên mọi trang: là trang trí và vi phạm giới hạn "tối đa 2 phần tử chuyển động mỗi khung nhìn".
- Phóng to thẻ khi hover, hoặc ẩn/hiện header theo hướng cuộn.

### Giữ nguyên (đã đạt)

- Nút: `active:scale-[0.98]` với 150ms.
- Chevron của menu xoay 150ms.
- Viền và vòng focus của input.
- Bóng header khi cuộn quá 8px.
- Thanh tiến trình đọc dùng `scaleX` và không có transition. Đúng, vì thanh phải bám sát vị trí cuộn.
- Số liệu đếm lên trong 600ms, chạy một lần và tắt khi reduced-motion. Đây là hiệu ứng thương hiệu duy nhất của trang chủ.
- Toast của sonner. Drawer vào từ đúng cạnh: menu từ phải, bộ lọc từ trái.

## 3. Kết quả bốn gate (trạng thái hiện tại)

| Gate | Kết quả | Ghi chú |
|---|---|---|
| 1. Reduced motion | **Đạt một phần** | Mọi chuyển động đều có nhánh reduced-motion, nhưng nhánh này tắt cả opacity (mục 3). Riêng spinner và skeleton pulse cũng dừng — chấp nhận được vì vẫn còn `aria-busy` và hình khối skeleton |
| 2. Chỉ dùng thuộc tính compositor | **Đạt, có miễn trừ** | Chỉ animate transform và opacity. Có ba chỗ được miễn trừ: `box-shadow` của header, thẻ và input chỉ gây paint (không gây layout) và kéo dài ≤ 150ms; số đếm lên đổi text trong ô lưới có kích thước cố định |
| 3. Ngắt được giữa chừng | **Đạt** | Hover và nhấn dùng CSS transition nên đổi hướng được. Modal và drawer dùng keyframe, nên nếu đóng khi đang mở sẽ có một cú nhảy nhỏ. Mức này chấp nhận được |
| 4. Tần suất lặp lại | **Không đạt** | Marquee vi phạm WCAG 2.2.2 (mục 2). `rise-in` trên lưới danh mục lặp lại quá nhiều lần (mục 5) |

Các gate trên được kiểm bằng cách đọc code, **chưa chạy trên trình duyệt** và chưa bật reduced-motion để thử.

## 4. Quy tắc khi triển khai

- Mọi `transition` và `animation` phải tham chiếu `var(--duration-*)`, `var(--ease-*)` hoặc `var(--stagger)`.
  Giá trị mili-giây viết cứng trong diff được coi là lỗi. Ngoại lệ: thời gian của bộ đếm giờ trạng thái
  (ví dụ reset icon sau 2 giây, đóng menu sau 120ms) vì đó không phải thời lượng animation.
- Token cần thêm vào `globals.css`: `--duration-continuity-delay: 300ms` và `--stagger: 40ms`.
  File DTCG đi kèm báo cáo này là bản tham chiếu. Nguồn sự thật vẫn là MASTER §5 và `globals.css`.

## Câu hỏi cần chốt

1. **Dải logo khách hàng:** chuyển thành lưới tĩnh (khuyến nghị), hay giữ dải chạy và thêm nút tạm dừng?
2. **Thời lượng drawer:** máy sinh đề xuất 400ms cho quãng trượt khoảng 400px. MASTER đặt 300ms. Giữ 300ms (khuyến nghị) hay đổi?
3. **Bỏ `rise-in` trên lưới `/san-pham`:** việc này lệch khỏi dòng "ProductCard vào theo stagger" trong home.md.
   Dòng đó nằm ở phần trang chủ nên có vẻ không bắt buộc cho trang danh mục, nhưng cần xác nhận.
