'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Modal và Drawer — MASTER §7.8.
 *
 * Radix lo phần bẫy tiêu điểm, đóng bằng `Esc` và khoá cuộn nền. Phần tạo hình lấy token
 * của hệ: modal `radius-xl` + `shadow-xl`, nền phủ `rgb(12 22 34 / .55)` có blur 4px.
 * Thời lượng và easing lấy từ token §5: vào `duration-slow` + `ease-out`, thoát
 * `duration-exit` + `ease-in`. Modal chỉ thu phóng 2% để nằm trong giới hạn biên độ.
 */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

/** Chiều vào và chiều ra dùng chung cho overlay, modal và drawer. */
const enterClasses =
  'data-[state=open]:animate-in data-[state=open]:duration-[var(--duration-slow)] data-[state=open]:ease-[var(--ease-out)]'
const exitClasses =
  'data-[state=closed]:animate-out data-[state=closed]:duration-[var(--duration-exit)] data-[state=closed]:ease-[var(--ease-in)]'

const overlayClasses = cn(
  'fixed inset-0 z-30 bg-[rgb(12_22_34_/_0.55)] backdrop-blur-[4px]',
  enterClasses,
  exitClasses,
  'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
)

function CloseButton({ label }: { label: string }) {
  return (
    <DialogPrimitive.Close
      aria-label={label}
      className={cn(
        'absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-[var(--radius-md)]',
        'text-neutral-700 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100',
      )}
    >
      <X className="size-5" aria-hidden="true" />
    </DialogPrimitive.Close>
  )
}

export function DialogContent({
  children,
  className,
  title,
  description,
  closeLabel = 'Đóng',
}: {
  children: React.ReactNode
  className?: string
  title: string
  /** Mô tả ngắn cho trình đọc màn hình; không bắt buộc hiển thị. */
  description?: string
  closeLabel?: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClasses} />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-32px)] max-w-2xl -translate-x-1/2 -translate-y-1/2',
          'max-h-[calc(100dvh-64px)] overflow-y-auto rounded-[var(--radius-xl)] bg-popover p-6 shadow-xl',
          enterClasses,
          exitClasses,
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-98',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-98',
          className,
        )}
      >
        <DialogPrimitive.Title className="text-h3 pr-12 text-neutral-900">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-1 text-body-sm text-neutral-500">
            {description}
          </DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
        <CloseButton label={closeLabel} />
        <div className="mt-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

/** Drawer trượt từ cạnh màn hình — dùng cho menu mobile và bộ lọc trên tablet. */
export function DrawerContent({
  children,
  className,
  title,
  side = 'right',
  closeLabel = 'Đóng',
  footer,
}: {
  children: React.ReactNode
  className?: string
  title: string
  side?: 'left' | 'right'
  closeLabel?: string
  footer?: React.ReactNode
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClasses} />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-40 flex w-[min(400px,calc(100vw-48px))] flex-col bg-card shadow-xl',
          side === 'right' ? 'right-0' : 'left-0',
          enterClasses,
          exitClasses,
          side === 'right'
            ? 'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'
            : 'data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <DialogPrimitive.Title className="text-h5 text-neutral-900">{title}</DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[var(--radius-md)] text-neutral-700 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </div>
        <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>

        {footer ? <div className="border-t border-neutral-200 p-4">{footer}</div> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
