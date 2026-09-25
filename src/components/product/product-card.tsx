import Link from 'next/link'

import { ContentImage } from '@/components/content-image'
import { HazardChipRow } from '@/components/product/hazard-chip'
import { StockBadge } from '@/components/product/stock-badge'
import { Button } from '@/components/ui/button'
import { PRODUCT_IMAGES } from '@/data/images'
import type { Product } from '@/data/types'
import { cn, staggerStyle } from '@/lib/utils'

/**
 * ProductCard — MASTER §7.4.
 *
 * Thẻ không hiển thị giá và không có hành động thêm vào giỏ. Nút "Yêu cầu báo giá" điều
 * hướng thẳng tới form kèm tham số sản phẩm, không tích luỹ trạng thái.
 *
 * Toàn bộ thẻ cố tình **không** phải một thẻ `<a>`: chỉ tên sản phẩm và các nút là vùng
 * chạm, để nút báo giá không bị link ngoài nuốt sự kiện.
 */
export function ProductCard({
  product,
  /** Thứ tự trong lưới — dùng cho stagger (MASTER §5). */
  index = 0,
  /**
   * Độ nhấn của nút báo giá.
   *
   * `cta` là mặc định theo MASTER §7.4 và dùng ở trang danh mục — trang làm việc nơi báo
   * giá là hành động chính. `outline` dùng ở trang chủ, nơi `home.md` giới hạn mỗi khung
   * nhìn chỉ một nút `cta`; ở đó nút `cta` duy nhất thuộc về hero và khối CTA cuối trang.
   */
  quoteEmphasis = 'cta',
  /**
   * Chạy hiệu ứng vào theo stagger. Tắt ở trang danh mục: lưới ở đó dựng lại sau mỗi lần
   * lọc và chuyển trang, người mua thấy nó hàng chục lần trong một phiên.
   */
  animated = true,
  className,
}: {
  product: Product
  index?: number
  quoteEmphasis?: 'cta' | 'outline'
  animated?: boolean
  className?: string
}) {
  return (
    <article
      style={animated ? staggerStyle(index) : undefined}
      className={cn(
        animated && 'animate-rise-in',
        'flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card shadow-sm',
        'transition-[box-shadow,translate] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <ContentImage
        image={PRODUCT_IMAGES[product.slug]}
        label={`Ảnh ${product.name}, quy cách ${product.packaging[0]}`}
        ratio="4 / 3"
        sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
      />

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-h4">
            <Link
              href={`/san-pham/${product.slug}`}
              className="rounded-[var(--radius-sm)] text-foreground transition-colors duration-[var(--duration-fast)] hover:text-primary-700"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-body-sm text-neutral-500">
            {product.chemicalName} · <span className="tabular">Số CAS {product.cas}</span>
          </p>
        </div>

        <HazardChipRow codes={product.ghs} />

        <p className="text-caption text-neutral-500">
          Xuất xứ {product.origin} · <span className="tabular">{product.packaging.join(' · ')}</span>
        </p>

        <StockBadge status={product.stock} location={product.stockLocation} className="self-start" />

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
          <Button asChild variant="outline" size="sm" className="w-full sm:flex-1">
            <Link href={`/san-pham/${product.slug}`}>
              Xem chi tiết
              <span className="sr-only"> {product.name}</span>
            </Link>
          </Button>
          <Button asChild variant={quoteEmphasis} size="sm" className="w-full sm:flex-1">
            <Link href={`/yeu-cau-bao-gia?sp=${product.slug}`}>
              Yêu cầu báo giá
              <span className="sr-only"> cho {product.name}</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
