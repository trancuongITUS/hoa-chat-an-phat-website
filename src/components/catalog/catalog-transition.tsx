'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

/**
 * Điều hướng của bộ lọc danh mục chạy trong một transition dùng chung, để vùng kết quả
 * biết khi nào máy chủ còn đang dựng trang mới.
 */
const CatalogTransitionContext = React.createContext<{
  isPending: boolean
  navigate: (href: string) => void
} | null>(null)

export function CatalogTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const value = React.useMemo(
    () => ({
      isPending,
      // `scroll: false` để vị trí cuộn không nhảy trong lúc người dùng đang chọn bộ lọc
      navigate: (href: string) => startTransition(() => router.replace(href, { scroll: false })),
    }),
    [isPending, router],
  )

  return <CatalogTransitionContext.Provider value={value}>{children}</CatalogTransitionContext.Provider>
}

/** Đẩy một URL danh mục mới; ngoài provider thì vẫn điều hướng, chỉ không báo trạng thái chờ. */
export function useCatalogNavigate() {
  const context = React.useContext(CatalogTransitionContext)
  const router = useRouter()

  return React.useCallback(
    (href: string) => (context ? context.navigate(href) : router.replace(href, { scroll: false })),
    [context, router],
  )
}

/**
 * Vùng kết quả mờ đi khi đang chờ trang mới — MASTER §7.8.
 *
 * Chỉ mờ sau `--duration-continuity-delay`: phản hồi nhanh hơn thì người dùng không thấy gì
 * nháy lên. Khi có kết quả, vùng sáng lại ngay không chờ.
 */
export function CatalogResults({ children, className }: { children: React.ReactNode; className?: string }) {
  const isPending = React.useContext(CatalogTransitionContext)?.isPending ?? false

  return (
    <div
      aria-busy={isPending || undefined}
      className={cn(
        'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)]',
        'aria-busy:opacity-60 aria-busy:delay-[var(--duration-continuity-delay)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
