import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { CatalogResults, CatalogTransitionProvider } from '@/components/catalog/catalog-transition'
import { ActiveFilterChips, MobileCatalogToolbar, SortSelect } from '@/components/catalog/catalog-controls'
import { FilterPanel } from '@/components/catalog/filter-panel'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/states'
import { buildQuery, parseFilters, type CatalogFilters } from '@/lib/catalog'
import { CATALOG_FACETS, filterProducts } from '@/lib/catalog-search'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Danh mục hoá chất công nghiệp',
  description:
    'Lọc hoá chất theo ngành ứng dụng, nhóm hoá chất, phân loại nguy hại GHS, quy cách đóng gói và tình trạng kho. Báo giá theo lô qua liên hệ trực tiếp.',
}

/**
 * Trang danh mục — `pages/products.md` §A.
 *
 * Lọc chạy phía máy chủ từ query string: trạng thái lọc nằm hết trong URL nên chia sẻ,
 * deep link và nút Back của trình duyệt đều hoạt động đúng, đồng thời toàn bộ dữ liệu
 * sản phẩm không phải gửi xuống trình duyệt.
 */
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters = parseFilters(params)
  const result = filterProducts(filters)

  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Danh mục sản phẩm' }]} />

      <div className="mt-4 max-w-3xl">
        <h1 className="text-h1 text-neutral-900">Danh mục hoá chất công nghiệp</h1>
        <p className="text-body-lg mt-3 text-neutral-500">
          Mỗi mã hàng đi kèm bảng thông số, phân loại nguy hại GHS và bộ chứng từ MSDS, COA, CO/CQ.
          Website không công khai giá — An Phát báo giá theo lô qua liên hệ trực tiếp.
        </p>
      </div>

      <CatalogTransitionProvider>
        <div className="mt-8 flex gap-8">
          <aside className="hidden w-70 shrink-0 lg:block">
            <div className="sticky top-22 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
              <h2 className="text-h5 mb-4 text-neutral-900">Bộ lọc</h2>
              <FilterPanel filters={filters} facets={CATALOG_FACETS} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p aria-live="polite" className="text-body-sm text-neutral-700">
                  Tìm thấy{' '}
                  {/* Đổi key khi con số đổi để số mới hiện dần — nối thao tác lọc với kết quả */}
                  <span
                    key={result.total}
                    className="tabular font-semibold animate-in fade-in-0 duration-[var(--duration-base)] ease-[var(--ease-out)]"
                  >
                    {result.total}
                  </span>{' '}
                  hoá chất
                  {result.pageCount > 1 ? (
                    <>
                      {' '}
                      · Trang <span className="tabular">{result.page}</span>/
                      <span className="tabular">{result.pageCount}</span>
                    </>
                  ) : null}
                </p>
                <SortSelect filters={filters} className="hidden w-56 lg:block" />
              </div>

              <ActiveFilterChips filters={filters} />
            </div>

            <CatalogResults>
              {result.items.length > 0 ? (
                <>
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {result.items.map((product) => (
                      <li key={product.slug} className="flex">
                        <ProductCard product={product} animated={false} className="w-full" />
                      </li>
                    ))}
                  </ul>
                  <Pagination filters={filters} page={result.page} pageCount={result.pageCount} />
                </>
              ) : (
                <EmptyState
                  className="mt-6"
                  title="Không tìm thấy hoá chất phù hợp với bộ lọc hiện tại"
                  description="Thử bỏ bớt một vài điều kiện lọc, hoặc để bộ phận kỹ thuật tư vấn hoá chất thay thế phù hợp với quy trình của bạn."
                  actions={
                    <>
                      <Button asChild variant="outline" size="md">
                        <Link href="/san-pham">Xoá bộ lọc</Link>
                      </Button>
                      <Button asChild variant="cta" size="md">
                        <Link href="/lien-he">Nhờ tư vấn tìm sản phẩm</Link>
                      </Button>
                    </>
                  }
                />
              )}
            </CatalogResults>

            <MobileCatalogToolbar filters={filters} facets={CATALOG_FACETS} />
          </div>
        </div>
      </CatalogTransitionProvider>
    </div>
  )
}

/**
 * Phân trang bằng link thật thay vì infinite scroll — người mua cần quay lại đúng vị trí
 * đã xem (products.md §A).
 */
function Pagination({ filters, page, pageCount }: { filters: CatalogFilters; page: number; pageCount: number }) {
  if (pageCount <= 1) return null

  const hrefFor = (target: number) => {
    const query = buildQuery({ ...filters, page: target })
    return query ? `/san-pham?${query}` : '/san-pham'
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav aria-label="Phân trang danh mục" className="mt-10 flex items-center justify-center gap-2">
      <PaginationLink href={hrefFor(page - 1)} disabled={page === 1} label="Trang trước">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </PaginationLink>

      {pages.map((target) => (
        <Link
          key={target}
          href={hrefFor(target)}
          aria-current={target === page ? 'page' : undefined}
          className={cn(
            'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-label tabular',
            'transition-colors duration-[var(--duration-fast)]',
            target === page
              ? 'bg-primary-600 text-neutral-0'
              : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100',
          )}
        >
          {target}
          <span className="sr-only"> — trang {target}</span>
        </Link>
      ))}

      <PaginationLink href={hrefFor(page + 1)} disabled={page === pageCount} label="Trang sau">
        <ChevronRight className="size-5" aria-hidden="true" />
      </PaginationLink>
    </nav>
  )
}

function PaginationLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  const classes =
    'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-neutral-200 text-neutral-700 transition-colors duration-[var(--duration-fast)]'

  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(classes, 'cursor-not-allowed opacity-50')} title={`${label} — không khả dụng`}>
        {children}
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  return (
    <Link href={href} className={cn(classes, 'hover:bg-neutral-100')}>
      {children}
      <span className="sr-only">{label}</span>
    </Link>
  )
}
