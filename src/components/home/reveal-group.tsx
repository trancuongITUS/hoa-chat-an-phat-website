'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Danh sách chỉ chạy hiệu ứng `animate-rise-in` của các mục con khi vào khung nhìn, một lần.
 *
 * Lưới ở trang chủ nằm dưới màn hình đầu; nếu chạy ngay lúc tải trang thì hiệu ứng đã xong
 * trước khi người dùng cuộn tới. `globals.css` tạm dừng animation khi `data-reveal="pending"`,
 * và chỉ tạm dừng khi trình duyệt chạy script, nên HTML dựng sẵn luôn hiện đủ nội dung.
 */
export function RevealGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <ul ref={ref} data-reveal={revealed ? 'done' : 'pending'} className={className}>
      {children}
    </ul>
  )
}
