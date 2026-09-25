import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  href?: string
  /** Tên đầy đủ khi `label` đã bị rút gọn — gắn vào `title` (MASTER §3.3). */
  fullLabel?: string
}

/**
 * Breadcrumb — bắt buộc ở trang sâu từ 3 cấp (MASTER §10).
 * Kèm dữ liệu có cấu trúc `BreadcrumbList` theo products.md.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.fullLabel ?? item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  }

  return (
    <nav aria-label="Đường dẫn" className={cn('text-body-sm', className)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
              ) : null}
              {item.href && !isLast ? (
                <Link href={item.href} title={item.fullLabel} className="text-primary-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} title={item.fullLabel} className="text-neutral-500">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
