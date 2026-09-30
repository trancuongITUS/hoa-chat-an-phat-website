/**
 * DỮ LIỆU MẪU — chưa phải thông tin thật của Hoá chất An Phát.
 *
 * Toàn bộ tên riêng, số điện thoại, địa chỉ, số hiệu giấy tờ và số liệu năng lực trong
 * tệp này là chỗ dành sẵn, cố tình để dạng dễ nhận ra (`0000 000 000`, `example.com`,
 * `Số 00`). Khi có thông tin thật, thay trực tiếp tại đây — đây là nguồn duy nhất của
 * mọi thông tin công ty trên toàn site.
 */

import { SITE_IMAGES } from '@/data/images'
import type { ClientLogo } from '@/data/types'

export const IS_SAMPLE_CONTENT = true

export const COMPANY = {
  name: 'Công ty TNHH Hoá chất An Phát',
  shortName: 'An Phát',
  tagline: 'Cung ứng hoá chất công nghiệp cho sản xuất, xử lý nước và dệt nhuộm',
  /** Hiển thị cho người đọc. */
  hotlineDisplay: '0000 000 000',
  /** Dùng cho thuộc tính href của link `tel:`. */
  hotlineHref: 'tel:0000000000',
  email: 'kinhdoanh@example.com',
  taxCode: '0000000000',
  /** Cam kết thời gian phản hồi hiển thị ở form báo giá và khối CTA. */
  responseTime: '4 giờ làm việc',
  workingHours: 'Thứ Hai – Thứ Bảy, 08:00 – 17:00',
  foundedYear: 2009,
  address: 'Số 00, Đường Số 00, Khu công nghiệp, Tỉnh Bình Dương',
} as const

/** Dải tin cậy trang chủ — 4 số liệu, hiển thị bằng chữ số tabular (home.md §2). */
export const TRUST_STATS = [
  { value: 16, suffix: '', label: 'năm cung ứng hoá chất công nghiệp' },
  { value: 240, suffix: '+', label: 'mã hàng trong danh mục thường trực' },
  { value: 350, suffix: '+', label: 'khách hàng doanh nghiệp đang hoạt động' },
  { value: 24, suffix: ' giờ', label: 'thời gian giao trung bình trong bán kính 100 km' },
]

/** Năng lực cung ứng — 3 khối ở trang chủ (home.md §5). */
export const CAPABILITIES = [
  {
    title: 'Kho bãi và bồn chứa',
    icon: 'warehouse',
    description:
      'Ba kho tại Bình Dương, Long An và Hải Phòng với khu lưu trữ hoá chất nguy hại tách riêng, hệ bồn chứa axit và dung môi có đê bao chống tràn.',
    points: ['Tổng diện tích 8.400 m²', 'Khu nguy hại có thông gió cưỡng bức', 'Bồn chứa 12 × 30 m³'],
    imageLabel: 'Ảnh kho chứa và hệ bồn của An Phát',
    image: SITE_IMAGES.capabilityWarehouse,
  },
  {
    title: 'Đội xe có giấy phép hàng nguy hiểm',
    icon: 'truck',
    description:
      'Xe bồn và xe tải được cấp phép vận chuyển hàng nguy hiểm, tài xế có chứng chỉ ADR và được tập huấn xử lý sự cố tràn đổ định kỳ.',
    points: ['9 xe bồn 8–16 m³', '12 xe tải 1,5–8 tấn', 'Giám sát hành trình toàn đội'],
    imageLabel: 'Ảnh xe bồn chở hoá chất của An Phát',
    image: SITE_IMAGES.capabilityTankerTruck,
  },
  {
    title: 'Kiểm định từng lô hàng',
    icon: 'flask-conical',
    description:
      'Mỗi lô nhập được lấy mẫu và kiểm nồng độ, tỉ trọng, tạp chất trước khi nhập kho. Phiếu COA đi kèm từng lô xuất bán.',
    points: ['Lấy mẫu theo TCVN 2090', 'COA theo từng số lô', 'Lưu mẫu đối chứng 6 tháng'],
    imageLabel: 'Ảnh khu lấy mẫu và kiểm định lô hàng',
    image: SITE_IMAGES.capabilityQualityControl,
  },
]

export interface Certificate {
  slug: string
  name: string
  issuer: string
  serial: string
  validity: string
  /** Mô tả bản scan dùng cho `alt` và nhãn ảnh chỗ dành sẵn. */
  scanLabel: string
}

