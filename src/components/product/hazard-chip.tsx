import { ShieldCheck } from 'lucide-react'

import { GhsPictogram } from '@/components/ghs-pictogram'
import { GHS_CLASSES } from '@/data/taxonomy'
import type { GhsCode } from '@/data/types'
import { cn } from '@/lib/utils'

/**
 * HazardChip — MASTER §7.3.
 *
 * Chip bo tròn hoàn toàn, cao 24px, luôn gồm pictogram GHS và tên phân loại tiếng Việt.
 * Màu không bao giờ là phương tiện truyền đạt duy nhất (MASTER §10).
 */
export function HazardChip({ code, className }: { code: GhsCode; className?: string }) {
  const hazard = GHS_CLASSES[code]

  return (
    <span
      title={hazard.description}
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-caption font-semibold',
        hazard.bg,
        hazard.fg,
        className,
      )}
    >
      <GhsPictogram code={code} size={16} />
      {hazard.name}
    </span>
  )
}

/** Hàng chip cho một sản phẩm; nêu rõ khi hoá chất không thuộc phân loại nguy hại nào. */
export function HazardChipRow({ codes, className }: { codes: GhsCode[]; className?: string }) {
  if (codes.length === 0) {
    return (
      <span
        title="Không thuộc phân loại nguy hại nào theo hệ thống GHS"
        className={cn(
          'inline-flex h-6 items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 text-caption font-semibold text-neutral-700',
          className,
        )}
      >
        <ShieldCheck className="size-4" aria-hidden="true" />
        Không phân loại nguy hại
      </span>
    )
  }

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {codes.map((code) => (
        <li key={code}>
          <HazardChip code={code} />
        </li>
      ))}
    </ul>
  )
}
