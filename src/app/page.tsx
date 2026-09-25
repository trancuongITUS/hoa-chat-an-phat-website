import Link from 'next/link'
import { ArrowRight, Check, Mail, Phone } from 'lucide-react'

import { CertificateCard } from '@/components/certificate-card'
import { ContentImage } from '@/components/content-image'
import { ClientMarquee } from '@/components/home/client-marquee'
import { RevealGroup } from '@/components/home/reveal-group'
import { TrustStats } from '@/components/home/trust-stats'
import { getIcon } from '@/components/icon-map'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { CAPABILITIES, CERTIFICATES, CLIENT_LOGO_PLACEHOLDERS, COMPANY } from '@/data/company'
import { SITE_IMAGES } from '@/data/images'
import { PRODUCTS } from '@/data/products'
import { INDUSTRIES } from '@/data/taxonomy'
import { FILTER_KEYS } from '@/lib/catalog'
import { cn, staggerStyle } from '@/lib/utils'

/**
 * Trang chủ — mẫu Enterprise Gateway theo `pages/home.md`.
 *
 * Mỗi khung nhìn chỉ có một nút `cta`: hero và khối CTA cuối trang. Lưới sản phẩm dùng
 * `quoteEmphasis="outline"` để không tạo ra tám nút `cta` cùng lúc.
 */
export default function HomePage() {
  const featured = PRODUCTS.slice(0, 8)

  return (
    <>
      <HeroSection />
      <TrustSection />
      <IndustrySection />
      <FeaturedProductsSection products={featured} />
      <CapabilitySection />
      <CertificateSection />
      <ClientSection />
      <FinalCtaSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900">
      {/* Ảnh nền kho/bồn chứa — phủ rgb(12 22 34 / .6) theo home.md. Là ảnh LCP nên preload. */}
      <div aria-hidden="true" className="absolute inset-0">
        <ContentImage
          image={SITE_IMAGES.homeHero}
          tone="dark"
          ratio="auto"
          label="Ảnh kho chứa và hệ bồn của An Phát"
          sizes="100vw"
          preload
          decorative
          className="h-full bg-primary-900"
        />
        <div className="absolute inset-0 bg-[rgb(12_22_34_/_0.6)]" />
      </div>

      <div className="container-wide relative py-16 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-overline text-primary-200">Nhà phân phối hoá chất công nghiệp</p>
          <h1 className="text-display mt-3 text-on-dark">{COMPANY.tagline}</h1>
          <p className="text-body-lg measure mt-5 text-on-dark-muted">
            Danh mục hơn 240 mã hàng, có sẵn MSDS, COA và chứng từ xuất xứ cho từng lô. Đội xe được cấp
            phép vận chuyển hàng nguy hiểm, giao trong bán kính 150 km từ ba kho tại Bình Dương, Long An
            và Hải Phòng.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="ctaOnDark" size="lg">
              <Link href="/yeu-cau-bao-gia">
                Yêu cầu báo giá
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg">
              <a href={COMPANY.hotlineHref}>
                <Phone aria-hidden="true" />
                <span className="tabular">Gọi {COMPANY.hotlineDisplay}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section aria-label="Số liệu năng lực" className="bg-neutral-0">
      <div className="container-site">
        {/* Hero là phần tử định vị nên luôn vẽ sau khối thường; thẻ số liệu cần tạo lớp
            riêng để phần đè 48px nằm trên hero. z-10 vẫn thấp hơn header dính (z-20). */}
        <div className="relative z-10 py-8 lg:-mt-12 lg:py-0">
          <TrustStats />
        </div>
      </div>
    </section>
  )
}

