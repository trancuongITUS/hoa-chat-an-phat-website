'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Sau khi chuyển trang, đưa tiêu điểm về vùng `main` (MASTER §10).
 *
 * Bỏ qua lần dựng đầu tiên: khi mới tải trang, tiêu điểm đang ở đầu tài liệu và việc
 * cưỡng bức lấy tiêu điểm sẽ cướp mất link "Bỏ qua tới nội dung chính".
 */
export function RouteFocus() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.getElementById('noi-dung-chinh')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}
