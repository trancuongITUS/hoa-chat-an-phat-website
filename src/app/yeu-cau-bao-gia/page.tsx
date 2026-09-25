import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Phone, ShieldCheck } from 'lucide-react'

import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { QuoteForm, type QuoteProductOption } from '@/components/quote/quote-form'
import { Skeleton } from '@/components/ui/states'
import { COMPANY } from '@/data/company'
import { PRODUCTS } from '@/data/products'

export const metadata: Metadata = {
  title: 'Yêu cầu báo giá',
  description:
    'Gửi danh sách hoá chất cần mua kèm quy cách và số lượng. An Phát báo giá theo lô, phản hồi trong 4 giờ làm việc.',
}

/** Chỉ gửi xuống trình duyệt những trường form dùng, không phải toàn bộ bản ghi sản phẩm. */
const PRODUCT_OPTIONS: QuoteProductOption[] = PRODUCTS.map(({ slug, name, chemicalName, cas, packaging }) => ({
  slug,
  name,
  chemicalName,
  cas,
  packaging,
}))

/**
 * Trang yêu cầu báo giá — `pages/quote-contact.md` §A.
 *
 * Đây là đích đến duy nhất của mọi nút "Yêu cầu báo giá" trên toàn site.
 * Desktop: form 7/12 bên trái, khối trợ lực dính 4/12 bên phải.
 */
export default function QuotePage() {
  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu cầu báo giá' }]} />

      <div className="mt-4 measure">
        <h1 className="text-h1 text-neutral-900">Yêu cầu báo giá</h1>
        <p className="text-body-lg mt-3 text-neutral-500">
          Điền danh sách hoá chất cần mua kèm quy cách và số lượng. An Phát báo giá theo lô, kèm thời
          gian giao và danh sách chứng từ đi theo hàng.
        </p>
      </div>

      {/* Mobile: thẻ hotline rút gọn đặt ngay dưới tiêu đề */}
      <a
        href={COMPANY.hotlineHref}
        className="mt-6 flex items-center gap-3 rounded-[var(--radius-lg)] border border-cta-600 bg-cta-50 p-4 lg:hidden"
      >
        <Phone className="size-5 shrink-0 text-cta-700" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="text-label text-cta-700 tabular">Gọi {COMPANY.hotlineDisplay}</span>
          <span className="text-caption text-neutral-700">{COMPANY.workingHours}</span>
        </span>
      </a>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<QuoteFormSkeleton />}>
            <QuoteForm products={PRODUCT_OPTIONS} />
          </Suspense>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-22 flex flex-col gap-4">
            <a
              href={COMPANY.hotlineHref}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-cta-600 bg-cta-50 p-4 transition-colors duration-[var(--duration-fast)] hover:bg-cta-50/70"
            >
              <Phone className="size-5 shrink-0 text-cta-700" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-caption text-neutral-700">Cần gấp? Gọi trực tiếp</span>
                <span className="text-h5 text-cta-700 tabular">{COMPANY.hotlineDisplay}</span>
              </span>
            </a>

            <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-4">
              <div className="flex gap-3">
                <Clock className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                <div>
                  <p className="text-label text-neutral-900">Thời gian phản hồi</p>
                  <p className="text-body-sm text-neutral-500">
                    Trong {COMPANY.responseTime}. Giờ làm việc: {COMPANY.workingHours}.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                <div>
                  <p className="text-label text-neutral-900">Báo giá gồm những gì</p>
                  <p className="text-body-sm text-neutral-500">
                    Đơn giá theo lô, quy cách đóng gói, thời gian giao và danh sách chứng từ (MSDS, COA,
                    CO/CQ) đi kèm.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/san-pham"
              className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-4 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100"
            >
              <span className="flex flex-col">
                <span className="text-label text-neutral-900">Chưa rõ cần hoá chất nào?</span>
                <span className="text-body-sm text-neutral-500">Xem danh mục và lọc theo ngành ứng dụng.</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function QuoteFormSkeleton() {
  return (
    <div className="continuity-delayed flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-18 w-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-13 w-full" />
    </div>
  )
}
