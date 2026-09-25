/**
 * Tin tức và kiến thức ngành — DỮ LIỆU MẪU.
 *
 * Nội dung kỹ thuật dựa trên kiến thức hoá học phổ thông và thực hành vận hành thông
 * dụng; tên tác giả và ngày đăng là chỗ dành sẵn. Trước khi phát hành thật, cần người
 * phụ trách kỹ thuật của An Phát rà soát lại từng bài và bổ sung nguồn tham chiếu cụ thể.
 */
import type { Article } from './types'

export const ARTICLES: Article[] = [
  {
    slug: 'chon-pac-hay-phen-nhom-cho-tram-xu-ly-nuoc-thai',
    title: 'Chọn PAC hay phèn nhôm cho trạm xử lý nước thải?',
    summary:
      'So sánh liều dùng, ảnh hưởng tới pH, lượng bùn sinh ra và chi phí vận hành thực tế của hai chất keo tụ phổ biến nhất.',
    category: 'kien-thuc-hoa-chat',
    publishedAt: '2026-08-28',
    updatedAt: '2026-09-10',
    readingMinutes: 8,
    author: { name: 'Kỹ sư phụ trách kỹ thuật', role: 'Chuyên môn xử lý nước, 12 năm vận hành trạm' },
    references: [
      'TCVN 6663-1:2011 — Chất lượng nước, lấy mẫu',
      'QCVN 40:2011/BTNMT — Nước thải công nghiệp',
      'Tài liệu kỹ thuật của nhà sản xuất PAC',
    ],
    relatedProductSlugs: ['pac-poly-aluminium-chloride', 'phen-nhom-al2so4-3'],
    featured: true,
    blocks: [
      {
        type: 'paragraph',
        text: 'Phèn nhôm và PAC cùng là chất keo tụ gốc nhôm, nhưng cách chúng hoạt động trong bể phản ứng khác nhau đủ để tạo ra chênh lệch rõ rệt về chi phí hoá chất, lượng bùn và công sức điều chỉnh pH. Bài viết so sánh hai chất trên các tiêu chí mà người vận hành thực sự quan tâm.',
      },
      {
        type: 'heading',
        id: 'co-che-keo-tu',
        text: 'Cơ chế keo tụ khác nhau ở đâu',
      },
      {
        type: 'paragraph',
        text: 'Phèn nhôm khi vào nước phải thuỷ phân trước rồi mới tạo ra các phức nhôm hydroxit mang điện tích dương. Quá trình thuỷ phân này tiêu thụ độ kiềm của nước và làm pH giảm. PAC thì đã được thuỷ phân sẵn một phần ngay trong quá trình sản xuất — đó chính là ý nghĩa của chỉ số độ kiềm hoá (basicity) ghi trên phiếu phân tích.',
      },
      {
        type: 'formula',
        text: 'Al₂(SO₄)₃ + 6H₂O → 2Al(OH)₃↓ + 3H₂SO₄',
      },
      {
        type: 'paragraph',
        text: 'Phản ứng trên cho thấy mỗi mol phèn nhôm sinh ra ba mol axit sulfuric. Với nước có độ kiềm thấp, lượng axit này kéo pH xuống dưới vùng keo tụ tối ưu và buộc người vận hành phải bơm thêm kiềm để bù.',
      },
      {
        type: 'heading',
        id: 'so-sanh-van-hanh',
        text: 'So sánh trên các chỉ tiêu vận hành',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'Liều dùng điển hình', value: 'PAC 15–40 mg/L · Phèn nhôm 40–120 mg/L' },
          { label: 'Ảnh hưởng tới pH', value: 'PAC giảm 0,2–0,5 · Phèn nhôm giảm 0,8–1,5' },
          { label: 'Khoảng pH hiệu quả', value: 'PAC 6,0–9,0 · Phèn nhôm 6,5–7,5' },
          { label: 'Tốc độ tạo bông', value: 'PAC nhanh hơn, bông chắc hơn' },
          { label: 'Lượng bùn sinh ra', value: 'PAC thấp hơn khoảng 20–30 %' },
          { label: 'Hiệu quả ở nước lạnh', value: 'PAC ổn định hơn dưới 15 °C' },
        ],
      },
      {
        type: 'callout-tech',
        text: 'Các con số trên là khoảng tham chiếu cho nước thải công nghiệp thông thường. Liều thật phải xác định bằng thí nghiệm jar test trên chính mẫu nước của nhà máy, vì thành phần nước thải mỗi nơi một khác.',
      },
      {
        type: 'heading',
        id: 'khi-nao-chon-gi',
        text: 'Khi nào chọn loại nào',
      },
      {
        type: 'list',
        items: [
          'Chọn PAC khi nước có độ kiềm thấp, nhiệt độ thấp, hoặc khi chi phí xử lý bùn đang là gánh nặng.',
          'Chọn PAC khi hệ thống không có bơm kiềm tự động và bạn muốn giảm số lần can thiệp thủ công.',
          'Chọn phèn nhôm khi nước có độ kiềm dư dồi dào và bài toán ưu tiên là chi phí hoá chất trên mỗi mét khối.',
          'Chọn phèn nhôm khi hệ thống đã ổn định nhiều năm với nó và việc chuyển đổi đòi hỏi hiệu chỉnh lại toàn bộ liều lượng.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Cả hai đều tạo dung dịch có tính axit. Pha chế trong bồn nhựa hoặc composite, không dùng thùng thép thường. Đeo kính bảo hộ và khẩu trang chống bụi khi cân chia sản phẩm dạng bột.',
      },
      {
        type: 'heading',
        id: 'cach-kiem-chung',
        text: 'Cách kiểm chứng trước khi đổi',
      },
      {
        type: 'paragraph',
        text: 'Đừng đổi chất keo tụ dựa trên bảng so sánh. Chạy jar test song song với ít nhất năm mức liều cho mỗi chất, đo độ đục, pH sau keo tụ và thể tích bùn sau 30 phút lắng. Sau đó tính chi phí trên mỗi mét khối nước đã bao gồm cả hoá chất điều chỉnh pH và chi phí xử lý bùn — đó mới là con số quyết định.',
      },
    ],
  },
  {
    slug: 'doc-hieu-phieu-an-toan-hoa-chat-msds',
    title: 'Đọc hiểu phiếu an toàn hoá chất (MSDS) trong 10 phút',
    summary:
      'Mười sáu mục của một MSDS chuẩn, mục nào thực sự cần đọc trước khi nhận hàng và mục nào chỉ dùng khi có sự cố.',
    category: 'an-toan-tuan-thu',
    publishedAt: '2026-08-14',
    updatedAt: '2026-08-14',
    readingMinutes: 6,
    author: { name: 'Phụ trách an toàn hoá chất', role: 'Chứng chỉ huấn luyện an toàn hoá chất' },
    references: [
      'GHS Rev.10 — Hệ thống hài hoà toàn cầu về phân loại và ghi nhãn hoá chất',
      'Nghị định về quản lý hoá chất hiện hành',
    ],
    relatedProductSlugs: ['axit-sulfuric-98', 'methanol'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Phiếu an toàn hoá chất là tài liệu bắt buộc đi kèm mỗi lô hàng, nhưng phần lớn người nhận hàng chỉ lưu nó vào tủ hồ sơ mà không đọc. Dưới đây là cách đọc nhanh, tập trung vào những mục ảnh hưởng trực tiếp tới việc bạn lưu trữ và sử dụng hoá chất như thế nào.',
      },
      {
        type: 'heading',
        id: 'muc-doc-truoc',
        text: 'Bốn mục cần đọc trước khi hàng vào kho',
      },
      {
        type: 'list',
        items: [
          'Mục 2 — Nhận dạng nguy hại: cho biết pictogram GHS và cụm từ cảnh báo, quyết định hoá chất được xếp vào khu nào trong kho.',
          'Mục 7 — Xử lý và lưu trữ: nêu nhiệt độ, vật liệu thùng chứa tương thích và các nhóm hoá chất phải để tách riêng.',
          'Mục 8 — Kiểm soát phơi nhiễm: xác định loại găng tay, mặt nạ và yêu cầu thông gió cần chuẩn bị trước.',
          'Mục 10 — Tính ổn định và khả năng phản ứng: liệt kê những chất không được để gần, đây là mục hay bị bỏ qua nhất.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Mục 10 là nơi ghi rõ những cặp chất không được lưu chung. Ví dụ nước Javen và axit gặp nhau sinh khí clo độc ngay lập tức. Một sơ đồ bố trí kho không tham chiếu mục này là một sơ đồ chưa an toàn.',
      },
      {
        type: 'heading',
        id: 'muc-dung-khi-su-co',
        text: 'Các mục chỉ dùng khi có sự cố',
      },
      {
        type: 'paragraph',
        text: 'Mục 4 (biện pháp sơ cứu), mục 5 (chữa cháy) và mục 6 (xử lý rò rỉ) nên được in riêng, ép nhựa và dán ngay tại khu lưu trữ thay vì để trong tủ hồ sơ. Khi sự cố xảy ra, không ai có thời gian lật tìm tài liệu.',
      },
      {
        type: 'heading',
        id: 'kiem-tra-tinh-hop-le',
        text: 'Kiểm tra tính hợp lệ của phiếu',
      },
      {
        type: 'list',
        items: [
          'Phiếu phải ghi rõ tên nhà sản xuất hoặc nhà nhập khẩu, kèm số điện thoại liên hệ khẩn cấp.',
          'Ngày ban hành hoặc ngày soát xét gần nhất phải có, và không nên quá cũ so với lô hàng.',
          'Phân loại GHS trên phiếu phải khớp với nhãn dán trên thùng chứa thực tế.',
          'Phiếu bằng tiếng Việt là bắt buộc với hoá chất lưu hành trong nước.',
        ],
      },
    ],
  },
  {
    slug: 'bo-tri-kho-hoa-chat-tach-nhom-tuong-ky',
    title: 'Bố trí kho hoá chất: những nhóm tuyệt đối không để cạnh nhau',
    summary:
      'Bảng tương kỵ rút gọn cho kho vừa và nhỏ, kèm nguyên tắc bố trí khu vực và khoảng cách tối thiểu.',
    category: 'an-toan-tuan-thu',
    publishedAt: '2026-07-30',
    updatedAt: '2026-09-02',
    readingMinutes: 7,
    author: { name: 'Phụ trách an toàn hoá chất', role: 'Chứng chỉ huấn luyện an toàn hoá chất' },
    references: ['GHS Rev.10', 'Tiêu chuẩn NFPA về lưu trữ chất lỏng dễ cháy'],
    relatedProductSlugs: ['javen-naocl-10', 'axit-clohydric-32'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Phần lớn sự cố hoá chất trong kho không đến từ một chất đơn lẻ, mà đến từ hai chất gặp nhau khi không nên gặp. Một vết rò rỉ nhỏ ở kệ trên có thể trở thành đám cháy hoặc đám mây khí độc nếu bên dưới là nhóm tương kỵ.',
      },
      {
        type: 'heading',
        id: 'bang-tuong-ky',
        text: 'Bảng tương kỵ rút gọn',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'Axit mạnh', value: 'Không để cạnh: kiềm, hypoclorit, xyanua, kim loại hoạt động' },
          { label: 'Kiềm mạnh', value: 'Không để cạnh: axit, kim loại nhôm và kẽm' },
          { label: 'Chất oxy hoá', value: 'Không để cạnh: dung môi, dầu mỡ, giẻ lau, chất khử' },
          { label: 'Dung môi dễ cháy', value: 'Không để cạnh: chất oxy hoá, nguồn nhiệt, thiết bị điện thường' },
          { label: 'Hypoclorit', value: 'Không để cạnh: mọi loại axit, amoniac' },
          { label: 'Chất khử (metabisulfit)', value: 'Không để cạnh: axit, chất oxy hoá' },
        ],
      },
      {
        type: 'callout-safety',
        text: 'Trường hợp nguy hiểm và phổ biến nhất ở Việt Nam là để chung nước Javen với axit clohydric trong khu vệ sinh công nghiệp. Hai can rò rỉ cạnh nhau đủ sinh lượng khí clo gây ngạt trong không gian kín.',
      },
      {
        type: 'heading',
        id: 'nguyen-tac-bo-tri',
        text: 'Bốn nguyên tắc bố trí',
      },
      {
        type: 'list',
        items: [
          'Tách theo khu vực có vách ngăn, không chỉ tách bằng khoảng cách trên cùng một kệ.',
          'Không bao giờ để chất lỏng phía trên chất rắn tương kỵ — rò rỉ luôn chảy xuống.',
          'Mỗi khu có đê bao riêng, không nối cống chung giữa các khu tương kỵ.',
          'Dán bảng phân loại GHS ngay tại lối vào từng khu, đủ lớn để đọc từ xa 3 mét.',
        ],
      },
      {
        type: 'heading',
        id: 'kiem-tra-dinh-ky',
        text: 'Kiểm tra định kỳ',
      },
      {
        type: 'paragraph',
        text: 'Sơ đồ kho đúng vào ngày thiết lập không có nghĩa nó còn đúng sau sáu tháng. Hàng mới về, hàng tồn dồn kệ và thay đổi nhân sự đều làm sơ đồ trôi dần khỏi thực tế. Đặt lịch kiểm tra hàng quý, đối chiếu vị trí thực tế với sơ đồ và ghi nhận sai lệch.',
      },
    ],
  },
  {
    slug: 'kiem-soat-ph-trong-nhuom-hoat-tinh',
    title: 'Kiểm soát pH trong nhuộm hoạt tính: vì sao mẻ nhuộm lệch màu',
    summary:
      'Quan hệ giữa pH, nhiệt độ và độ tận trích trong nhuộm hoạt tính, cùng cách xây dựng quy trình bơm axit sau nhuộm.',
    category: 'ung-dung-theo-nganh',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingMinutes: 9,
    author: { name: 'Kỹ sư ứng dụng ngành dệt', role: 'Chuyên môn hoá nhuộm, 9 năm tại nhà máy dệt' },
    references: ['Tài liệu kỹ thuật của nhà sản xuất thuốc nhuộm hoạt tính', 'TCVN về nước thải dệt nhuộm'],
    relatedProductSlugs: ['soda-ash-na2co3', 'axit-axetic-99'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Lệch màu giữa các mẻ nhuộm hiếm khi do thuốc nhuộm. Trong phần lớn trường hợp, nguyên nhân nằm ở pH không lặp lại được giữa mẻ này và mẻ khác, đặc biệt ở giai đoạn cố định màu và giai đoạn trung hoà sau nhuộm.',
      },
      {
        type: 'heading',
        id: 'vai-tro-cua-ph',
        text: 'pH làm gì trong nhuộm hoạt tính',
      },
      {
        type: 'paragraph',
        text: 'Thuốc nhuộm hoạt tính liên kết cộng hoá trị với nhóm hydroxyl của cellulose, và phản ứng này chỉ xảy ra hiệu quả trong môi trường kiềm. Soda ash nâng pH lên vùng 10,5–11,5 để kích hoạt phản ứng. Nhưng pH cao cũng đẩy nhanh thuỷ phân thuốc nhuộm — phần thuốc nhuộm đã thuỷ phân không còn bám được vào sợi và trôi vào nước thải.',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'pH giai đoạn tận trích', value: '6,5 – 7,5' },
          { label: 'pH giai đoạn cố định màu', value: '10,5 – 11,5' },
          { label: 'pH sau trung hoà', value: '5,5 – 6,5' },
          { label: 'Nhiệt độ cố định màu', value: '60 °C với thuốc nhuộm nóng lạnh, 80 °C với loại nóng' },
          { label: 'Độ tận trích mong đợi', value: '65 – 80 % tuỳ gam màu' },
        ],
      },
      {
        type: 'callout-tech',
        text: 'Sai lệch 0,5 đơn vị pH ở giai đoạn cố định màu có thể làm thay đổi độ đậm màu tới mức mắt thường nhận ra được, nhất là với các gam màu trung tính như xám và be.',
      },
      {
        type: 'heading',
        id: 'quy-trinh-bom-axit',
        text: 'Xây dựng quy trình bơm axit sau nhuộm',
      },
      {
        type: 'list',
        items: [
          'Dùng axit axetic thay vì axit vô cơ mạnh — tính đệm của nó giúp pH hạ từ từ và ít vọt quá đích.',
          'Bơm theo tốc độ cố định trong ít nhất 10 phút, không đổ một lần.',
          'Đo pH tại điểm cách xa vị trí bơm để tránh đọc phải vùng chưa trộn đều.',
          'Hiệu chuẩn đầu đo pH hằng ngày; đầu đo trôi là nguyên nhân âm thầm phổ biến nhất.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Axit axetic băng đông đặc dưới 16 °C và có điểm chớp cháy 39 °C. Kho chứa cần thoáng, xa nguồn nhiệt, và cần gia nhiệt nhẹ trước khi rót vào mùa lạnh.',
      },
    ],
  },
  {
    slug: 'khu-clo-du-truoc-mang-ro',
    title: 'Khử clo dư trước màng RO: liều lượng và điểm châm hoá chất',
    summary:
      'Vì sao màng RO hỏng vì clo, cách tính liều natri metabisulfit và nên đặt điểm châm ở đâu trong dây chuyền.',
    category: 'ung-dung-theo-nganh',
    publishedAt: '2026-06-28',
    updatedAt: '2026-08-20',
    readingMinutes: 7,
    author: { name: 'Kỹ sư phụ trách kỹ thuật', role: 'Chuyên môn xử lý nước, 12 năm vận hành trạm' },
    references: ['Hướng dẫn vận hành của nhà sản xuất màng RO', 'TCVN 6663-1:2011'],
    relatedProductSlugs: ['natri-metabisulfit', 'javen-naocl-10'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Màng RO polyamide bị oxy hoá không hồi phục khi tiếp xúc với clo tự do. Tổn thương tích luỹ theo tổng lượng clo đi qua màng, nên một sự cố ngắn ở nồng độ cao cũng đủ rút ngắn tuổi thọ màng đáng kể.',
      },
      {
        type: 'heading',
        id: 'tinh-lieu',
        text: 'Tính liều natri metabisulfit',
      },
      {
        type: 'paragraph',
        text: 'Về lý thuyết cần khoảng 1,47 mg natri metabisulfit để khử 1 mg clo tự do. Trong vận hành thực tế, người ta dùng hệ số dư 1,5–3 lần để bù cho phản ứng không hoàn toàn và cho phần chất khử bị tiêu thụ bởi oxy hoà tan.',
      },
      {
        type: 'formula',
        text: 'Na₂S₂O₅ + 2Cl₂ + 3H₂O → 2NaHSO₄ + 4HCl',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'Tỉ lệ lý thuyết', value: '1,47 mg Na₂S₂O₅ trên 1 mg Cl₂' },
          { label: 'Hệ số dư thực tế', value: '1,5 – 3,0 lần' },
          { label: 'ORP mục tiêu sau khử', value: '200 – 300 mV' },
          { label: 'Clo tự do cho phép trước màng', value: '< 0,02 mg/L' },
          { label: 'Thời gian tiếp xúc tối thiểu', value: '20 giây' },
        ],
      },
      {
        type: 'callout-tech',
        text: 'Đo ORP đáng tin hơn đo clo dư ở nồng độ rất thấp. Đặt ngưỡng cảnh báo ORP và khoá bơm cấp RO khi vượt ngưỡng là biện pháp bảo vệ màng rẻ nhất mà nhiều trạm chưa làm.',
      },
      {
        type: 'heading',
        id: 'diem-cham',
        text: 'Đặt điểm châm ở đâu',
      },
      {
        type: 'list',
        items: [
          'Châm sau lọc than hoạt tính và trước bơm cao áp, đảm bảo đủ thời gian tiếp xúc trên đường ống.',
          'Châm vào điểm có dòng chảy rối để trộn đều, không châm vào đoạn ống thẳng dòng chảy tầng.',
          'Đặt đầu đo ORP sau điểm châm ít nhất 10 lần đường kính ống.',
          'Không châm dư quá nhiều — metabisulfit dư nuôi vi sinh và gây tắc màng sinh học.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Natri metabisulfit gặp axit giải phóng khí SO₂ độc. Bồn pha phải đặt riêng, không dùng chung khu với bồn axit và không dùng chung đường thoát tràn.',
      },
    ],
  },
  {
    slug: 'luu-tru-hydro-peroxit-dung-cach',
    title: 'Lưu trữ hydro peroxit đúng cách: vì sao can bị phồng',
    summary:
      'Cơ chế phân huỷ của H₂O₂, các yếu tố đẩy nhanh phân huỷ và yêu cầu bắt buộc với thùng chứa.',
    category: 'kien-thuc-hoa-chat',
    publishedAt: '2026-06-12',
    updatedAt: '2026-06-12',
    readingMinutes: 5,
    author: { name: 'Phụ trách an toàn hoá chất', role: 'Chứng chỉ huấn luyện an toàn hoá chất' },
    references: ['Tài liệu kỹ thuật của nhà sản xuất hydro peroxit', 'GHS Rev.10'],
    relatedProductSlugs: ['hydro-peroxit-50', 'canxi-hypoclorit-70'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Can hydro peroxit phồng lên là dấu hiệu sản phẩm đang phân huỷ nhanh hơn bình thường. Bản thân phản ứng phân huỷ luôn diễn ra, nhưng tốc độ của nó phụ thuộc mạnh vào nhiệt độ, tạp chất kim loại và độ pH.',
      },
      {
        type: 'formula',
        text: '2H₂O₂ → 2H₂O + O₂↑',
      },
      {
        type: 'heading',
        id: 'yeu-to-day-nhanh',
        text: 'Những gì đẩy nhanh phân huỷ',
      },
      {
        type: 'list',
        items: [
          'Nhiệt độ cao — cứ tăng 10 °C thì tốc độ phân huỷ tăng khoảng gấp đôi.',
          'Vết kim loại chuyển tiếp như sắt, đồng, mangan xúc tác phản ứng rất mạnh.',
          'pH cao — dung dịch kiềm làm H₂O₂ phân huỷ nhanh hơn nhiều so với môi trường axit nhẹ.',
          'Bụi bẩn, giẻ lau hoặc bất kỳ chất hữu cơ nào rơi vào thùng chứa.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Thùng chứa hydro peroxit bắt buộc phải có van thoát khí. Đậy kín hoàn toàn khiến oxy sinh ra tích tụ áp suất và có thể làm nổ thùng. Đây là lỗi thường gặp khi người ta sang chiết sang can cũ của hoá chất khác.',
      },
      {
        type: 'heading',
        id: 'yeu-cau-luu-tru',
        text: 'Yêu cầu lưu trữ',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'Nhiệt độ bảo quản', value: 'Dưới 30 °C, tránh nắng trực tiếp' },
          { label: 'Vật liệu thùng chứa', value: 'HDPE nguyên sinh hoặc nhôm độ tinh khiết cao' },
          { label: 'Vật liệu cấm dùng', value: 'Thép thường, đồng, thùng đã chứa hoá chất khác' },
          { label: 'Thông gió khu chứa', value: 'Thông gió tự nhiên hoặc cưỡng bức, không gian kín tuyệt đối cấm' },
          { label: 'Khoảng cách với chất hữu cơ', value: 'Khu riêng, có vách ngăn' },
        ],
      },
    ],
  },
  {
    slug: 'an-phat-mo-kho-hai-phong',
    title: 'An Phát đưa kho Hải Phòng vào vận hành',
    summary:
      'Kho thứ ba tại miền Bắc rút thời gian giao hàng cho khách khu vực phía Bắc xuống dưới 24 giờ.',
    category: 'tin-cong-ty',
    publishedAt: '2026-05-20',
    updatedAt: '2026-05-20',
    readingMinutes: 3,
    author: { name: 'Phòng truyền thông', role: 'Hoá chất An Phát' },
    references: [],
    relatedProductSlugs: ['methanol', 'isopropyl-alcohol'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Kho Hải Phòng với diện tích 1.800 m² đã được đưa vào vận hành, bổ sung cho hai kho hiện có tại Bình Dương và Long An. Kho mới tập trung nhóm dung môi và hoá chất phục vụ khách hàng khu vực phía Bắc.',
      },
      {
        type: 'heading',
        id: 'nang-luc-kho-moi',
        text: 'Năng lực kho mới',
      },
      {
        type: 'list',
        items: [
          'Khu dung môi có thông gió cưỡng bức và thiết bị điện phòng nổ.',
          'Bồn chứa dung môi phục vụ khách hàng dùng số lượng lớn.',
          'Bán kính giao hàng 180 km, bao phủ phần lớn các khu công nghiệp phía Bắc.',
          'Giờ tiếp nhận hàng từ 08:00 đến 17:00, Thứ Hai đến Thứ Bảy.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Khách hàng khu vực phía Bắc có thể liên hệ trực tiếp kho Hải Phòng để đặt lịch nhận hàng hoặc gửi yêu cầu báo giá qua website như thường lệ.',
      },
    ],
  },
  {
    slug: 'chon-dung-moi-tay-rua-cho-xuong-co-khi',
    title: 'Chọn dung môi tẩy rửa cho xưởng cơ khí: bốn tiêu chí thực tế',
    summary:
      'So sánh axeton, IPA và dung môi thơm trên tốc độ bay hơi, khả năng hoà tan, độ an toàn và chi phí.',
    category: 'ung-dung-theo-nganh',
    publishedAt: '2026-05-05',
    updatedAt: '2026-08-25',
    readingMinutes: 6,
    author: { name: 'Kỹ sư ứng dụng công nghiệp', role: 'Chuyên môn dung môi và xử lý bề mặt' },
    references: ['Phiếu an toàn hoá chất của từng dung môi', 'Tiêu chuẩn NFPA về chất lỏng dễ cháy'],
    relatedProductSlugs: ['axeton', 'isopropyl-alcohol'],
    featured: false,
    blocks: [
      {
        type: 'paragraph',
        text: 'Không có dung môi tốt nhất, chỉ có dung môi phù hợp với loại bẩn cần tẩy và điều kiện an toàn của xưởng. Bốn tiêu chí dưới đây quyết định phần lớn lựa chọn trong thực tế.',
      },
      {
        type: 'heading',
        id: 'bon-tieu-chi',
        text: 'Bốn tiêu chí so sánh',
      },
      {
        type: 'spec-table',
        rows: [
          { label: 'Axeton — bay hơi', value: 'Rất nhanh, gần như không để lại cặn' },
          { label: 'Axeton — điểm chớp cháy', value: '−20 °C, rủi ro cháy cao nhất nhóm' },
          { label: 'IPA — bay hơi', value: 'Nhanh vừa, sạch, an toàn với nhiều loại nhựa' },
          { label: 'IPA — điểm chớp cháy', value: '12 °C' },
          { label: 'Xylen — bay hơi', value: 'Chậm, phù hợp bề mặt lớn cần thời gian tác dụng' },
          { label: 'Xylen — điểm chớp cháy', value: '27 °C, nhưng độc tính thần kinh cao hơn' },
        ],
      },
      {
        type: 'heading',
        id: 'chon-theo-loai-ban',
        text: 'Chọn theo loại bẩn',
      },
      {
        type: 'list',
        items: [
          'Dầu mỡ nhẹ và dấu vân tay trước khi dán hoặc sơn: dùng IPA.',
          'Nhựa thông, keo và sơn chưa khô: dùng axeton.',
          'Sơn alkyd hoặc epoxy đã đóng rắn một phần: dùng xylen, chấp nhận thời gian tác dụng lâu hơn.',
          'Bề mặt nhựa kỹ thuật: thử trên mẫu nhỏ trước — axeton hoà tan nhiều loại nhựa.',
        ],
      },
      {
        type: 'callout-safety',
        text: 'Cả ba đều dễ cháy và hơi nặng hơn không khí. Khu vực sử dụng cần thông gió ở tầm thấp, cấm lửa và thiết bị phát tia lửa. Giẻ lau đã thấm dung môi phải đựng trong thùng kim loại có nắp, không vứt vào thùng rác thường.',
      },
    ],
  },
]

export const ARTICLES_BY_SLUG = new Map(ARTICLES.map((article) => [article.slug, article]))

export function articleBySlug(slug: string) {
  return ARTICLES_BY_SLUG.get(slug)
}

/** Danh sách đã sắp xếp: bài nổi bật trước, sau đó theo ngày đăng giảm dần. */
export const ARTICLES_SORTED = [...ARTICLES].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return b.publishedAt.localeCompare(a.publishedAt)
})

export function relatedArticles(article: Article, limit = 3) {
  const sameCategory = ARTICLES_SORTED.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category === article.category,
  )
  const others = ARTICLES_SORTED.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category !== article.category,
  )
  return [...sameCategory, ...others].slice(0, limit)
}
