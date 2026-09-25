import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContentImage } from '@/components/content-image'
import { Callout } from '@/components/content/callout'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { CopyCasButton } from '@/components/product/copy-cas-button'
import { DocumentList } from '@/components/product/document-list'
import { HazardChipRow } from '@/components/product/hazard-chip'
import { ProductActions } from '@/components/product/product-actions'
import { ProductCard } from '@/components/product/product-card'
import { SpecTable } from '@/components/product/spec-table'
import { StockBadge } from '@/components/product/stock-badge'
import { PRODUCT_IMAGES } from '@/data/images'
import { PRODUCTS, productBySlug, relatedProducts } from '@/data/products'
import { GHS_CLASSES, groupBySlug, industryBySlug } from '@/data/taxonomy'
import { FILTER_KEYS } from '@/lib/catalog'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = productBySlug(slug)
  if (!product) return {}

  return {
    title: product.name,
    description: `${product.summary} Số CAS ${product.cas}, mã HS ${product.hsCode}. Có MSDS, COA và chứng từ xuất xứ.`,
  }
}

/**
 * Trang chi tiết sản phẩm — `pages/products.md` §B.
 *
 * Thứ tự khối theo đúng spec: thông số kỹ thuật đứng trên mô tả marketing, và hàng chip
 * GHS nằm ngay dưới tiêu đề chứ không bị đẩy xuống dưới hay giấu trong tab.
 */
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = productBySlug(slug)
  if (!product) notFound()

  const group = groupBySlug(product.groupSlug)
  const related = relatedProducts(product)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    category: group?.name,
    identifier: `CAS ${product.cas}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Số CAS', value: product.cas },
      { '@type': 'PropertyValue', name: 'Công thức hoá học', value: product.formula },
      { '@type': 'PropertyValue', name: 'Mã HS', value: product.hsCode },
      { '@type': 'PropertyValue', name: 'Xuất xứ', value: product.origin },
    ],
  }

  return (
    <div className="container-site pb-18 pt-8 lg:pb-16 lg:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Danh mục', href: '/san-pham' },
          ...(group
            ? [{ label: group.name, href: `/san-pham?${FILTER_KEYS.group}=${group.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <header className="mt-4 flex flex-col gap-3">
        <h1 className="text-h1 text-neutral-900">{product.name}</h1>
        <p className="text-body-lg text-neutral-500">
          {product.chemicalName} · {product.formula}
        </p>
        <p className="flex items-center gap-1 text-body text-neutral-700">
          Số CAS <span className="tabular font-semibold">{product.cas}</span>
          <CopyCasButton cas={product.cas} />
        </p>

        <HazardChipRow codes={product.ghs} className="mt-1" />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <ContentImage
            image={PRODUCT_IMAGES[product.slug]}
            label={`Ảnh ${product.name}, quy cách ${product.packaging[0]}`}
            ratio="4 / 3"
            sizes="(min-width: 1024px) 500px, 100vw"
            preload
            className="rounded-[var(--radius-lg)] border border-neutral-200"
          />

          <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-4">
            <StockBadge status={product.stock} location={product.stockLocation} className="self-start" />
            <dl className="flex flex-col gap-2 text-body-sm">
              <div className="flex gap-2">
                <dt className="text-neutral-500">Quy cách:</dt>
                <dd className="tabular text-neutral-900">{product.packaging.join(' · ')}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-neutral-500">Xuất xứ:</dt>
                <dd className="text-neutral-900">{product.origin}</dd>
              </div>
            </dl>
          </div>

          <ProductActions product={{ slug: product.slug, packaging: product.packaging }} />
        </div>

        <div className="flex flex-col gap-10 lg:col-span-7">
          <section aria-labelledby="thong-so-ky-thuat">
            <h2 id="thong-so-ky-thuat" className="text-h3 mb-4 text-neutral-900">
              Thông số kỹ thuật
            </h2>
            <SpecTable
              rows={product.specs}
              caption={`Thông số kỹ thuật của ${product.name}`}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card"
            />
          </section>

          <section aria-labelledby="tai-lieu">
            <h2 id="tai-lieu" className="text-h3 mb-4 text-neutral-900">
              Tài liệu tải về
            </h2>
            <DocumentList documents={product.documents} />
          </section>

          <section aria-labelledby="ung-dung">
            <h2 id="ung-dung" className="text-h3 mb-4 text-neutral-900">
              Ứng dụng và ngành sử dụng
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-body text-neutral-700">
              {product.applications.map((application) => (
                <li key={application}>{application}</li>
              ))}
            </ul>

            <p className="text-body-sm mt-4 text-neutral-500">
              Ngành đang dùng nhiều:{' '}
              {product.industrySlugs
                .map((industrySlug) => industryBySlug(industrySlug)?.name)
                .filter(Boolean)
                .join(' · ')}
            </p>
          </section>

          <section aria-labelledby="bao-quan-an-toan">
            <h2 id="bao-quan-an-toan" className="text-h3 mb-4 text-neutral-900">
              Hướng dẫn bảo quản và xử lý an toàn
            </h2>
            <Callout tone="safety" title={hazardSummary(product.ghs)}>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {product.safety.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Callout>
          </section>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="san-pham-lien-quan" className="mt-14">
          <h2 id="san-pham-lien-quan" className="text-h3 mb-6 text-neutral-900">
            Sản phẩm liên quan
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item, index) => (
              <li key={item.slug} className="flex">
                <ProductCard product={item} index={index} quoteEmphasis="outline" className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

/** Tiêu đề khối an toàn nêu rõ phân loại nguy hại thay vì một câu chung chung. */
function hazardSummary(codes: (keyof typeof GHS_CLASSES)[]) {
  if (codes.length === 0) return 'Lưu ý bảo quản'
  return `Lưu ý an toàn — ${codes.map((code) => GHS_CLASSES[code].name).join(', ')}`
}
