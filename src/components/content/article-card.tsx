import Link from 'next/link'

import { ContentImage } from '@/components/content-image'
import { ARTICLE_COVERS } from '@/data/images'
import { ARTICLE_CATEGORIES } from '@/data/taxonomy'
import type { Article } from '@/data/types'
import { cn, formatDate, staggerStyle } from '@/lib/utils'

/**
 * ArticleCard — news.md §A.
 *
 * Vùng bấm là ảnh và tiêu đề, không bọc cả thẻ trong một `<a>`.
 * Ảnh bìa 16:9 có tỉ lệ khai báo sẵn nên không gây CLS.
 */
export function ArticleCard({
  article,
  featured = false,
  index = 0,
  className,
}: {
  article: Article
  featured?: boolean
  index?: number
  className?: string
}) {
  const category = ARTICLE_CATEGORIES.find((item) => item.slug === article.category)
  const href = `/tin-tuc/${article.slug}`

  return (
    <article
      style={staggerStyle(index)}
      className={cn(
        'animate-rise-in flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card',
        'transition-[box-shadow,translate] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'hover:-translate-y-0.5 hover:shadow-md',
        featured && 'sm:flex-row',
        className,
      )}
    >
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={cn('block shrink-0', featured && 'sm:w-1/2')}
      >
        <ContentImage
          image={ARTICLE_COVERS[article.slug]}
          label={`Ảnh bìa bài viết: ${article.title}`}
          ratio="16 / 9"
          sizes={
            featured
              ? '(min-width: 1280px) 640px, (min-width: 640px) 50vw, 100vw'
              : '(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw'
          }
          decorative
          // Thẻ nổi bật xếp ngang từ sm: ảnh phủ kín chiều cao cột chữ thay vì chừa khoảng trắng.
          className={featured ? 'sm:h-full sm:aspect-auto!' : undefined}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-6">
        <p className="text-overline text-primary-700">{category?.name}</p>

        <h3 className={featured ? 'text-h3' : 'text-h4'}>
          <Link href={href} className="rounded-[var(--radius-sm)] text-foreground transition-colors duration-[var(--duration-fast)] hover:text-primary-700">
            {article.title}
          </Link>
        </h3>

        <p className="text-body-sm text-neutral-500">{article.summary}</p>

        <p className="text-caption mt-auto pt-2 text-neutral-500">
          <span className="tabular">{formatDate(article.publishedAt)}</span> ·{' '}
          <span className="tabular">{article.readingMinutes} phút đọc</span>
        </p>
      </div>
    </article>
  )
}
