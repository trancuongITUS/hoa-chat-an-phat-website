import type { ChemicalGroup, GhsCode, Industry, PhysicalForm, StockStatus } from './types'

/** MASTER §2.5 — mỗi phân loại GHS gắn cặp màu riêng và tên tiếng Việt. */
export const GHS_CLASSES: Record<
  GhsCode,
  { name: string; description: string; bg: string; fg: string }
> = {
  GHS01: {
    name: 'Chất nổ',
    description: 'GHS01 — Chất nổ không bền, có thể nổ khi va đập, ma sát hoặc gia nhiệt',
    bg: 'bg-ghs01-bg',
    fg: 'text-ghs01-fg',
  },
  GHS02: {
    name: 'Dễ cháy',
    description: 'GHS02 — Chất lỏng, khí hoặc chất rắn dễ bắt cháy',
    bg: 'bg-ghs02-bg',
    fg: 'text-ghs02-fg',
  },
  GHS03: {
    name: 'Oxy hoá',
    description: 'GHS03 — Chất oxy hoá, có thể gây cháy hoặc làm đám cháy mạnh thêm',
    bg: 'bg-ghs03-bg',
    fg: 'text-ghs03-fg',
  },
  GHS04: {
    name: 'Khí nén',
    description: 'GHS04 — Khí chứa dưới áp suất, có thể nổ khi bị gia nhiệt',
    bg: 'bg-ghs04-bg',
    fg: 'text-ghs04-fg',
  },
  GHS05: {
    name: 'Ăn mòn',
    description: 'GHS05 — Gây bỏng da, tổn thương mắt nghiêm trọng, ăn mòn kim loại',
    bg: 'bg-ghs05-bg',
    fg: 'text-ghs05-fg',
  },
  GHS06: {
    name: 'Độc cấp tính',
    description: 'GHS06 — Độc cấp tính, có thể gây tử vong khi nuốt, hít hoặc tiếp xúc da',
    bg: 'bg-ghs06-bg',
    fg: 'text-ghs06-fg',
  },
  GHS07: {
    name: 'Kích ứng / Có hại',
    description: 'GHS07 — Gây kích ứng da, mắt, đường hô hấp hoặc có hại khi nuốt',
    bg: 'bg-ghs07-bg',
    fg: 'text-ghs07-fg',
  },
  GHS08: {
    name: 'Nguy hại sức khoẻ',
    description: 'GHS08 — Nguy hại sức khoẻ lâu dài: gây ung thư, đột biến, độc cơ quan đích',
    bg: 'bg-ghs08-bg',
    fg: 'text-ghs08-fg',
  },
  GHS09: {
    name: 'Nguy hại môi trường',
    description: 'GHS09 — Rất độc với sinh vật thuỷ sinh, gây ảnh hưởng lâu dài',
    bg: 'bg-ghs09-bg',
    fg: 'text-ghs09-fg',
  },
}

export const GHS_ORDER: GhsCode[] = [
  'GHS01',
  'GHS02',
  'GHS03',
  'GHS04',
  'GHS05',
  'GHS06',
  'GHS07',
  'GHS08',
  'GHS09',
]

export const INDUSTRIES: Industry[] = [
  {
    slug: 'xu-ly-nuoc',
    name: 'Xử lý nước',
    description: 'Keo tụ, khử trùng, điều chỉnh pH cho nước cấp và nước thải công nghiệp.',
    icon: 'droplets',
  },
  {
    slug: 'det-nhuom',
    name: 'Dệt nhuộm',
    description: 'Tẩy trắng, cầm màu, xử lý nước thải nhuộm và trung hoà sau nhuộm.',
    icon: 'shirt',
  },
  {
    slug: 'thuc-pham',
    name: 'Thực phẩm',
    description: 'Hoá chất đạt tiêu chuẩn thực phẩm cho chế biến, vệ sinh CIP và xử lý nước.',
    icon: 'wheat',
  },
  {
    slug: 'ma-xi-ma',
    name: 'Mạ và xi mạ',
    description: 'Tẩy dầu, tẩy gỉ, dung dịch mạ kẽm, mạ niken và xử lý bề mặt kim loại.',
    icon: 'layers',
  },
  {
    slug: 'cao-su-nhua',
    name: 'Cao su nhựa',
    description: 'Phụ gia, dung môi và chất trợ gia công cho ép phun, đùn và lưu hoá.',
    icon: 'boxes',
  },
  {
    slug: 've-sinh-cong-nghiep',
    name: 'Vệ sinh công nghiệp',
    description: 'Chất tẩy rửa, khử trùng nhà xưởng, thiết bị và hệ thống đường ống.',
    icon: 'spray-can',
  },
]

export const CHEMICAL_GROUPS: ChemicalGroup[] = [
  { slug: 'axit', name: 'Axit' },
  { slug: 'bazo', name: 'Bazơ và kiềm' },
  { slug: 'dung-moi', name: 'Dung môi' },
  { slug: 'muoi', name: 'Muối vô cơ' },
  { slug: 'chat-oxy-hoa', name: 'Chất oxy hoá và khử trùng' },
  { slug: 'phu-gia', name: 'Phụ gia và trợ xử lý' },
]

export const PHYSICAL_FORMS: { value: PhysicalForm; label: string }[] = [
  { value: 'long', label: 'Lỏng' },
  { value: 'ran', label: 'Rắn' },
  { value: 'khi', label: 'Khí' },
]

/** Tình trạng kho: màu đi kèm icon Lucide và nhãn chữ (MASTER §2.4, §10). */
export const STOCK_STATUS: Record<
  StockStatus,
  { label: string; icon: string; bg: string; fg: string }
> = {
  'con-hang': {
    label: 'Còn hàng',
    icon: 'check-circle-2',
    bg: 'bg-success-bg',
    fg: 'text-success',
  },
  'dat-truoc': {
    label: 'Đặt trước',
    icon: 'alert-triangle',
    bg: 'bg-warning-bg',
    fg: 'text-warning',
  },
  'het-hang': {
    label: 'Tạm hết hàng',
    icon: 'alert-octagon',
    bg: 'bg-danger-bg',
    fg: 'text-danger',
  },
}

/* Quy cách đóng gói và xuất xứ suy ra từ danh mục thật — xem `src/lib/catalog.ts`. */

export const ARTICLE_CATEGORIES = [
  { slug: 'kien-thuc-hoa-chat', name: 'Kiến thức hoá chất' },
  { slug: 'ung-dung-theo-nganh', name: 'Ứng dụng theo ngành' },
  { slug: 'an-toan-tuan-thu', name: 'An toàn & Tuân thủ' },
  { slug: 'tin-cong-ty', name: 'Tin công ty' },
] as const

export function industryBySlug(slug: string) {
  return INDUSTRIES.find((industry) => industry.slug === slug)
}

export function groupBySlug(slug: string) {
  return CHEMICAL_GROUPS.find((group) => group.slug === slug)
}
