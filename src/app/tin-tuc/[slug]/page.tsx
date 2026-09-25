import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/content/article-card'
import { ReadingProgress, ShareButtons, TableOfContents } from '@/components/content/article-chrome'
import { Callout } from '@/components/content/callout'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ProductCard } from '@/components/product/product-card'
import { SpecTable } from '@/components/product/spec-table'
import { Button } from '@/components/ui/button'
import { ARTICLES, articleBySlug, relatedArticles } from '@/data/articles'
import { productsBySlugs } from '@/data/products'
import { ARTICLE_CATEGORIES } from '@/data/taxonomy'
import type { ArticleBlock } from '@/data/types'
import { COMPANY } from '@/data/company'
import { formatDate, formatDateLong } from '@/lib/utils'

/** Địa chỉ công khai dùng cho link chia sẻ và dữ liệu có cấu trúc. */
const SITE_ORIGIN = 'https://hoachatanphat.example.com'

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = articleBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  }
}

/**
 * Trang bài viết — `pages/news.md` §B.
 *
 * Cột nội dung giới hạn 68ch, chữ thân bài 18/30. Khối "sản phẩm liên quan" chèn cuối bài
 * là cầu nối chuyển đổi chính của trang tin.
 */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articleBySlug(slug)
  if (!article) notFound()

  const category = ARTICLE_CATEGORIES.find((item) => item.slug === article.category)
  const headings = article.blocks
    .filter((block): block is ArticleBlock & { id: string; text: string } =>
      block.type === 'heading' && Boolean(block.id) && Boolean(block.text),
    )
    .map((block) => ({ id: block.id, text: block.text }))

  const related = relatedArticles(article)
  const relatedProductList = productsBySlugs(article.relatedProductSlugs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.author.name },
    publisher: { '@type': 'Organization', name: COMPANY.name },
  }

  return (
    <>
      <ReadingProgress />

      <div className="container-site py-8 lg:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Tin tức', href: '/tin-tuc' },
            ...(category ? [{ label: category.name, href: `/tin-tuc?chuyenmuc=${category.slug}` }] : []),
            { label: article.title },
          ]}
        />

        <div className="mt-6 grid gap-10 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <TableOfContents headings={headings} />
          </aside>

          <div className="min-w-0">
            <article className="mx-auto measure">
              <header className="flex flex-col gap-3">
                <p className="text-overline text-primary-700">{category?.name}</p>
                <h1 className="text-h1 text-neutral-900">{article.title}</h1>
                <p className="text-body-lg text-neutral-500">{article.summary}</p>
                <p className="text-caption text-neutral-500">
                  <time dateTime={article.publishedAt} className="tabular">
                    {formatDate(article.publishedAt)}
                  </time>
                  {' · '}
                  <span className="tabular">{article.readingMinutes} phút đọc</span>
                  {' · '}
                  {article.author.name}
                </p>
              </header>

              <div className="mt-8 flex flex-col">
                {article.blocks.map((block, index) => (
                  <ArticleBlockView key={index} block={block} />
                ))}
              </div>

              {relatedProductList.length > 0 ? (
                <section aria-labelledby="hoa-chat-nhac-den" className="mt-12">
                  <h2 id="hoa-chat-nhac-den" className="text-h3 mb-4 text-neutral-900">
                    Hoá chất được nhắc tới trong bài
                  </h2>
                  <ul className="grid gap-6 sm:grid-cols-2">
                    {relatedProductList.map((product, index) => (
                      <li key={product.slug} className="flex">
                        <ProductCard
                          product={product}
                          index={index}
                          quoteEmphasis="outline"
                          className="w-full"
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <footer className="mt-12 flex flex-col gap-6 border-t border-neutral-200 pt-6">
                <div>
                  <p className="text-label text-neutral-900">{article.author.name}</p>
                  <p className="text-body-sm text-neutral-500">{article.author.role}</p>
                </div>

                {article.references.length > 0 ? (
                  <div>
                    <h2 className="text-h5 mb-2 text-neutral-900">Nguồn tham chiếu</h2>
                    <ul className="flex list-disc flex-col gap-1 pl-5 text-body-sm text-neutral-500">
                      {article.references.map((reference) => (
                        <li key={reference}>{reference}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="text-caption text-neutral-500">
                  Cập nhật gần nhất: <span className="tabular">{formatDateLong(article.updatedAt)}</span>
                </p>

                <ShareButtons title={article.title} url={`${SITE_ORIGIN}/tin-tuc/${article.slug}`} />
              </footer>
            </article>

            <section aria-labelledby="bai-lien-quan" className="mt-14">
              <h2 id="bai-lien-quan" className="text-h3 mb-6 text-neutral-900">
                Bài viết liên quan
              </h2>
              <ul className="grid gap-6 md:grid-cols-3">
                {related.map((item, index) => (
                  <li key={item.slug} className="flex">
                    <ArticleCard article={item} index={index} className="w-full" />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <section className="bg-primary-800">
        <div className="container-site section-y flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-h2 text-on-dark">Cần tư vấn cho đúng quy trình của bạn?</h2>
            <p className="text-body-lg mt-3 text-on-dark-muted">
              Gửi thông số vận hành và danh sách hoá chất đang dùng. Bộ phận kỹ thuật phản hồi trong{' '}
              {COMPANY.responseTime}.
            </p>
          </div>
          <Button asChild variant="ctaOnDark" size="lg">
            <Link href="/yeu-cau-bao-gia">Yêu cầu báo giá</Link>
          </Button>
        </div>
      </section>
    </>
  )
}

/** Dựng từng khối nội dung theo đúng đặc tả kiểu chữ và khoảng cách của news.md §B. */
function ArticleBlockView({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          id={block.id}
          className="text-h3 mt-12 border-t border-neutral-200 pt-6 text-neutral-900 scroll-mt-24"
        >
          {block.text}
        </h2>
      )

    case 'paragraph':
      return <p className="text-body-lg mt-5 text-neutral-700">{block.text}</p>

    case 'list':
      return (
        <ul className="text-body-lg mt-5 flex list-disc flex-col gap-2 pl-5 text-neutral-700">
          {block.items?.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )

    case 'callout-safety':
      return (
        <Callout tone="safety" className="mt-6">
          {block.text}
        </Callout>
      )

    case 'callout-tech':
      return (
        <Callout tone="tech" className="mt-6">
          {block.text}
        </Callout>
      )

    case 'spec-table':
      return (
        <SpecTable
          rows={block.rows ?? []}
          className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card"
        />
      )

    case 'formula':
      return (
        <p className="text-body mt-5 rounded-[var(--radius-sm)] bg-neutral-100 p-4 text-neutral-900 tabular">
          {block.text}
        </p>
      )

    default:
      return null
  }
}
