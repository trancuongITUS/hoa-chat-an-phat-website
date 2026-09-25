import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { ContactForm } from '@/components/contact/contact-form'
import { DeferredMap } from '@/components/contact/deferred-map'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { COMPANY, WAREHOUSES } from '@/data/company'

export const metadata: Metadata = {
  title: 'Liên hệ',
  description:
    'Hotline, email, giờ làm việc và địa chỉ văn phòng cùng ba kho của Hoá chất An Phát tại Bình Dương, Long An và Hải Phòng.',
}

/**
 * Trang liên hệ — `pages/quote-contact.md` §B.
 *
 * Thẻ hotline dùng nền `cta-50` viền `cta-600` để nổi hơn các kênh còn lại. Không có nút
 * Zalo, Messenger hay widget chat bên thứ ba: An Phát chưa vận hành kênh nào trong số đó,
 * và một nút chat không ai trực còn tệ hơn là không có nút nào.
 */
export default function ContactPage() {
  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]} />

      <div className="mt-4 measure">
        <h1 className="text-h1 text-neutral-900">Liên hệ</h1>
        <p className="text-body-lg mt-3 text-neutral-500">
          Gọi hotline là cách nhanh nhất để được tư vấn kỹ thuật và kiểm tra tồn kho theo thời gian thực.
        </p>
      </div>

      <section aria-labelledby="kenh-lien-he" className="mt-8">
        <h2 id="kenh-lien-he" className="sr-only">
          Kênh liên hệ nhanh
        </h2>

        <ul className="grid gap-4 sm:grid-cols-3">
          <li>
            <a
              href={COMPANY.hotlineHref}
              className="flex h-full min-h-11 items-start gap-3 rounded-[var(--radius-lg)] border border-cta-600 bg-cta-50 p-5 transition-colors duration-[var(--duration-fast)] hover:bg-cta-50/70"
            >
              <Phone className="mt-0.5 size-5 shrink-0 text-cta-700" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-caption text-neutral-700">Hotline kinh doanh</span>
                <span className="text-h5 tabular text-cta-700">{COMPANY.hotlineDisplay}</span>
                <span className="text-caption mt-1 text-neutral-700">Nhanh nhất cho đơn gấp</span>
              </span>
            </a>
          </li>

          <li>
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex h-full min-h-11 items-start gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-0 p-5 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100"
            >
              <Mail className="mt-0.5 size-5 shrink-0 text-primary-600" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-caption text-neutral-700">Email</span>
                <span className="text-h5 text-neutral-900">{COMPANY.email}</span>
                <span className="text-caption mt-1 text-neutral-700">
                  Phản hồi trong {COMPANY.responseTime}
                </span>
              </span>
            </a>
          </li>

          <li>
            <div className="flex h-full items-start gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-0 p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary-600" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="text-caption text-neutral-700">Giờ làm việc</span>
                <span className="text-body font-medium text-neutral-900">{COMPANY.workingHours}</span>
                <span className="text-caption mt-1 text-neutral-700">Chủ Nhật và ngày lễ nghỉ</span>
              </span>
            </div>
          </li>
        </ul>
      </section>

      <section aria-labelledby="dia-diem" className="mt-14">
        <h2 id="dia-diem" className="text-h2 text-neutral-900">
          Văn phòng và kho
        </h2>

        <ul className="mt-6 grid gap-6 lg:grid-cols-3">
          {WAREHOUSES.map((warehouse) => (
            <li
              key={warehouse.name}
              className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-5"
            >
              <h3 className="text-h5 text-neutral-900">{warehouse.name}</h3>

              <p className="flex items-start gap-2 text-body-sm text-neutral-700">
                <MapPin className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                {warehouse.address}
              </p>

              <p className="flex items-start gap-2 text-body-sm">
                <Phone className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                <a
                  href={warehouse.phoneHref}
                  className="inline-flex min-h-11 items-center tabular text-primary-700 hover:underline"
                >
                  {warehouse.phoneDisplay}
                </a>
              </p>

              <p className="flex items-start gap-2 text-body-sm text-neutral-700">
                <Clock className="mt-0.5 size-4 shrink-0 text-neutral-500" aria-hidden="true" />
                Tiếp nhận hàng {warehouse.receivingHours}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warehouse.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-[var(--radius-md)] border border-neutral-400 px-4 text-label text-primary-700 transition-colors duration-[var(--duration-fast)] hover:bg-primary-50"
              >
                Chỉ đường
                <span className="sr-only">tới {warehouse.name} — mở Google Maps ở tab mới</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ban-do" className="mt-14">
        <h2 id="ban-do" className="text-h2 mb-2 text-neutral-900">
          Bản đồ
        </h2>
        <p className="text-body-sm mb-6 text-neutral-500">
          Bản đồ chỉ được nạp khi bạn bấm xem, để trang không phải kéo iframe nặng ngay lần tải đầu.
        </p>
        <DeferredMap query={WAREHOUSES[0].mapQuery} label={WAREHOUSES[0].name} />
      </section>

      <section aria-labelledby="form-lien-he" className="mt-14 max-w-3xl">
        <h2 id="form-lien-he" className="text-h2 text-neutral-900">
          Gửi câu hỏi
        </h2>
        <p className="text-body-lg mb-6 mt-3 text-neutral-500">
          Dành cho câu hỏi chung về sản phẩm, chứng từ hoặc đơn hàng đang giao.
        </p>
        <ContactForm />
      </section>
    </div>
  )
}
