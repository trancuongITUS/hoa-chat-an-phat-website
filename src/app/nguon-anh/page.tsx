import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { articleBySlug } from '@/data/articles'
import { ARTICLE_COVERS, PRODUCT_IMAGES, SITE_IMAGES, type SiteImage } from '@/data/images'
import { productBySlug } from '@/data/products'

export const metadata: Metadata = {
  title: 'Nguồn ảnh',
  description: 'Tác giả, giấy phép và nguồn gốc của các ảnh minh hoạ dùng trên website An Phát.',
}

const SITE_IMAGE_USAGE: Record<keyof typeof SITE_IMAGES, string> = {
  homeHero: 'Trang chủ — ảnh nền đầu trang',
  capabilityWarehouse: 'Trang chủ — năng lực kho bãi',
  capabilityTankerTruck: 'Trang chủ — năng lực vận chuyển',
  capabilityQualityControl: 'Trang chủ — năng lực kiểm định',
  aboutOfficeWarehouse: 'Giới thiệu — văn phòng và kho',
}

interface CreditRow {
  usage: string
  image: SiteImage
}

function collectCredits(): { heading: string; rows: CreditRow[] }[] {
  const site = (Object.keys(SITE_IMAGES) as (keyof typeof SITE_IMAGES)[]).map((key) => ({
    usage: SITE_IMAGE_USAGE[key],
    image: SITE_IMAGES[key],
  }))
  const products = Object.entries(PRODUCT_IMAGES).flatMap(([slug, image]) =>
    image ? [{ usage: productBySlug(slug)?.name ?? slug, image }] : [],
  )
  const articles = Object.entries(ARTICLE_COVERS).flatMap(([slug, image]) =>
    image ? [{ usage: articleBySlug(slug)?.title ?? slug, image }] : [],
  )

  return [
    { heading: 'Trang chủ và giới thiệu', rows: site },
    { heading: 'Ảnh sản phẩm', rows: products },
    { heading: 'Ảnh bìa bài viết', rows: articles },
  ]
}

/**
 * Ghi công ảnh — điều kiện bắt buộc của giấy phép CC BY và CC BY-SA: nêu tác giả, giấy phép,
 * đường dẫn nguồn và chỉnh sửa đã áp dụng. Dữ liệu lấy thẳng từ `src/data/images.ts`, nên
 * thêm hoặc thay ảnh ở đó là trang này tự cập nhật.
 */
export default function ImageCreditsPage() {
  const groups = collectCredits()

  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Nguồn ảnh' }]} />

      <div className="mt-4 measure">
        <h1 className="text-h1 text-neutral-900">Nguồn ảnh</h1>
        <p className="text-body-lg mt-4 text-neutral-500">
          Một số ảnh trên website là ảnh minh hoạ có giấy phép tự do, lấy từ Wikimedia Commons, không
          phải ảnh chụp tại kho hay sản phẩm của An Phát. Danh sách dưới đây ghi tác giả, giấy phép và
          nguồn gốc của từng ảnh theo đúng điều kiện của giấy phép.
        </p>
      </div>

      {groups.map((group, index) => (
        <section key={group.heading} className="mt-10" aria-labelledby={`nhom-anh-${index}`}>
          <h2 id={`nhom-anh-${index}`} className="text-h3 text-neutral-900">
            {group.heading}
          </h2>
          <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
            {group.rows.map(({ usage, image }) => (
              <li key={image.src} className="flex flex-col gap-1 py-4">
                <p className="text-label text-neutral-900">{usage}</p>
                <p className="text-body-sm text-neutral-700">
                  <a
                    href={image.credit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-700 underline underline-offset-2 transition-colors duration-[var(--duration-fast)] hover:text-primary-800"
                  >
                    {image.credit.title}
                  </a>{' '}
                  — {image.credit.author},{' '}
                  {image.credit.licenseUrl ? (
                    <a
                      href={image.credit.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer license"
                      className="text-primary-700 underline underline-offset-2 transition-colors duration-[var(--duration-fast)] hover:text-primary-800"
                    >
                      {image.credit.license}
                    </a>
                  ) : (
                    image.credit.license
                  )}
                </p>
                <p className="text-caption text-neutral-500">Chỉnh sửa: {image.credit.changes}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
