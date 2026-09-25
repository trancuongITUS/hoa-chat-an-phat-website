import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Thang chữ của MASTER §3.2 được khai báo thành class `text-*` trong `globals.css`.
 *
 * Mặc định `tailwind-merge` xếp mọi `text-<tên lạ>` vào nhóm màu chữ, nên `text-label` và
 * `text-on-dark` bị coi là xung khắc và class đứng trước bị loại — nút trên nền tối mất
 * luôn màu chữ. Khai báo rõ nhóm cỡ chữ để hai nhóm này không giẫm lên nhau.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'body-lg',
            'body',
            'body-sm',
            'label',
            'caption',
            'overline',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Định dạng số theo chuẩn Việt Nam, dùng kèm class `tabular`. */
export function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

/** Ngày dạng dd/mm/yyyy — dùng kèm class `tabular`. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** Nhãn ngày đầy đủ cho phần đọc bằng trình đọc màn hình. */
export function formatDateLong(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(iso))
}

/**
 * Stagger cho `.animate-rise-in` — thời lượng lấy từ token `--stagger` (MASTER §5).
 *
 * Chặn ở mục thứ 9 để tổng độ trễ của cả lưới không vượt ~500ms: quá mức đó mục cuối vẫn
 * đang chờ trong khi người dùng đã bắt đầu đọc mục đầu.
 */
export function staggerStyle(index: number) {
  return { '--stagger-index': Math.min(index, 8) } as React.CSSProperties
}
