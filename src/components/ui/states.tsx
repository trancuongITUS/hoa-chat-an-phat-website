import { SearchX } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Empty state và Skeleton — MASTER §7.8.
 *
 * Empty state luôn nêu nguyên nhân và kèm ít nhất một hành động khôi phục.
 * Skeleton có đúng kích thước nội dung thật để không gây layout shift.
 */
export function EmptyState({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-neutral-200 bg-card px-6 py-16 text-center',
        className,
      )}
    >
      <SearchX className="size-12 text-neutral-400" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-h4 text-neutral-900">{title}</p>
        {description ? <p className="text-body-sm measure text-neutral-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-[var(--radius-sm)] bg-neutral-200', className)} />
}

/** Khung chờ của một ProductCard — khớp đúng chiều cao thẻ thật. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-6">
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-6 w-2/5 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  )
}
