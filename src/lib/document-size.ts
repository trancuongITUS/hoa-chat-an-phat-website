import { statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Dung lượng tài liệu đọc trực tiếp từ tệp trong `public/`.
 *
 * MASTER §7.6 bắt buộc nêu dung lượng trước khi tải. Đọc từ tệp thật thay vì ghi số
 * vào dữ liệu để nhãn không bao giờ lệch với tệp người dùng nhận được.
 *
 * Chỉ dùng trong Server Component — module này gọi `node:fs`.
 */
const cache = new Map<string, string>()

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0).replace('.', ',')} KB`
  return `${(kb / 1024).toFixed(1).replace('.', ',')} MB`
}

export function documentSize(href: string): string | null {
  const cached = cache.get(href)
  if (cached) return cached

  try {
    const bytes = statSync(join(process.cwd(), 'public', href)).size
    const label = formatSize(bytes)
    cache.set(href, label)
    return label
  } catch {
    // Tệp chưa tồn tại: trả null để giao diện ẩn phần dung lượng thay vì bịa số.
    return null
  }
}
