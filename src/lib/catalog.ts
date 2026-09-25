import type { GhsCode, PhysicalForm, StockStatus } from '@/data/types'

/**
 * Hợp đồng URL của bộ lọc danh mục. Header, sidebar lọc và các client component khác đều
 * import tệp này, nên nó không được import dữ liệu sản phẩm: làm vậy sẽ đóng gói toàn bộ
 * danh mục vào JavaScript của mọi trang. Phần cần dữ liệu nằm ở `catalog-search.ts`.
 */

/** Tên tham số URL — dùng chung giữa sidebar lọc và trang danh mục. */
export const FILTER_KEYS = {
  industry: 'nganh',
  group: 'nhom',
  ghs: 'ghs',
  form: 'dang',
  packaging: 'quycach',
  origin: 'xuatxu',
  stock: 'kho',
  sort: 'sapxep',
  page: 'trang',
} as const

export const PAGE_SIZE = 9

export type SortKey = 'ten-az' | 'ten-za' | 'con-hang-truoc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'ten-az', label: 'Tên A → Z' },
  { value: 'ten-za', label: 'Tên Z → A' },
  { value: 'con-hang-truoc', label: 'Còn hàng trước' },
]

export interface CatalogFilters {
  industries: string[]
  groups: string[]
  ghs: GhsCode[]
  form: PhysicalForm | null
  packaging: string[]
  origins: string[]
  stock: StockStatus | 'tat-ca'
  sort: SortKey
  page: number
}

export const EMPTY_FILTERS: CatalogFilters = {
  industries: [],
  groups: [],
  ghs: [],
  form: null,
  packaging: [],
  origins: [],
  stock: 'tat-ca',
  sort: 'ten-az',
  page: 1,
}

/** Giá trị cho từng nhóm lọc, suy ra từ danh mục thật ở `catalog-search.ts`. */
export interface CatalogFacets {
  ghs: GhsCode[]
  packaging: string[]
  origins: string[]
}

type RawSearchParams = Record<string, string | string[] | undefined>

function readList(params: RawSearchParams, key: string): string[] {
  const raw = params[key]
  if (!raw) return []
  const values = Array.isArray(raw) ? raw : [raw]
  return values.flatMap((value) => value.split(',')).filter(Boolean)
}

function readOne(params: RawSearchParams, key: string): string | null {
  const raw = params[key]
  if (!raw) return null
  return Array.isArray(raw) ? (raw[0] ?? null) : raw
}

const STOCK_VALUES: (StockStatus | 'tat-ca')[] = ['con-hang', 'dat-truoc', 'het-hang', 'tat-ca']
const FORM_VALUES: PhysicalForm[] = ['long', 'ran', 'khi']
const SORT_VALUES: SortKey[] = ['ten-az', 'ten-za', 'con-hang-truoc']

/** Đọc bộ lọc từ query string; giá trị lạ bị bỏ qua thay vì làm hỏng trang. */
export function parseFilters(params: RawSearchParams): CatalogFilters {
  const form = readOne(params, FILTER_KEYS.form) as PhysicalForm | null
  const stock = readOne(params, FILTER_KEYS.stock) as StockStatus | 'tat-ca' | null
  const sort = readOne(params, FILTER_KEYS.sort) as SortKey | null
  const page = Number.parseInt(readOne(params, FILTER_KEYS.page) ?? '1', 10)

  return {
    industries: readList(params, FILTER_KEYS.industry),
    groups: readList(params, FILTER_KEYS.group),
    ghs: readList(params, FILTER_KEYS.ghs) as GhsCode[],
    form: form && FORM_VALUES.includes(form) ? form : null,
    packaging: readList(params, FILTER_KEYS.packaging),
    origins: readList(params, FILTER_KEYS.origin),
    stock: stock && STOCK_VALUES.includes(stock) ? stock : 'tat-ca',
    sort: sort && SORT_VALUES.includes(sort) ? sort : 'ten-az',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

/** Dựng lại query string từ bộ lọc — bỏ hẳn tham số đang ở giá trị mặc định. */
export function buildQuery(filters: CatalogFilters): string {
  const params = new URLSearchParams()
  const setList = (key: string, values: string[]) => {
    if (values.length > 0) params.set(key, values.join(','))
  }

  setList(FILTER_KEYS.industry, filters.industries)
  setList(FILTER_KEYS.group, filters.groups)
  setList(FILTER_KEYS.ghs, filters.ghs)
  setList(FILTER_KEYS.packaging, filters.packaging)
  setList(FILTER_KEYS.origin, filters.origins)
  if (filters.form) params.set(FILTER_KEYS.form, filters.form)
  if (filters.stock !== 'tat-ca') params.set(FILTER_KEYS.stock, filters.stock)
  if (filters.sort !== 'ten-az') params.set(FILTER_KEYS.sort, filters.sort)
  if (filters.page > 1) params.set(FILTER_KEYS.page, String(filters.page))

  return params.toString()
}

export function countActiveFilters(filters: CatalogFilters) {
  return (
    filters.industries.length +
    filters.groups.length +
    filters.ghs.length +
    filters.packaging.length +
    filters.origins.length +
    (filters.form ? 1 : 0) +
    (filters.stock !== 'tat-ca' ? 1 : 0)
  )
}
