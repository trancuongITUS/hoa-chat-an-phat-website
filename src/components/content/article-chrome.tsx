'use client'

import { useEffect, useRef, useState } from 'react'
import { Link2, MessageCircle, Share2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

/**
 * Thanh tiến trình đọc — news.md §B, 2px `primary-600`, dính sát dưới header.
 * Chỉ animate `transform`, không animate `width` (MASTER §5).
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  // Ghi thẳng `transform` vào DOM thay vì qua state: sự kiện cuộn bắn hàng chục lần mỗi
  // giây, đi qua state thì React phải render lại component ở từng lần.
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="sticky top-15 z-10 h-0.5 bg-neutral-200 lg:top-18" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left bg-primary-600" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

/**
 * Mục lục dính ở cột trái từ `xl` — mục đang đọc đánh dấu bằng thanh dọc 2px
 * **và** chữ đậm, không chỉ bằng màu (news.md §B).
 */
export function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Bù chiều cao header dính để mục được tô sáng khớp với phần đang đọc
      { rootMargin: '-100px 0px -60% 0px' },
    )

    for (const heading of headings) {
      const node = document.getElementById(heading.id)
      if (node) observer.observe(node)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Mục lục bài viết" className="sticky top-24">
      <p className="text-overline mb-3 text-neutral-500">Nội dung bài</p>
      <ul className="flex flex-col">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'block border-l-2 py-1.5 pl-3 text-body-sm transition-colors duration-[var(--duration-fast)]',
                  active
                    ? 'border-primary-600 font-semibold text-primary-700'
                    : 'border-neutral-200 text-neutral-500 hover:text-neutral-900',
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Nút chia sẻ — news.md "Cuối bài".
 *
 * `url` là địa chỉ chuẩn tắc do máy chủ dựng, không đọc từ `window.location`: link chia sẻ
 * phải trỏ tới địa chỉ công khai của bài, kể cả khi trang đang mở qua tên miền xem thử.
 *
 * Link chia sẻ Zalo là loại công khai, không phụ thuộc Zalo OA. Đây là ngoại lệ duy nhất
 * được phép nhắc tới Zalo khi công ty chưa có kênh vận hành; tuyệt đối không có nút
 * "Chat Zalo" ở bất kỳ đâu khác.
 */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Đã sao chép liên kết bài viết')
    } catch {
      toast.error('Trình duyệt không cho phép sao chép tự động', {
        description: 'Bạn có thể sao chép liên kết trên thanh địa chỉ.',
      })
    }
  }

  const encoded = encodeURIComponent(url)
  const linkClasses =
    'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-neutral-400 px-4 text-label text-primary-700 transition-colors duration-[var(--duration-fast)] hover:bg-primary-50'

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        <Share2 className="size-4" aria-hidden="true" />
        Facebook
        <span className="sr-only">— mở tab mới để chia sẻ {title}</span>
      </a>

      <a
        href={`https://zalo.me/share/link?u=${encoded}&t=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Zalo
        <span className="sr-only">— mở tab mới để chia sẻ {title}</span>
      </a>

      <button type="button" onClick={copyLink} className={linkClasses}>
        <Link2 className="size-4" aria-hidden="true" />
        Sao chép liên kết
      </button>
    </div>
  )
}
