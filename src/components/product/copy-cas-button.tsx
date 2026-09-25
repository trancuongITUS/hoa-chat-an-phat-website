'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Nút sao chép số CAS — products.md §B "Ghi đè component".
 *
 * Phản hồi bằng toast và đổi icon sang `check` trong 2 giây. Khi trình duyệt không cho
 * dùng clipboard (ngữ cảnh không bảo mật, người dùng từ chối), báo lỗi thật thay vì giả
 * vờ đã sao chép.
 */
export function CopyCasButton({ cas }: { cas: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cas)
      setCopied(true)
      toast.success(`Đã sao chép số CAS ${cas}`)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Trình duyệt không cho phép sao chép tự động', {
        description: `Bạn có thể bôi đen và sao chép thủ công: ${cas}`,
      })
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Sao chép số CAS ${cas}`}
      className="inline-flex size-11 cursor-pointer sm:size-9 items-center justify-center rounded-[var(--radius-sm)] text-neutral-500 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100 hover:text-primary-700"
    >
      {copied ? (
        <Check className="size-4 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
