import type { SpecRow } from '@/data/types'
import { cn } from '@/lib/utils'

/**
 * SpecTable — MASTER §7.5.
 *
 * Trên `sm` trở lên là bảng hai cột, hàng chẵn nền `neutral-100`, chỉ kẻ ngang.
 * Dưới `sm` chuyển thành danh sách định nghĩa xếp dọc — tuyệt đối không cuộn ngang.
 * Giá trị luôn dùng chữ số tabular để cột số không nhảy.
 */
export function SpecTable({
  rows,
  caption,
  className,
}: {
  rows: SpecRow[]
  caption?: string
  className?: string
}) {
  return (
    <div className={className}>
      {/* Bảng cho màn hình từ 640px */}
      <table className="hidden w-full border-collapse text-left sm:table">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={cn('border-b border-neutral-200', index % 2 === 1 && 'bg-neutral-100')}
            >
              <th scope="row" className="w-2/5 px-4 py-3 align-top text-label font-medium text-neutral-500">
                {row.label}
              </th>
              <td className="px-4 py-3 align-top text-body text-neutral-900 tabular">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Danh sách định nghĩa cho mobile */}
      <dl className="sm:hidden">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={cn('border-b border-neutral-200 px-4 py-3', index % 2 === 1 && 'bg-neutral-100')}
          >
            <dt className="text-label text-neutral-500">{row.label}</dt>
            <dd className="mt-0.5 text-body text-neutral-900 tabular">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
