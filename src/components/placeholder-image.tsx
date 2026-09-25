import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Chỗ dành sẵn cho ảnh thật.
 *
 * Dùng cho những vị trí chưa có ảnh dùng được: bản scan chứng nhận, ảnh tĩnh bản đồ và các
 * sản phẩm chưa có ảnh đúng. Component giữ đúng tỉ lệ khung ảnh nên không gây layout shift,
 * và nêu rõ ảnh nào cần thay vào vị trí đó.
 *
 * Nơi hiển thị ảnh nội dung gọi `ContentImage`; component đó tự rơi về đây khi
 * `src/data/images.ts` chưa có ảnh cho vị trí tương ứng.
 */
export function PlaceholderImage({
  label,
  ratio = '4 / 3',
  className,
  tone = 'light',
}: {
  /** Mô tả ảnh cần đặt vào đây; cũng là nội dung `alt` khi thay bằng ảnh thật. */
  label: string
  ratio?: string
  className?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <div
      role="img"
      aria-label={`Chỗ dành cho ảnh: ${label}`}
      style={{ aspectRatio: ratio }}
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden p-4 text-center',
        tone === 'dark'
          ? 'bg-primary-950 text-on-dark-muted'
          : 'bg-neutral-100 text-neutral-500',
        className,
      )}
    >
      {/* Vân chéo công nghiệp, đủ nhẹ để không tranh chấp với nội dung xung quanh */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 opacity-60',
          tone === 'dark'
            ? 'bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgb(255_255_255/0.04)_10px_20px)]'
            : 'bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgb(15_29_46/0.035)_10px_20px)]',
        )}
      />
      <ImageOff className="relative size-6 shrink-0" aria-hidden="true" />
      <span className="relative text-caption">{label}</span>
      <span
        className={cn(
          'relative rounded-full px-2 py-0.5 text-caption font-semibold',
          tone === 'dark' ? 'bg-primary-800 text-on-dark' : 'bg-neutral-200 text-neutral-700',
        )}
      >
        Ảnh mẫu
      </span>
    </div>
  )
}
