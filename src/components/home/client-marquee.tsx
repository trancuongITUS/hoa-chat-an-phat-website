import Image from 'next/image'

import type { ClientLogo } from '@/data/types'
import { cn } from '@/lib/utils'

/** Nhịp chạy tính theo số logo để tốc độ trên màn hình không đổi khi danh sách dài ra. */
const SECONDS_PER_LOGO = 5.5

/**
 * Dải khách hàng tiêu biểu chạy ngang liên tục theo một chiều (phải sang trái).
 *
 * Danh sách được lặp hai lần, track dịch đúng -50% nên vòng lặp nối liền không giật.
 * Bản lặp mang `aria-hidden` để trình đọc màn hình chỉ đọc một lần. Dải dừng khi rê
 * chuột hoặc chạm giữ (MASTER §5). Với `prefers-reduced-motion: reduce`, dải đứng yên
 * và xuống dòng như lưới thường.
 *
 * Logo hiển thị đơn sắc xám, rê chuột vào từng logo thì hiện màu gốc (home.md §7).
 */
export function ClientMarquee({ items }: { items: readonly ClientLogo[] }) {
  return (
    <div className="marquee-viewport">
      <div
        className="marquee-track"
        style={{ '--marquee-duration': `${items.length * SECONDS_PER_LOGO}s` } as React.CSSProperties}
      >
        <LogoList items={items} />
        <LogoList items={items} duplicate />
      </div>
    </div>
  )
}

function LogoList({ items, duplicate = false }: { items: readonly ClientLogo[]; duplicate?: boolean }) {
  return (
    <ul className={cn('marquee-list', duplicate && 'marquee-duplicate')} aria-hidden={duplicate || undefined}>
      {items.map((client) => (
        <li key={client.src} className="flex h-24 w-44 shrink-0 items-center justify-center px-3 sm:w-52">
          {/* SVG không cần tối ưu qua image loader; tắt hẳn để khỏi phải bật dangerouslyAllowSVG. */}
          <Image
            src={client.src}
            alt={duplicate ? '' : client.name}
            width={240}
            height={80}
            unoptimized
            className={cn(
              'h-auto w-full max-w-44 opacity-60 grayscale',
              'transition-[filter,opacity] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
              'hover:opacity-100 hover:grayscale-0',
            )}
          />
        </li>
      ))}
    </ul>
  )
}
