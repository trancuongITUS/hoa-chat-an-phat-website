import { PRODUCTS } from '@/data/products'
import type { Product, StockStatus } from '@/data/types'
import { PAGE_SIZE, type CatalogFacets, type CatalogFilters } from '@/lib/catalog'

/**
 * Lọc danh mục trên máy chủ. Tệp này import toàn bộ `PRODUCTS`, nên chỉ server component
 * được dùng; client component nhận facet qua props thay vì import trực tiếp.
 */

/** Danh sách quy cách và xuất xứ suy ra từ danh mục thật, không khai báo tay. */
export const CATALOG_FACETS: CatalogFacets = {
  ghs: [...new Set(PRODUCTS.flatMap((p) => p.ghs))].sort(),
  packaging: [...new Set(PRODUCTS.flatMap((p) => p.packaging))].sort((a, b) => a.localeCompare(b, 'vi')),
  origins: [...new Set(PRODUCTS.map((p) => p.origin))].sort((a, b) => a.localeCompare(b, 'vi')),
}

const STOCK_ORDER: Record<StockStatus, number> = { 'con-hang': 0, 'dat-truoc': 1, 'het-hang': 2 }

function matches(product: Product, filters: CatalogFilters) {
  if (filters.industries.length > 0 && !filters.industries.some((slug) => product.industrySlugs.includes(slug))) {
    return false
  }
  if (filters.groups.length > 0 && !filters.groups.includes(product.groupSlug)) return false
  if (filters.ghs.length > 0 && !filters.ghs.some((code) => product.ghs.includes(code))) return false
  if (filters.form && product.form !== filters.form) return false
  if (filters.packaging.length > 0 && !filters.packaging.some((pack) => product.packaging.includes(pack))) {
    return false
  }
  if (filters.origins.length > 0 && !filters.origins.includes(product.origin)) return false
  if (filters.stock !== 'tat-ca' && product.stock !== filters.stock) return false
  return true
}

export interface CatalogResult {
  items: Product[]
  total: number
  page: number
  pageCount: number
}

export function filterProducts(filters: CatalogFilters): CatalogResult {
  const matched = PRODUCTS.filter((product) => matches(product, filters))

  const sorted = [...matched].sort((a, b) => {
    if (filters.sort === 'ten-za') return b.name.localeCompare(a.name, 'vi')
    if (filters.sort === 'con-hang-truoc') {
      const diff = STOCK_ORDER[a.stock] - STOCK_ORDER[b.stock]
      if (diff !== 0) return diff
    }
    return a.name.localeCompare(b.name, 'vi')
  })

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  }
}
