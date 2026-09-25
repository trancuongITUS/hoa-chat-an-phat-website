import { AlertTriangle, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Khối chèn cảnh báo và ghi chú kỹ thuật — news.md "Khối chèn trong bài",
 * dùng lại cho khối bảo quản an toàn ở trang chi tiết sản phẩm.
 *
 * Màu đi kèm icon và tiêu đề chữ, không bao giờ chỉ dùng màu (MASTER §10).
 */
export function Callout({
  tone,
  title,
  children,
  className,
}: {
  tone: 'safety' | 'tech'
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const isSafety = tone === 'safety'
  const Icon = isSafety ? AlertTriangle : Info

  return (
    <aside
      className={cn(
        'flex gap-3 rounded-[var(--radius-lg)] border-l-4 p-4',
        isSafety ? 'border-warning bg-warning-bg' : 'border-info bg-info-bg',
        className,
      )}
    >
      <Icon
        className={cn('mt-0.5 size-5 shrink-0', isSafety ? 'text-warning' : 'text-info')}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className={cn('text-label', isSafety ? 'text-warning' : 'text-info')}>
          {title ?? (isSafety ? 'Lưu ý an toàn' : 'Ghi chú kỹ thuật')}
        </p>
        <div className="text-body-sm mt-1 text-neutral-900">{children}</div>
      </div>
    </aside>
  )
}
