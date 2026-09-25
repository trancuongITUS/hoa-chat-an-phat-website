import { cn } from '@/lib/utils'

/**
 * Biểu tượng An Phát — lục giác benzen khoét hình giọt, mực chất lỏng màu cam.
 *
 * Hình học khớp với `docs/design-system/hoa-chat-an-phat/brand/logo/an-phat-symbol.svg`.
 * Giọt là phần khoét rỗng nên nền phía sau hiện qua; không dùng clipPath để hai logo
 * trên cùng trang (header và footer) không tranh nhau một id.
 *
 * `tone="dark"` dùng trên nền `primary-800` trở lên: lục giác trắng, mực đổi sang
 * `cta-400` (MASTER §2.2, ngoại lệ logo).
 */
const HEX_WITH_DROP =
  'M50 3 L90.7 26.5 L90.7 73.5 L50 97 L9.3 73.5 L9.3 26.5 Z ' +
  'M50 18 C50 18 29 42 29 57 C29 68.6 38.4 78 50 78 C61.6 78 71 68.6 71 57 C71 42 50 18 50 18 Z'

const LIQUID =
  'M29.01 56.21 C36.01 54.54 43 55.8 50 60 C56.59 63.95 63.19 65.3 69.79 64.04 ' +
  'C66.89 72.17 59.13 78 50 78 C38.4 78 29 68.6 29 57 C29 56.74 29 56.47 29.01 56.21 Z'

export function BrandMark({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const dark = tone === 'dark'
  return (
    <svg viewBox="0 0 100 100" className={cn('size-9 shrink-0', className)} aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        d={HEX_WITH_DROP}
        fill={dark ? 'var(--color-neutral-0)' : 'var(--color-primary-800)'}
      />
      <path d={LIQUID} fill={dark ? 'var(--color-cta-400)' : 'var(--color-cta-600)'} />
    </svg>
  )
}
