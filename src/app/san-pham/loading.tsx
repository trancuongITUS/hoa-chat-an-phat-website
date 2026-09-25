import { ProductCardSkeleton, Skeleton } from '@/components/ui/states'
import { PAGE_SIZE } from '@/lib/catalog'

/**
 * Trạng thái chờ của trang danh mục — products.md §A.
 * Đúng 9 ô ProductCard, giữ nguyên chiều cao lưới để không gây layout shift. Khung chỉ hiện
 * dần sau `--duration-continuity-delay`, nên trang tải nhanh không làm lưới xám nháy lên.
 */
export default function CatalogLoading() {
  return (
    <div className="continuity-delayed container-site py-8 lg:py-12">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="mt-4 h-11 w-96 max-w-full" />
      <Skeleton className="mt-3 h-16 w-full max-w-3xl" />

      <div className="mt-8 flex gap-8">
        <div className="hidden w-70 shrink-0 flex-col gap-4 lg:flex">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <Skeleton className="h-6 w-48" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
