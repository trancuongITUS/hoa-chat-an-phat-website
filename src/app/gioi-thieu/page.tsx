import type { Metadata } from 'next'
import Link from 'next/link'

import { CertificateCard } from '@/components/certificate-card'
import { ContentImage } from '@/components/content-image'
import { getIcon } from '@/components/icon-map'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { CERTIFICATES, COMPANY, COMPLIANCE, TIMELINE, WAREHOUSES } from '@/data/company'
import { SITE_IMAGES } from '@/data/images'

export const metadata: Metadata = {
  title: 'Về An Phát',
  description:
    'Lịch sử, năng lực kho vận, giấy phép kinh doanh hoá chất và cam kết an toàn của Công ty TNHH Hoá chất An Phát.',
}

/**
 * Trang giới thiệu — `pages/about.md`.
 *
 * Section "Đội ngũ" cố tình không có: about.md yêu cầu chỉ đưa nhân sự thật với ảnh thật,
 * và bỏ hẳn section nếu không có. Khi có ảnh và thông tin thật thì thêm vào giữa khối
 * "Năng lực kho vận" và "An toàn và tuân thủ".
 */
export default function AboutPage() {
  return (
    <>
      <section className="bg-neutral-0">
        <div className="container-site py-8 lg:py-12">
          <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Về An Phát' }]} />
          <div className="mt-4 measure">
            <h1 className="text-h1 text-neutral-900">
              Mười sáu năm cung ứng hoá chất cho nhà máy miền Nam và miền Bắc
            </h1>
            <p className="text-body-lg mt-4 text-neutral-500">
              An Phát là nhà phân phối hoá chất công nghiệp, không phải nhà sản xuất. Việc của chúng tôi
              là giữ hàng đúng chất lượng trong kho, giao đúng hẹn và đưa đủ chứng từ đi kèm từng lô.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-neutral-0">
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <div className="measure lg:col-span-7">
            <h2 className="text-h2 text-neutral-900">Công ty hình thành như thế nào</h2>
            <div className="text-body mt-4 flex flex-col gap-4 text-neutral-700">
              <p>
                An Phát thành lập năm <span className="tabular">{COMPANY.foundedYear}</span> với một kho
                thuê 400 m² tại Bình Dương, ban đầu chỉ phân phối axit và xút cho các xưởng dệt trong khu
                công nghiệp lân cận. Khách hàng đầu tiên tìm đến vì một lý do rất cụ thể: họ cần phiếu
                phân tích theo từng lô, và không phải nhà cung cấp nào cũng đưa được.
              </p>
              <p>
                Từ đó, danh mục mở rộng theo nhu cầu thực tế của khách chứ không theo kế hoạch kinh doanh
                trên giấy. Nhóm hoá chất xử lý nước được bổ sung khi các khu công nghiệp bắt đầu bị siết
                quy chuẩn nước thải. Nhóm dung môi ra đời khi khách ngành nhựa và sơn hỏi mua.
              </p>
              <p>
                Hiện tại An Phát vận hành ba kho với tổng diện tích 8.400 m², giữ thường trực hơn 240 mã
                hàng và phục vụ khoảng 350 khách hàng doanh nghiệp. Quy mô đó đủ lớn để giữ hàng sẵn,
                nhưng vẫn đủ nhỏ để người phụ trách kỹ thuật trực tiếp nghe điện thoại của khách.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ContentImage
              image={SITE_IMAGES.aboutOfficeWarehouse}
              label="Ảnh văn phòng và khu kho chính của An Phát tại Bình Dương"
              ratio="4 / 3"
              sizes="(min-width: 1024px) 500px, 100vw"
              className="rounded-[var(--radius-lg)] border border-neutral-200"
            />
          </div>
        </div>
      </section>

      <section className="section-y bg-neutral-50">
        <div className="container-site">
          <h2 className="text-h2 text-neutral-900">Mốc phát triển</h2>

          {/* Dọc trên mobile, ngang từ lg (about.md "Ghi đè bố cục") */}
          <ol className="mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:gap-0">
            {TIMELINE.map((milestone, index) => (
              <li key={milestone.year} className="relative flex gap-4 lg:flex-1 lg:flex-col lg:gap-0 lg:pr-6">
                {/* Đường nối 2px neutral-200 với mốc tròn 12px primary-600 */}
                <div className="flex shrink-0 flex-col items-center lg:mb-4 lg:w-full lg:flex-row">
                  <span className="size-3 shrink-0 rounded-full bg-primary-600" />
                  <span
                    aria-hidden="true"
                    className={
                      index === TIMELINE.length - 1
                        ? 'w-0.5 flex-1 bg-neutral-200 lg:h-0.5 lg:w-0 lg:flex-none'
                        : 'w-0.5 flex-1 bg-neutral-200 lg:h-0.5 lg:w-auto lg:flex-1'
                    }
                  />
                </div>

                <div className="pb-2 lg:pb-0">
                  <p className="text-h4 tabular text-primary-700">{milestone.year}</p>
                  <p className="text-label mt-1 text-neutral-900">{milestone.title}</p>
                  <p className="text-body-sm mt-1 text-neutral-500">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y bg-neutral-0">
        <div className="container-site">
          <h2 className="text-h2 text-neutral-900">Giấy phép và chứng nhận</h2>
          <p className="text-body-lg measure mt-3 text-neutral-500">
            Kinh doanh hoá chất là ngành nghề có điều kiện. Toàn bộ giấy tờ dưới đây xem được bản scan
            ngay trên trang, kèm cơ quan cấp và thời hạn hiệu lực.
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATES.map((certificate) => (
              <li key={certificate.slug} className="flex">
                <CertificateCard certificate={certificate} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-neutral-50">
        <div className="container-site">
          <h2 className="text-h2 text-neutral-900">Năng lực kho vận</h2>

          <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card">
            {/* Bảng từ md, danh sách xếp dọc trên mobile — không cuộn ngang */}
            <table className="hidden w-full border-collapse text-left md:table">
              <caption className="sr-only">Địa điểm kho, diện tích, loại hình lưu trữ và bán kính giao hàng</caption>
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100">
                  <th scope="col" className="px-4 py-3 text-label text-neutral-700">Địa điểm</th>
                  <th scope="col" className="px-4 py-3 text-label text-neutral-700">Diện tích</th>
                  <th scope="col" className="px-4 py-3 text-label text-neutral-700">Loại hình lưu trữ</th>
                  <th scope="col" className="px-4 py-3 text-label text-neutral-700">Bán kính giao</th>
                </tr>
              </thead>
              <tbody>
                {WAREHOUSES.map((warehouse) => (
                  <tr key={warehouse.name} className="border-b border-neutral-200 last:border-b-0">
                    <th scope="row" className="px-4 py-3 align-top text-body font-medium text-neutral-900">
                      {warehouse.name}
                      <span className="block text-caption font-normal text-neutral-500">{warehouse.address}</span>
                    </th>
                    <td className="px-4 py-3 align-top text-body tabular text-neutral-700">{warehouse.area}</td>
                    <td className="px-4 py-3 align-top text-body-sm text-neutral-700">{warehouse.storageTypes}</td>
                    <td className="px-4 py-3 align-top text-body tabular text-neutral-700">{warehouse.deliveryRadius}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className="md:hidden">
              {WAREHOUSES.map((warehouse) => (
                <div key={warehouse.name} className="border-b border-neutral-200 p-4 last:border-b-0">
                  <dt className="text-label text-neutral-900">{warehouse.name}</dt>
                  <dd className="mt-1 flex flex-col gap-1 text-body-sm text-neutral-700">
                    <span className="text-neutral-500">{warehouse.address}</span>
                    <span>
                      Diện tích <span className="tabular">{warehouse.area}</span> · Bán kính giao{' '}
                      <span className="tabular">{warehouse.deliveryRadius}</span>
                    </span>
                    <span>{warehouse.storageTypes}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section-y bg-neutral-0">
        <div className="container-site">
          <h2 className="text-h2 text-neutral-900">An toàn và tuân thủ</h2>
          <p className="text-body-lg measure mt-3 text-neutral-500">
            Hoá chất giao sai quy trình gây thiệt hại lớn hơn nhiều so với giá trị lô hàng. Bốn cam kết
            dưới đây là những gì An Phát kiểm soát được và chịu trách nhiệm.
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {COMPLIANCE.map((item) => {
              const Icon = getIcon(item.icon)
              return (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-6"
                >
                  <Icon className="size-6 shrink-0 text-primary-600" aria-hidden="true" />
                  <div>
                    <h3 className="text-h5 text-neutral-900">{item.title}</h3>
                    <p className="text-body-sm mt-1.5 text-neutral-500">{item.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-primary-800">
        <div className="container-site section-y flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-h2 text-on-dark">Cần hoá chất cho quy trình cụ thể?</h2>
            <p className="text-body-lg mt-3 text-on-dark-muted">
              Gửi danh sách cần mua kèm nồng độ và quy cách. Bộ phận kinh doanh phản hồi trong{' '}
              {COMPANY.responseTime}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="ctaOnDark" size="lg">
              <Link href="/yeu-cau-bao-gia">Yêu cầu báo giá</Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg">
              <Link href="/san-pham">Xem danh mục sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
