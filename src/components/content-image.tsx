import Image from 'next/image'

import { PlaceholderImage } from '@/components/placeholder-image'
import type { SiteImage } from '@/data/images'
import { cn } from '@/lib/utils'

/**
 * Ảnh nội dung trong khung tỉ lệ cố định — MASTER §8.
 *
 * Khung giữ `aspect-ratio` nên không gây layout shift; ảnh phủ kín khung bằng `object-cover`
 * và canh theo `image.position`. Chưa có ảnh thì hiện `PlaceholderImage` với cùng tỉ lệ, nên
 * nơi gọi không phải rẽ nhánh.
 */
export function ContentImage({
  image,
  label,
  ratio = '4 / 3',
  sizes,
  preload = false,
  decorative = false,
  tone,
  className,
}: {
  image?: SiteImage
  /** Mô tả ảnh cần đặt vào khi chưa có ảnh — chỉ dùng cho chỗ dành sẵn. */
  label: string
  /** `auto` để khung lấy chiều cao từ phần tử cha, như ảnh nền hero. */
  ratio?: string
  /** Bề rộng hiển thị theo breakpoint, để trình duyệt chọn đúng cỡ trong `srcset`. */
  sizes: string
  /** Ảnh LCP trong khung nhìn đầu (MASTER §8: ảnh hero preload). */
  preload?: boolean
  /** Ảnh chỉ để trang trí: `alt=""` để trình đọc màn hình bỏ qua. */
  decorative?: boolean
  tone?: 'light' | 'dark'
  className?: string
}) {
  if (!image) {
    return <PlaceholderImage label={label} ratio={ratio} tone={tone} className={className} />
  }

  return (
    <div
      style={ratio === 'auto' ? undefined : { aspectRatio: ratio }}
      className={cn('relative w-full overflow-hidden bg-neutral-100', className)}
    >
      <Image
        src={image.src}
        alt={decorative ? '' : image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </div>
  )
}
