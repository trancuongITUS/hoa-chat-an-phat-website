import { CHEMICAL_GROUPS, INDUSTRIES } from '@/data/taxonomy'
import { FILTER_KEYS } from '@/lib/catalog'

export interface NavLink {
  href: string
  label: string
  description?: string
  icon?: string
}

export interface NavItem {
  /** Không có `href` nghĩa là mục chỉ mở mega menu, không dẫn tới trang riêng. */
  href?: string
  label: string
  /** Nhóm mục trong mega menu; không có nghĩa là link đơn. */
  columns?: { title: string; links: NavLink[] }[]
  /** Link nhấn mạnh ở cuối mega menu. */
  featured?: NavLink
}

/** Cấu trúc menu chính — MASTER §7.7. */
export const NAV_ITEMS: NavItem[] = [
  {
    href: '/san-pham',
    label: 'Sản phẩm',
    columns: [
      {
        title: 'Theo nhóm hoá chất',
        links: CHEMICAL_GROUPS.map((group) => ({
          href: `/san-pham?${FILTER_KEYS.group}=${group.slug}`,
          label: group.name,
        })),
      },
      {
        title: 'Theo tình trạng kho',
        links: [
          { href: `/san-pham?${FILTER_KEYS.stock}=con-hang`, label: 'Đang còn hàng' },
          { href: `/san-pham?${FILTER_KEYS.stock}=dat-truoc`, label: 'Hàng đặt trước' },
          { href: `/san-pham?${FILTER_KEYS.form}=long`, label: 'Hoá chất dạng lỏng' },
          { href: `/san-pham?${FILTER_KEYS.form}=ran`, label: 'Hoá chất dạng rắn' },
        ],
      },
    ],
    featured: {
      href: '/san-pham',
      label: 'Xem toàn bộ danh mục',
      description: 'Lọc theo ngành, nhóm hoá chất, phân loại nguy hại và quy cách đóng gói.',
    },
  },
  {
    label: 'Ngành ứng dụng',
    columns: [
      {
        title: 'Ngành sản xuất',
        links: INDUSTRIES.slice(0, 3).map((industry) => ({
          href: `/san-pham?${FILTER_KEYS.industry}=${industry.slug}`,
          label: industry.name,
          description: industry.description,
          icon: industry.icon,
        })),
      },
      {
        title: 'Ngành gia công và dịch vụ',
        links: INDUSTRIES.slice(3).map((industry) => ({
          href: `/san-pham?${FILTER_KEYS.industry}=${industry.slug}`,
          label: industry.name,
          description: industry.description,
          icon: industry.icon,
        })),
      },
    ],
  },
  { href: '/gioi-thieu', label: 'Về An Phát' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/lien-he', label: 'Liên hệ' },
]
