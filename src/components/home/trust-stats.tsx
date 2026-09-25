'use client'

import { useEffect, useRef, useState } from 'react'

import { TRUST_STATS } from '@/data/company'
import { usePrefersReducedMotion } from '@/lib/use-media-query'
import { formatNumber } from '@/lib/utils'

/**
 * Dải tin cậy — home.md §2.
 *
 * Số đếm lên trong 600ms khi khối vào khung nhìn, chỉ chạy một lần. Với
 * `prefers-reduced-motion: reduce`, số hiện thẳng giá trị cuối và không có animation nào.
 *
 * HTML dựng sẵn luôn chứa giá trị cuối, nên khi JavaScript không chạy người đọc vẫn thấy
 * đúng số liệu (MASTER §5).
 */
const DURATION = 600

function Stat({
  value,
  suffix,
  label,
  start,
  reducedMotion,
}: {
  value: number
  suffix: string
  label: string
  start: boolean
  reducedMotion: boolean
}) {
  const [counted, setCounted] = useState(0)

  useEffect(() => {
    if (!start || reducedMotion) return

    let frame = 0
    const begin = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - begin) / DURATION, 1)
      // Easing out: nhanh lúc đầu, dừng êm ở giá trị cuối
      setCounted(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, reducedMotion, value])

  // Giảm chuyển động (kể cả HTML dựng sẵn, vì ảnh chụp máy chủ coi là giảm chuyển động):
  // hiện thẳng giá trị cuối. Có chuyển động: giữ ở 0 tới khi vào khung nhìn rồi mới đếm,
  // tránh cảnh số cuối hiện ra trước rồi tụt về 0.
  const display = reducedMotion ? value : start ? counted : 0

  return (
    <div className="flex flex-col gap-1 px-2 py-4 text-center sm:px-4">
      <span className="text-h2 tabular text-primary-700">
        {formatNumber(display)}
        {suffix}
      </span>
      <span className="text-body-sm text-neutral-500">{label}</span>
    </div>
  )
}

export function TrustStats() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reducedMotion) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 divide-neutral-200 rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-0 shadow-sm sm:divide-x lg:grid-cols-4"
    >
      {TRUST_STATS.map((stat) => (
        <Stat
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          start={visible}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}
