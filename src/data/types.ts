/** Mã phân loại nguy hại GHS — MASTER §2.5. */
export type GhsCode =
  | 'GHS01'
  | 'GHS02'
  | 'GHS03'
  | 'GHS04'
  | 'GHS05'
  | 'GHS06'
  | 'GHS07'
  | 'GHS08'
  | 'GHS09'

/** Dạng tồn tại của hoá chất — bộ lọc radio ở trang danh mục. */
export type PhysicalForm = 'long' | 'ran' | 'khi'

/** Tình trạng kho — luôn hiển thị kèm icon và chữ, không chỉ bằng màu. */
export type StockStatus = 'con-hang' | 'dat-truoc' | 'het-hang'

/** Logo khách hàng cho dải chạy ở trang chủ — home.md §7. */
export interface ClientLogo {
  /** Tên công ty, dùng làm `alt` của logo. */
  name: string
  industry: string
  /** Tệp SVG trong `public/`, khung 240 × 80. */
  src: string
}

export type DocumentKind = 'MSDS' | 'COA' | 'CO' | 'CQ'

export interface ProductDocument {
  kind: DocumentKind
  /** Tên hiển thị đầy đủ, ví dụ "Phiếu an toàn hoá chất (MSDS)". */
  name: string
  /** Đường dẫn tới tệp thật trong `public/`. Dung lượng đọc từ tệp, không khai khống. */
  href: string
  issuedAt: string
}

export interface SpecRow {
  label: string
  value: string
}

export interface Product {
  slug: string
  /** Tên thương mại tiếng Việt. */
  name: string
  /** Tên hoá học / IUPAC. */
  chemicalName: string
  formula: string
  cas: string
  hsCode: string
  groupSlug: string
  industrySlugs: string[]
  ghs: GhsCode[]
  form: PhysicalForm
  packaging: string[]
  origin: string
  stock: StockStatus
  /** Kho đang giữ hàng, ví dụ "Kho Bình Dương". */
  stockLocation: string
  summary: string
  specs: SpecRow[]
  applications: string[]
  /** Hướng dẫn bảo quản và xử lý an toàn — hiển thị trong khối cảnh báo. */
  safety: string[]
  documents: ProductDocument[]
}

export interface Industry {
  slug: string
  name: string
  description: string
  /** Tên icon Lucide, ánh xạ trong `src/components/icon-map.ts`. */
  icon: string
}

export interface ChemicalGroup {
  slug: string
  name: string
}

export type ArticleCategorySlug =
  | 'kien-thuc-hoa-chat'
  | 'ung-dung-theo-nganh'
  | 'an-toan-tuan-thu'
  | 'tin-cong-ty'

export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'list' | 'callout-safety' | 'callout-tech' | 'spec-table' | 'formula'
  /** Nội dung cho paragraph / heading / callout / formula. */
  text?: string
  /** Mục cho list. */
  items?: string[]
  /** Hàng cho spec-table. */
  rows?: SpecRow[]
  /** Neo cho mục lục, chỉ dùng với heading. */
  id?: string
}

export interface Article {
  slug: string
  title: string
  summary: string
  category: ArticleCategorySlug
  publishedAt: string
  updatedAt: string
  readingMinutes: number
  author: { name: string; role: string }
  /** Nguồn tham chiếu cho bài kỹ thuật (TCVN, ASTM, nhà sản xuất). */
  references: string[]
  /** Slug sản phẩm chèn trong khối "sản phẩm liên quan" của bài. */
  relatedProductSlugs: string[]
  featured: boolean
  blocks: ArticleBlock[]
}