/** home.md §6 và about.md §4 — khối quan trọng nhất về độ tin cậy. */
export const CERTIFICATES: Certificate[] = [
  {
    slug: 'giay-phep-kinh-doanh-hoa-chat',
    name: 'Giấy phép kinh doanh hoá chất',
    issuer: 'Sở Công Thương tỉnh Bình Dương',
    serial: '00/GP-SCT',
    validity: 'Còn hiệu lực đến 31/12/2028',
    scanLabel: 'Bản scan giấy phép kinh doanh hoá chất',
  },
  {
    slug: 'iso-9001',
    name: 'Chứng nhận ISO 9001:2015',
    issuer: 'Tổ chức chứng nhận độc lập',
    serial: 'VN-00-0000',
    validity: 'Còn hiệu lực đến 30/06/2027',
    scanLabel: 'Bản scan chứng nhận ISO 9001:2015',
  },
  {
    slug: 'giay-chung-nhan-du-dieu-kien-pccc',
    name: 'Giấy chứng nhận đủ điều kiện phòng cháy chữa cháy',
    issuer: 'Công an tỉnh Bình Dương',
    serial: '00/CN-PCCC',
    validity: 'Còn hiệu lực đến 15/03/2029',
    scanLabel: 'Bản scan giấy chứng nhận đủ điều kiện PCCC',
  },
  {
    slug: 'giay-phep-van-chuyen-hang-nguy-hiem',
    name: 'Giấy phép vận chuyển hàng nguy hiểm',
    issuer: 'Cục Đường bộ Việt Nam',
    serial: '00/GPVC-HNH',
    validity: 'Còn hiệu lực đến 30/09/2027',
    scanLabel: 'Bản scan giấy phép vận chuyển hàng nguy hiểm',
  },
  {
    slug: 'phieu-kiem-nghiem-mau',
    name: 'Phiếu kiểm nghiệm mẫu định kỳ',
    issuer: 'Trung tâm kiểm nghiệm được chỉ định',
    serial: 'KN-0000/2026',
    validity: 'Kỳ kiểm gần nhất: quý II/2026',
    scanLabel: 'Bản scan phiếu kiểm nghiệm mẫu định kỳ',
  },
  {
    slug: 'chung-nhan-atld',
    name: 'Chứng nhận huấn luyện an toàn lao động',
    issuer: 'Đơn vị huấn luyện được cấp phép',
    serial: 'ATLĐ-0000',
    validity: 'Kỳ huấn luyện gần nhất: tháng 03/2026',
    scanLabel: 'Bản scan chứng nhận huấn luyện an toàn lao động',
  },
]

/** about.md §3 — mốc phát triển, năm hiển thị bằng chữ số tabular. */
export const TIMELINE = [
  {
    year: 2009,
    title: 'Thành lập',
    description: 'Bắt đầu với kho thuê 400 m² tại Bình Dương, phân phối axit và xút cho xưởng dệt.',
  },
  {
    year: 2013,
    title: 'Mở rộng nhóm hàng xử lý nước',
    description: 'Bổ sung PAC, phèn nhôm và polymer trợ lắng cho các trạm xử lý nước thải khu công nghiệp.',
  },
  {
    year: 2017,
    title: 'Kho Long An và đội xe bồn',
    description: 'Đưa vào vận hành kho thứ hai và ba xe bồn đầu tiên có giấy phép vận chuyển hàng nguy hiểm.',
  },
  {
    year: 2021,
    title: 'Đạt ISO 9001:2015',
    description: 'Chuẩn hoá quy trình nhập, lưu kho, lấy mẫu và truy xuất theo số lô.',
  },
  {
    year: 2024,
    title: 'Kho Hải Phòng',
    description: 'Mở kho miền Bắc, rút thời gian giao hàng cho khách khu vực phía Bắc xuống dưới 24 giờ.',
  },
]

export interface Warehouse {
  name: string
  address: string
  area: string
  storageTypes: string
  deliveryRadius: string
  phoneDisplay: string
  phoneHref: string
  receivingHours: string
  mapQuery: string
}

/** about.md §5 và quote-contact.md §B2. */
export const WAREHOUSES: Warehouse[] = [
  {
    name: 'Văn phòng và kho chính — Bình Dương',
    address: 'Số 00, Đường Số 00, Khu công nghiệp, Tỉnh Bình Dương',
    area: '4.200 m²',
    storageTypes: 'Bồn chứa axit, kệ hàng bao, khu hoá chất nguy hại riêng',
    deliveryRadius: '150 km',
    phoneDisplay: '0000 000 001',
    phoneHref: 'tel:0000000001',
    receivingHours: '07:30 – 16:30 (Thứ Hai – Thứ Bảy)',
    mapQuery: 'Khu cong nghiep Binh Duong',
  },
  {
    name: 'Kho Long An',
    address: 'Số 00, Đường Số 00, Khu công nghiệp, Tỉnh Long An',
    area: '2.400 m²',
    storageTypes: 'Kệ hàng bao, khu dung môi có thông gió cưỡng bức',
    deliveryRadius: '120 km',
    phoneDisplay: '0000 000 002',
    phoneHref: 'tel:0000000002',
    receivingHours: '08:00 – 16:00 (Thứ Hai – Thứ Sáu)',
    mapQuery: 'Khu cong nghiep Long An',
  },
  {
    name: 'Kho Hải Phòng',
    address: 'Số 00, Đường Số 00, Khu công nghiệp, Thành phố Hải Phòng',
    area: '1.800 m²',
    storageTypes: 'Kệ hàng bao, bồn chứa dung môi',
    deliveryRadius: '180 km',
    phoneDisplay: '0000 000 003',
    phoneHref: 'tel:0000000003',
    receivingHours: '08:00 – 17:00 (Thứ Hai – Thứ Bảy)',
    mapQuery: 'Khu cong nghiep Hai Phong',
  },
]

