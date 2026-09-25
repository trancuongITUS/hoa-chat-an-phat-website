'use client'

import { Download, Maximize2 } from 'lucide-react'

import { PlaceholderImage } from '@/components/placeholder-image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { Certificate } from '@/data/company'
import { cn } from '@/lib/utils'

/**
 * CertificateCard — about.md "Component riêng của trang", dùng lại ở trang chủ §6.
 *
 * Ảnh thu nhỏ bản scan tỉ lệ 3:4, bấm mở modal xem bản đầy đủ kèm nút tải PDF.
 * Modal do Radix xử lý bẫy tiêu điểm và đóng bằng `Esc` (MASTER §7.8).
 */
export function CertificateCard({ certificate, className }: { certificate: Certificate; className?: string }) {
  return (
    <Dialog>
      <article
        className={cn(
          'flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card shadow-sm',
          'transition-[box-shadow,translate] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          'hover:-translate-y-0.5 hover:shadow-md',
          className,
        )}
      >
        <DialogTrigger asChild>
          <button
            type="button"
            className="group relative block w-full cursor-pointer border-b border-neutral-200 text-left"
            aria-label={`Xem bản scan: ${certificate.name}`}
          >
            <PlaceholderImage label={certificate.scanLabel} ratio="3 / 4" />
            <span className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-neutral-0/90 text-primary-700 shadow-xs">
              <Maximize2 className="size-4" aria-hidden="true" />
            </span>
          </button>
        </DialogTrigger>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="text-h5 text-neutral-900">{certificate.name}</h3>
          <p className="text-body-sm text-neutral-500">{certificate.issuer}</p>
          <p className="text-caption text-neutral-500">
            Số hiệu <span className="tabular">{certificate.serial}</span>
          </p>
          <p className="mt-auto pt-2 text-caption text-neutral-700">{certificate.validity}</p>
        </div>
      </article>

      <DialogContent
        title={certificate.name}
        description={`${certificate.issuer} · Số hiệu ${certificate.serial} · ${certificate.validity}`}
      >
        <PlaceholderImage label={certificate.scanLabel} ratio="3 / 4" className="rounded-[var(--radius-md)]" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <a href="/tai-lieu/cq-mau.pdf" download>
              <Download aria-hidden="true" />
              Tải bản PDF
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
