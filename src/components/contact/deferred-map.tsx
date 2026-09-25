'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

import { PlaceholderImage } from '@/components/placeholder-image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Bản đồ nhúng sau tương tác — quote-contact.md §B3.
 *
 * Trước khi người dùng bấm, trang chỉ có một ảnh tĩnh: không iframe, không script bên thứ
 * ba, không cookie. `iframe` chỉ được tạo khi người dùng chủ động yêu cầu xem bản đồ.
 *
 * Trong lúc Google Maps tải, khung giữ nền xám kèm dòng "Đang tải bản đồ" (chỉ hiện nếu phải
 * chờ lâu hơn `--duration-continuity-delay`); tải xong thì bản đồ hiện dần đè lên.
 */
export function DeferredMap({ query, label }: { query: string; label: string }) {
  const [shown, setShown] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (shown) {
    return (
      <div
        aria-busy={!loaded || undefined}
        className="relative h-full min-h-80 w-full overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-100"
      >
        {loaded ? null : (
          <p className="continuity-delayed absolute inset-0 flex items-center justify-center gap-2 text-body-sm text-neutral-500">
            <MapPin className="size-5" aria-hidden="true" />
            Đang tải bản đồ…
          </p>
        )}
        <iframe
          title={`Bản đồ ${label}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          className={cn(
            'absolute inset-0 size-full',
            'transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out)]',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200">
      <PlaceholderImage label={`Ảnh tĩnh bản đồ ${label}`} ratio="16 / 9" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Button variant="primary" size="md" onClick={() => setShown(true)}>
          <MapPin aria-hidden="true" />
          Xem bản đồ
        </Button>
      </div>
    </div>
  )
}