/** about.md §7 — cam kết an toàn và tuân thủ. */
export const COMPLIANCE = [
  {
    title: 'Vận chuyển hàng nguy hiểm',
    icon: 'truck',
    description:
      'Xe được cấp phép và dán nhãn đúng phân loại UN. Tài xế mang theo phiếu an toàn hoá chất của lô đang chở và bộ ứng cứu tràn đổ.',
  },
  {
    title: 'Lưu trữ tách nhóm',
    icon: 'shield-check',
    description:
      'Axit, kiềm, chất oxy hoá và dung môi dễ cháy lưu ở khu riêng, có đê bao, hệ thu hồi nước rửa và bảng chỉ dẫn phân loại tại mỗi khu.',
  },
  {
    title: 'Xử lý sự cố tràn đổ',
    icon: 'alert-triangle',
    description:
      'Mỗi kho có quy trình ứng phó dán tại chỗ, vật liệu hấp thụ và trang bị bảo hộ đặt tại cửa khu nguy hại. Diễn tập định kỳ hai lần mỗi năm.',
  },
  {
    title: 'Tập huấn nhân viên',
    icon: 'graduation-cap',
    description:
      'Nhân viên kho và giao nhận được huấn luyện an toàn hoá chất hằng năm, có chứng nhận lưu hồ sơ và kiểm tra lại trước khi đổi vị trí công việc.',
  },
]

/**
 * home.md §7 — dải logo khách hàng. Tên và logo đều là mẫu hư cấu, vẽ riêng cho bản demo
 * (`public/images/clients/`). Trước khi chạy thật phải thay bằng logo khách hàng đã có văn
 * bản đồng ý sử dụng thương hiệu.
 */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Vikatex – Vĩnh Khang Textile', industry: 'Dệt nhuộm', src: '/images/clients/vikatex.svg' },
  { name: 'Aquaren Water Solutions', industry: 'Xử lý nước', src: '/images/clients/aquaren.svg' },
  { name: 'Hương Đồng Foods', industry: 'Thực phẩm', src: '/images/clients/huong-dong.svg' },
  { name: 'Kim Phong Plating', industry: 'Xi mạ', src: '/images/clients/kim-phong.svg' },
  { name: 'Phước An Rubber', industry: 'Cao su nhựa', src: '/images/clients/phuoc-an.svg' },
  { name: 'Sao Mai Industrial Cleaning', industry: 'Vệ sinh công nghiệp', src: '/images/clients/sao-mai.svg' },
  { name: 'Lam Giang Dyeing', industry: 'Dệt nhuộm', src: '/images/clients/lam-giang.svg' },
  { name: 'NXE – Nước Xanh Envirotech', industry: 'Xử lý nước', src: '/images/clients/nxe.svg' },
  { name: 'Dalo – Đại Lộc Food', industry: 'Thực phẩm', src: '/images/clients/dalo.svg' },
  { name: 'Tân Long Galvanizing', industry: 'Xi mạ', src: '/images/clients/tan-long.svg' },
  { name: 'Polytan Plastic Packaging', industry: 'Cao su nhựa', src: '/images/clients/polytan.svg' },
  { name: 'Sạch Việt Industrial Care', industry: 'Vệ sinh công nghiệp', src: '/images/clients/sach-viet.svg' },
  { name: 'Sông Trà Beverage', industry: 'Thực phẩm', src: '/images/clients/song-tra.svg' },
  { name: 'Vitilatex – Vĩnh Tiến Latex', industry: 'Cao su nhựa', src: '/images/clients/vitilatex.svg' },
]

/** Chủ đề của form liên hệ ngắn (quote-contact.md §B4). */
export const CONTACT_TOPICS = [
  'Tư vấn chọn hoá chất',
  'Hỏi về đơn hàng đang giao',
  'Chứng từ và hoá đơn',
  'Khiếu nại chất lượng',
  'Hợp tác cung ứng',
  'Nội dung khác',
]
