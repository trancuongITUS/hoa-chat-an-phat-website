'use client'

import { useEffect, useState } from 'react'
import { Toaster as SonnerToaster } from 'sonner'

/**
 * Toast — MASTER §7.8.
 *
 * Góc dưới phải trên desktop, trên cùng trên mobile, tự tắt sau 4 giây, `aria-live`
 * lịch sự và không cướp tiêu điểm.
 */
export function Toaster() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(width < 640px)')
    const sync = () => setIsMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <SonnerToaster
      position={isMobile ? 'top-center' : 'bottom-right'}
      duration={4000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            'rounded-[var(--radius-lg)] border border-neutral-200 bg-card text-body-sm text-neutral-900 shadow-lg',
          description: 'text-caption text-neutral-500',
          actionButton:
            'rounded-[var(--radius-sm)] bg-primary-600 px-2 py-1 text-caption font-semibold text-neutral-0 cursor-pointer',
          closeButton: 'border-neutral-200 bg-card text-neutral-700 cursor-pointer',
        },
      }}
    />
  )
}
