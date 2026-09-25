import { cn } from '@/lib/utils'

/**
 * Dải khách hàng tiêu biểu chạy ngang liên tục theo một chiều (phải sang trái).
 *
 * Danh sách được lặp hai lần, track dịch đúng -50% nên vòng lặp nối liền không giật.
 * Bản lặp mang `aria-hidden` để trình đọc màn hình chỉ đọc một lần. Dải dừng khi rê
 * chuột hoặc chạm giữ (MASTER §5). Với `prefers-reduced-motion: reduce`, dải đứng yên
 * và xuống dòng như lưới thường.
 */
export function ClientMarquee({ items }: { items: readonly string[] }) {
  return (
    <div className="marquee-viewport">
      <div className="marquee-track">
        <LogoList items={items} />
        <LogoList items={items} duplicate />
      </div>
    </div>
  )
}

function LogoList({ items, duplicate = false }: { items: readonly string[]; duplicate?: boolean }) {
  return (
    <ul className={cn('marquee-list', duplicate && 'marquee-duplicate')} aria-hidden={duplicate || undefined}>
      {items.map((label) => (
        <li key={label} className="w-44 shrink-0 sm:w-52">
          <div className="flex h-24 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-neutral-300 bg-neutral-0 px-3 text-center text-caption text-neutral-500">
            {label}
          </div>
        </li>
      ))}
    </ul>
  )
}