function IndustrySection() {
  return (
    <section className="section-y bg-neutral-0">
      <div className="container-site">
        <SectionHeading
          overline="Chọn theo ngành ứng dụng"
          title="Bắt đầu từ ngành sản xuất của bạn"
          description="Mỗi ngành có nhóm hoá chất, yêu cầu chứng từ và quy cách đóng gói riêng. Chọn ngành để vào thẳng danh mục đã lọc sẵn."
        />

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, index) => {
            const Icon = getIcon(industry.icon)
            return (
              <li
                key={industry.slug}
                style={staggerStyle(index)}
                className="animate-rise-in"
              >
                <Link
                  href={`/san-pham?${FILTER_KEYS.industry}=${industry.slug}`}
                  className={cn(
                    'flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-6 shadow-sm',
                    'transition-[box-shadow,translate,border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                    'hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md',
                  )}
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-50 text-primary-600">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-h4 text-neutral-900">{industry.name}</span>
                  <span className="text-body-sm text-neutral-500">{industry.description}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-label text-primary-700">
                    Xem hoá chất cho ngành này
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}

function FeaturedProductsSection({ products }: { products: typeof PRODUCTS }) {
  return (
    <section className="section-y bg-neutral-50">
      <div className="container-site">
        <SectionHeading
          overline="Nhóm hoá chất chủ lực"
          title="Những mã hàng được đặt nhiều nhất"
          description="Toàn bộ thông số dưới đây lấy từ phiếu phân tích của lô đang lưu kho. Giá được báo theo lô qua liên hệ trực tiếp."
          action={
            <Button asChild variant="outline" size="md">
              <Link href="/san-pham">
                Xem toàn bộ danh mục
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.slug} className="flex">
              <ProductCard product={product} index={index} quoteEmphasis="outline" className="w-full" />
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function CapabilitySection() {
  return (
    <section className="section-y bg-neutral-0">
      <div className="container-site">
        <SectionHeading
          overline="Năng lực cung ứng"
          title="Hàng đến đúng hẹn vì hạ tầng phía sau đã sẵn sàng"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => {
            const Icon = getIcon(capability.icon)
            return (
              <article key={capability.title} className="flex flex-col gap-4">
                <ContentImage
                  image={capability.image}
                  label={capability.imageLabel}
                  ratio="16 / 10"
                  sizes="(min-width: 1024px) 400px, 100vw"
                  className="rounded-[var(--radius-lg)]"
                />
                <div className="flex items-center gap-2.5">
                  <Icon className="size-5 shrink-0 text-primary-600" aria-hidden="true" />
                  <h3 className="text-h4 text-neutral-900">{capability.title}</h3>
                </div>
                <p className="text-body-sm text-neutral-500">{capability.description}</p>
                <ul className="flex flex-col gap-2">
                  {capability.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-body-sm text-neutral-700">
                      <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span className="tabular">{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CertificateSection() {
  return (
    <section className="section-y bg-neutral-50">
      <div className="container-site">
        <SectionHeading
          overline="Chứng nhận và giấy phép"
          title="Giấy tờ đầy đủ, xem được bản scan ngay tại đây"
          description="Kinh doanh hoá chất là ngành có điều kiện. Bấm vào từng giấy tờ để xem bản scan và tải bản PDF."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATES.map((certificate) => (
            <li key={certificate.slug} className="flex">
              <CertificateCard certificate={certificate} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ClientSection() {
  return (
    <section className="section-y bg-neutral-0">
      <div className="container-site">
        <SectionHeading
          overline="Khách hàng tiêu biểu"
          title="Đang cung ứng thường xuyên cho sáu nhóm ngành"
          description="Logo khách hàng chỉ được đăng khi đã có văn bản đồng ý sử dụng thương hiệu."
        />

        <div className="mt-10">
          <ClientMarquee items={CLIENT_LOGO_PLACEHOLDERS} />
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="bg-primary-800">
      <div className="container-site section-y flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-h2 text-on-dark">Gửi danh sách hoá chất, nhận báo giá theo lô</h2>
          <p className="text-body-lg mt-3 text-on-dark-muted">
            Bộ phận kinh doanh phản hồi trong {COMPANY.responseTime}. Báo giá kèm quy cách đóng gói,
            thời gian giao và danh sách chứng từ đi theo lô.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Button asChild variant="ctaOnDark" size="lg">
            <Link href="/yeu-cau-bao-gia">
              Yêu cầu báo giá
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <div className="flex flex-col gap-2 text-body-sm">
            <a href={COMPANY.hotlineHref} className="inline-flex items-center gap-2 text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200">
              <Phone className="size-4" aria-hidden="true" />
              <span className="tabular">{COMPANY.hotlineDisplay}</span>
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-2 text-on-dark transition-colors duration-[var(--duration-fast)] hover:text-primary-200"
            >
              <Mail className="size-4" aria-hidden="true" />
              {COMPANY.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({
  overline,
  title,
  description,
  action,
}: {
  overline: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-overline text-primary-700">{overline}</p>
        <h2 className="text-h2 mt-2 text-neutral-900">{title}</h2>
        {description ? <p className="text-body-lg mt-3 text-neutral-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
