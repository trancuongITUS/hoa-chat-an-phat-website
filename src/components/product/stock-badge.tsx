import { AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react'

import { STOCK_STATUS } from '@/data/taxonomy'
import type { StockStatus } from '@/data/types'
import { cn } from '@/lib/utils'

const ICONS = {
  'check-circle-2': CheckCircle2,
  'alert-triangle': AlertTriangle,
  'alert-octagon': AlertOctagon,
} as const

/**
 * Chỉ báo tồn kho — màu luôn đi kèm icon và chữ (MASTER §2.4, §10).
 * Nêu rõ kho đang giữ hàng thay vì chỉ nói "Có sẵn" (MASTER §9).
 */
export function StockBadge({
  status,
  location,
  className,
}: {
  status: StockStatus
  location?: string
  className?: string
}) {
  const config = STOCK_STATUS[status]
  const Icon = ICONS[config.icon as keyof typeof ICONS]
  const label = location && status !== 'het-hang' ? `${config.label} tại ${location}` : config.label

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-caption font-semibold',
        config.bg,
        config.fg,
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </span>
  )
}
