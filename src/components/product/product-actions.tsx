'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { COMPANY } from '@/data/company'
import type { Product } from '@/data/types'

/**
 * Khối hành động của trang chi tiết — products.md §B khối 6.
 *
 * Không có nút thêm vào giỏ và không hiển thị giá. Quy cách đang chọn được mang theo
 * sang form báo giá qua tham số `qc`, nhưng không lưu thành trạng thái ở đâu cả — website
 * không có giỏ hàng.
 *
 * Trên mobile khối này dính ở đáy màn hình; nội dung trang chừa sẵn `pb-[88px]`.
 */
/** Nhận đúng hai trường cần dùng: truyền cả `Product` sẽ serialize toàn bộ thông số và chứng từ xuống client. */
export function ProductActions({ product }: { product: Pick<Product, 'slug' | 'packaging'> }) {
  const [packaging, setPackaging] = useState(product.packaging[0])

  const quoteHref = `/yeu-cau-bao-gia?sp=${product.slug}&qc=${encodeURIComponent(packaging)}`
  const selectId = `quy-cach-${product.slug}`

  return (
    <>
      {/* Bản trong dòng — từ lg trở lên */}
      <div className="hidden flex-col gap-4 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-6 shadow-sm lg:flex">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={selectId} className="text-label text-neutral-700">
            Quy cách đóng gói
          </label>
          <Select id={selectId} value={packaging} onChange={(event) => setPackaging(event.target.value)}>
            {product.packaging.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <Button asChild variant="cta" size="md">
          <Link href={quoteHref}>Yêu cầu báo giá</Link>
        </Button>

        <Button asChild variant="outline" size="md">
          <a href={COMPANY.hotlineHref}>
            <Phone aria-hidden="true" />
            <span className="tabular">Gọi tư vấn {COMPANY.hotlineDisplay}</span>
          </a>
        </Button>

        <p className="text-caption text-neutral-500">
          An Phát báo giá theo lô. Gửi yêu cầu để nhận giá kèm thời gian giao và danh sách chứng từ.
        </p>
      </div>

      {/* Bản dính đáy màn hình — dưới lg */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex h-18 items-center gap-3 border-t border-neutral-200 bg-neutral-0 px-4 shadow-[0_-12px_24px_rgb(15_29_46/0.1)] lg:hidden">
        <Button asChild variant="outline" size="icon" aria-label={`Gọi tư vấn ${COMPANY.hotlineDisplay}`}>
          <a href={COMPANY.hotlineHref}>
            <Phone aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="cta" size="md" className="flex-1">
          <Link href={quoteHref}>Yêu cầu báo giá</Link>
        </Button>
      </div>
    </>
  )
}
