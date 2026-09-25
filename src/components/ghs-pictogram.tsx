import type { GhsCode } from '@/data/types'
import { cn } from '@/lib/utils'

/**
 * Pictogram GHS — hình thoi viền đỏ theo chuẩn GHS Rev.10.
 *
 * MASTER §8 yêu cầu giữ nguyên hình thoi viền đỏ và không đổi màu viền. Đây là bản dựng
 * vector của bộ ký hiệu UN; khi có tệp SVG chính thức, thay nội dung `SYMBOLS` bên dưới
 * là đủ — mọi nơi dùng pictogram đều đi qua component này.
 *
 * Pictogram luôn đi kèm nhãn chữ (xem `HazardChip`), không bao giờ đứng một mình để
 * truyền đạt mức độ nguy hại.
 */
const SYMBOLS: Record<GhsCode, React.ReactNode> = {
  // Quả bom đang nổ
  GHS01: (
    <g>
      <circle cx="47" cy="58" r="16" />
      <path d="M47 34 L43 20 L51 26 L56 14 L57 28 L66 22 L60 34 Z" />
      <path d="M63 40 L74 30 M66 48 L80 44 M30 40 L20 31 M28 50 L15 47 M36 74 L28 86 M58 74 L66 86" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  ),
  // Ngọn lửa
  GHS02: (
    <g>
      <path d="M50 16 C54 30 66 34 66 48 C66 58 60 64 56 68 C58 60 54 54 49 50 C50 58 44 62 42 68 C40 62 36 58 36 50 C36 38 48 32 50 16 Z" />
      <path d="M26 82 H74" strokeWidth="6" strokeLinecap="round" />
    </g>
  ),
  // Ngọn lửa trên vòng tròn
  GHS03: (
    <g>
      <path d="M50 14 C54 26 64 30 64 42 C64 50 59 55 55 58 C57 51 53 46 49 43 C50 50 45 53 43 58 C41 53 38 50 38 43 C38 33 48 27 50 14 Z" />
      <circle cx="50" cy="64" r="14" fill="none" strokeWidth="5" />
      <path d="M26 82 H74" strokeWidth="6" strokeLinecap="round" />
    </g>
  ),
  // Bình khí nén
  GHS04: (
    <g>
      <path d="M44 16 h12 v8 h4 v10 a10 10 0 0 1 4 8 v40 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 v-40 a10 10 0 0 1 4 -8 v-10 h4 z" />
      <path d="M40 46 h20" strokeWidth="4" stroke="#fff" fill="none" />
    </g>
  ),
  // Ăn mòn: hai bề mặt bị ăn mòn bởi giọt hoá chất
  GHS05: (
    <g>
      <path d="M14 20 h22 v14 l-8 10 h-6 l-8 -10 z" />
      <path d="M20 50 l-6 30 h34 l-10 -30 z" />
      <path d="M62 20 h22 v14 l-8 10 h-6 l-8 -10 z" />
      <path d="M58 52 c10 -4 22 -4 30 0 l-4 6 c-8 -3 -16 -3 -22 0 z" />
      <path d="M56 62 h34 v6 h-34 z" />
      <path d="M62 74 l-4 8 M74 74 l0 8 M86 74 l4 8" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  ),
  // Đầu lâu xương chéo
  GHS06: (
    <g>
      <path d="M28 76 L72 40 M28 40 L72 76" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="40" r="6" />
      <circle cx="28" cy="76" r="6" />
      <circle cx="72" cy="40" r="6" />
      <circle cx="72" cy="76" r="6" />
      <path d="M50 18 c-14 0 -24 10 -24 24 c0 9 5 15 10 19 v9 h28 v-9 c5 -4 10 -10 10 -19 c0 -14 -10 -24 -24 -24 z" />
      <circle cx="41" cy="42" r="6" fill="#fff" />
      <circle cx="59" cy="42" r="6" fill="#fff" />
      <path d="M46 56 h8 l-4 -8 z" fill="#fff" />
    </g>
  ),
  // Dấu chấm than
  GHS07: (
    <g>
      <path d="M44 22 h12 l-3 38 h-6 z" />
      <circle cx="50" cy="74" r="7" />
    </g>
  ),
  // Nguy hại sức khoẻ: thân người với vệt lan trên ngực
  GHS08: (
    <g>
      <circle cx="50" cy="24" r="10" />
      <path d="M32 40 h36 v30 c0 8 -4 14 -8 18 h-20 c-4 -4 -8 -10 -8 -18 z" />
      <path d="M50 44 L57 52 L67 50 L61 58 L68 66 L57 64 L50 74 L43 64 L32 66 L39 58 L33 50 L43 52 Z" fill="#fff" />
    </g>
  ),
  // Nguy hại môi trường: cây chết và cá chết
  GHS09: (
    <g>
      <path d="M16 22 l8 18 h-5 l7 14 h-4 l6 12 h-18 l6 -12 h-4 l7 -14 h-5 z" />
      <path d="M22 66 h4 v14 h-4 z" />
      <path d="M52 44 c14 0 24 8 30 16 c-6 8 -16 16 -30 16 c-12 0 -20 -6 -24 -12 l-10 8 v-24 l10 8 c4 -6 12 -12 24 -12 z" />
      <path d="M66 54 L74 62 M74 54 L66 62" strokeWidth="4" stroke="#fff" strokeLinecap="round" fill="none" />
      <path d="M14 84 h72" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  ),
}

interface GhsPictogramProps {
  code: GhsCode
  /** Cạnh của pictogram tính bằng px. Mặc định 16 để dùng trong chip. */
  size?: number
  className?: string
}

export function GhsPictogram({ code, size = 16, className }: GhsPictogramProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
    >
      <path d="M50 3 L97 50 L50 97 L3 50 Z" fill="#fff" stroke="var(--color-ghs-frame)" strokeWidth="8" />
      <g fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="0">
        {SYMBOLS[code]}
      </g>
    </svg>
  )
}
