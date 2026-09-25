import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Mail, Phone, SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { COMPANY } from '@/data/company'
import { PRODUCTS } from '@/data/products'
import { CHEMICAL_GROUPS } from '@/data/taxonomy'
import { FILTER_KEYS } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Không tìm thấy trang',
}

/** Số mã hàng đếm từ danh mục thật, để lối tắt theo nhóm không dẫn tới một trang rỗng. */
const GROUP_LINKS = CHEMICAL_GROUPS.map((group) => ({
  href: `/san-pham?${FILTER_KEYS.group}=${group.slug}`,
  label: group.name,
  count: PRODUCTS.filter((product) => product.groupSlug === group.slug).length,
})).filter((group) => group.count > 0)

const OTHER_LINKS = [
  { href: '/tin-tuc', label: 'Tin tức và kiến thức kỹ thuật' },
  { href: '/gioi-thieu', label: 'Về An Phát' },
  { href: '/lien-he', label: 'Liên hệ và địa chỉ kho' },
]

const linkRowClass =
  'flex min-h-11 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-0 px-4 py-3 text-body text-neutral-900 transition-colors duration-[var(--duration-fast)] hover:border-primary-600 hover:bg-primary-50'

/**
 * Trang 404 — MASTER §7.8 (empty state) và §1.
 *
 * Người đến đây thường theo một link cũ tới mã hàng đã gỡ. Trang nêu nguyên nhân, đưa lối
 * về danh mục theo nhóm hoá chất, và giữ đúng một nút `cta` "Yêu cầu báo giá" để người mua
 * nhờ bộ phận kinh doanh tìm mã tương đương.
 */
export default function NotFound() {
  return (
    <div className="container-site section-y">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <SearchX className="size-12 text-neutral-400" aria-hidden="true" />
          <p className="text-overline mt-6 text-primary-700">
            Lỗi <span className="tabular">404</span>
          </p>
          <h1 className="text-h1 mt-2 text-neutral-900">Không tìm thấy trang này</h1>
          <p className="text-body-lg measure mt-4 text-neutral-500">
            Đường dẫn có thể đã thay đổi, bị gõ nhầm, hoặc hoá chất đã được gỡ khỏi danh mục. Hãy tìm
            lại theo nhóm hoá chất bên dưới, hoặc nhờ bộ phận kinh doanh tìm mã hàng tương đương.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary" size="md">
              <Link href="/san-pham">
                Xem danh mục sản phẩm
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>

        <aside
          aria-labelledby="nho-tim-san-pham"
          className="self-start rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-4 shadow-sm sm:p-6 lg:col-span-5"
        >
          <h2 id="nho-tim-san-pham" className="text-h4 text-neutral-900">
            Cần tìm một hoá chất cụ thể?
          </h2>
          <p className="text-body-sm mt-2 text-neutral-500">
            Gửi tên hoá chất, nồng độ và số lượng. Bộ phận kinh doanh báo lại mã hàng đang có hoặc
            sản phẩm thay thế trong {COMPANY.responseTime}.
          </p>

          <Button asChild variant="cta" size="md" className="mt-5 w-full">
            <Link href="/yeu-cau-bao-gia">
              Yêu cầu báo giá
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>

          <ul className="mt-5 flex flex-col gap-1 border-t border-neutral-200 pt-4 text-body-sm">
            <li>
              <a
                href={COMPANY.hotlineHref}
                className="inline-flex min-h-11 items-center gap-2 text-primary-700 transition-colors duration-[var(--duration-fast)] hover:text-primary-800"
              >
                <Phone className="size-4" aria-hidden="true" />
                Hotline <span className="tabular font-semibold">{COMPANY.hotlineDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex min-h-11 items-center gap-2 break-all text-primary-700 transition-colors duration-[var(--duration-fast)] hover:text-primary-800"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </aside>
      </div>

      <div className="mt-12 grid gap-10 border-t border-neutral-200 pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-6">
        <nav aria-labelledby="tim-theo-nhom" className="lg:col-span-7">
          <h2 id="tim-theo-nhom" className="text-h5 text-neutral-900">
            Tìm theo nhóm hoá chất
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {GROUP_LINKS.map((group) => (
              <li key={group.href}>
                <Link href={group.href} className={linkRowClass}>
                  <span>{group.label}</span>
                  <span className="flex shrink-0 items-center gap-1 text-body-sm text-neutral-500">
                    <span className="tabular">{group.count}</span> mã
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="trang-khac" className="lg:col-span-5">
          <h2 id="trang-khac" className="text-h5 text-neutral-900">
            Trang khác
          </h2>
          <ul className="mt-4 grid gap-2">
            {OTHER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkRowClass}>
                  <span>{link.label}</span>
                  <ChevronRight className="size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
