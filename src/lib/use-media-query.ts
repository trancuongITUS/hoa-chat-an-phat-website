'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Đọc một media query như một nguồn dữ liệu bên ngoài.
 *
 * Dùng `useSyncExternalStore` thay vì `useState` + `useEffect`: React nhận đúng giá trị
 * ngay ở lần dựng đầu trên trình duyệt, không tạo thêm một vòng render phụ, và ảnh chụp
 * phía máy chủ luôn xác định.
 */
export function useMediaQuery(query: string, serverSnapshot = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  )
}

/**
 * MASTER §5: khi người dùng bật giảm chuyển động, mọi transform và stagger phải tắt.
 *
 * Ảnh chụp phía máy chủ trả `true` một cách có chủ ý — HTML dựng sẵn luôn là bản không
 * chuyển động, hiển thị đủ nội dung kể cả khi JavaScript không chạy.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true)
}
