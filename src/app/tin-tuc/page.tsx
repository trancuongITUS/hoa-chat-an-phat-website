import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/content/article-card'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { EmptyState } from '@/components/ui/states'
import { Button } from '@/components/ui/button'
import { ARTICLES_SORTED } from '@/data/articles'
import { ARTICLE_CATEGORIES } from '@/data/taxonomy'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tin tức & Kiến thức ngành',
  description:
    'Kiến thức hoá chất, ứng dụng theo ngành, an toàn và tuân thủ trong lưu trữ, vận chuyển và sử dụng hoá chất công nghiệp.',
}

const PAGE_SIZE = 9

/**
 * Danh sách bài viết — `pages/news.md` §A.
 *
 * Chip chuyên mục phân biệt bằng cả `aria-pressed` lẫn nền màu, không chỉ bằng màu.
 * Phân trang bằng link thật, không infinite scroll.
 */
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const rawCategory = typeof params.chuyenmuc === 'string' ? params.chuyenmuc : null
  const category = ARTICLE_CATEGORIES.some((item) => item.slug === rawCategory) ? rawCategory : null

  const rawPage = Number.parseInt(typeof params.trang === 'string' ? params.trang : '1', 10)
  const filtered = category ? ARTICLES_SORTED.filter((article) => article.category === category) : ARTICLES_SORTED
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Number.isFinite(rawPage) ? Math.min(Math.max(rawPage, 1), pageCount) : 1
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Bài nổi bật chiếm 2 cột chỉ khi đang xem trang đầu và không lọc chuyên mục
  const showFeatured = page === 1 && !category && items[0]?.featured
  const [lead, ...rest] = items

  const hrefFor = (slug: string | null) => (slug ? `/tin-tuc?chuyenmuc=${slug}` : '/tin-tuc')

  return (
    <div className="container-site py-8 lg:py-12">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức' }]} />

      <div className="mt-4 measure">
        <h1 className="text-h1 text-neutral-900">Tin tức &amp; Kiến thức ngành</h1>
        <p className="text-body-lg mt-3 text-neutral-500">
          Bài kỹ thuật viết cho người vận hành: cách chọn hoá chất, cách lưu trữ an toàn và những sai sót
          hay gặp trong thực tế.
        </p>
      </div>

      <nav aria-label="Lọc theo chuyên mục" className="mt-8 flex flex-wrap gap-2">
        <CategoryChip href={hrefFor(null)} label="Tất cả" active={category === null} />
        {ARTICLE_CATEGORIES.map((item) => (
          <CategoryChip
            key={item.slug}
            href={hrefFor(item.slug)}
            label={item.name}
            active={category === item.slug}
          />
        ))}
      </nav>

      <p aria-live="polite" className="mt-6 text-body-sm text-neutral-700">
        <span className="tabular font-semibold">{filtered.length}</span> bài viết
        {category ? ` trong chuyên mục ${ARTICLE_CATEGORIES.find((item) => item.slug === category)?.name}` : ''}
      </p>

      {items.length > 0 ? (
        <section aria-labelledby="danh-sach-bai-viet">
          {/* Tiêu đề cấp 2 cho vùng danh sách: thẻ bài viết dùng h3, không được nhảy từ h1 */}
          <h2 id="danh-sach-bai-viet" className="sr-only">
            Danh sách bài viết
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showFeatured ? (
              <>
                <li className="flex md:col-span-2">
                  <ArticleCard article={lead} featured className="w-full" />
                </li>
                {rest.map((article, index) => (
                  <li key={article.slug} className="flex">
                    <ArticleCard article={article} index={index + 1} className="w-full" />
                  </li>
                ))}
              </>
            ) : (
              items.map((article, index) => (
                <li key={article.slug} className="flex">
                  <ArticleCard article={article} index={index} className="w-full" />
                </li>
              ))
            )}
          </ul>

          {pageCount > 1 ? (
            <nav aria-label="Phân trang tin tức" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((target) => {
                const query = new URLSearchParams()
                if (category) query.set('chuyenmuc', category)
                if (target > 1) query.set('trang', String(target))
                const href = query.toString() ? `/tin-tuc?${query}` : '/tin-tuc'

                return (
                  <Link
                    key={target}
                    href={href}
                    aria-current={target === page ? 'page' : undefined}
                    className={cn(
                      'inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] text-label tabular transition-colors duration-[var(--duration-fast)]',
                      target === page
                        ? 'bg-primary-600 text-neutral-0'
                        : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100',
                    )}
                  >
                    {target}
                    <span className="sr-only"> — trang {target}</span>
                  </Link>
                )
              })}
            </nav>
          ) : null}
        </section>
      ) : (
        <EmptyState
          className="mt-6"
          title="Chưa có bài viết trong chuyên mục này"
          description="Chuyên mục đang được bổ sung. Trong lúc chờ, bạn có thể xem toàn bộ bài viết hoặc liên hệ trực tiếp để được tư vấn."
          actions={
            <Button asChild variant="outline" size="md">
              <Link href="/tin-tuc">Xem tất cả bài viết</Link>
            </Button>
          }
        />
      )}
    </div>
  )
}

function CategoryChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      role="button"
      className={cn(
        'inline-flex min-h-11 items-center rounded-full px-4 text-label transition-colors duration-[var(--duration-fast)]',
        active
          ? 'bg-primary-600 text-neutral-0'
          : 'border border-neutral-200 bg-card text-neutral-700 hover:bg-neutral-100',
      )}
    >
      {label}
    </Link>
  )
}
