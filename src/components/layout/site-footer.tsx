import Link from 'next/link'
import { Clock, Info, Mail, MapPin, Phone } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { NAV_ITEMS } from '@/components/layout/navigation'
import { COMPANY, IS_SAMPLE_CONTENT, WAREHOUSES } from '@/data/company'
import { CHEMICAL_GROUPS } from '@/data/taxonomy'
import { FILTER_KEYS } from '@/lib/catalog'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary-800 text-on-dark">
      <div className="container-site grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BrandMark tone="dark" className="size-10" />
            <p className="text-h5 text-on-dark">{COMPANY.name}</p>
          </div>
          <p className="text-body-sm text-on-dark-muted">{COMPANY.tagline}.</p>
          <p className="text-body-sm text-on-dark-muted">
            Mã số thuế <span className="tabular">{COMPANY.taxCode}</span>
          </p>
        </div>

        <nav aria-label="Danh mục sản phẩm" className="flex flex-col gap-3">
          <p className="text-overline text-on-dark-muted">Nhóm hoá chất</p>
          <ul className="flex flex-col gap-2">
            {CHEMICAL_GROUPS.map((group) => (
              <li key={group.slug}>
                <Link
                  href={`/san-pham?${FILTER_KEYS.group}=${group.slug}`}
                  className="text-body-sm text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200"
                >
                  {group.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Liên kết trang" className="flex flex-col gap-3">
          <p className="text-overline text-on-dark-muted">Về công ty</p>
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.filter((item) => item.href).map((item) => (
              <li key={item.label}>
                <Link href={item.href!} className="text-body-sm text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/yeu-cau-bao-gia" className="text-body-sm text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
                Yêu cầu báo giá
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <p className="text-overline text-on-dark-muted">Liên hệ</p>
          <ul className="flex flex-col gap-3 text-body-sm">
            <li>
              <a href={COMPANY.hotlineHref} className="inline-flex items-center gap-2 text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span className="tabular">{COMPANY.hotlineDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="inline-flex items-center gap-2 text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {COMPANY.email}
              </a>
            </li>
            <li className="flex items-start gap-2 text-on-dark-muted">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {COMPANY.workingHours}
            </li>
            <li className="flex items-start gap-2 text-on-dark-muted">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {WAREHOUSES[0].address}
            </li>
          </ul>
        </div>
      </div>

      {IS_SAMPLE_CONTENT ? (
        <div className="border-t border-primary-700">
          <div className="container-site flex items-start gap-2 py-4 text-caption text-on-dark-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Bản dựng đang chạy trên dữ liệu mẫu. Tên riêng, số điện thoại, địa chỉ, số hiệu giấy tờ và
              số liệu năng lực là chỗ dành sẵn, chưa phải thông tin thật của công ty.
            </p>
          </div>
        </div>
      ) : null}

      <div className="border-t border-primary-700">
        <div className="container-site py-4 text-caption text-on-dark-muted">
          © <span className="tabular">{year}</span> {COMPANY.name}. Website không bán hàng trực tuyến —
          mọi báo giá được thực hiện qua liên hệ trực tiếp. Ảnh minh hoạ:{' '}
          <Link href="/nguon-anh" className="text-on-dark underline underline-offset-2 transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
            nguồn và giấy phép
          </Link>
          .
        </div>
      </div>
    </footer>
  )
}
