'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Input, Select, Textarea và khối Field — MASTER §7.2.
 *
 * Nhãn luôn hiển thị phía trên field, placeholder không bao giờ thay nhãn. Chiều cao
 * tối thiểu 44px và cỡ chữ 16px để iOS không tự phóng to khi focus. Lỗi nằm ngay dưới
 * field, có icon và `role="alert"`.
 */
const controlBase = [
  'w-full rounded-[var(--radius-md)] border bg-card text-foreground',
  'text-[16px] leading-6 placeholder:text-neutral-500',
  'transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
  'focus-visible:outline-none focus-visible:border-primary-600 focus-visible:shadow-[0_0_0_3px_rgb(29_90_151_/_0.18)]',
  'disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70',
].join(' ')

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'h-11 px-3',
        invalid ? 'border-danger' : 'border-neutral-400',
        className,
      )}
      {...props}
    />
  )
})

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'min-h-11 px-3 py-2.5 resize-y',
        invalid ? 'border-danger' : 'border-neutral-400',
        className,
      )}
      {...props}
    />
  )
})

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, invalid, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'h-11 px-3 pr-9 appearance-none cursor-pointer',
        // Mũi tên vẽ bằng gradient để không phải nạp thêm ảnh
        'bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)]',
        'bg-[length:6px_6px,6px_6px] bg-[position:calc(100%-18px)_calc(50%+1px),calc(100%-12px)_calc(50%+1px)] bg-no-repeat',
        invalid ? 'border-danger' : 'border-neutral-400',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})

interface FieldProps {
  id: string
  label: string
  /** Hiển thị dấu `*` và thêm "bắt buộc" vào nhãn đọc cho trình đọc màn hình. */
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: (props: {
    id: string
    'aria-describedby': string | undefined
    invalid: boolean
    required: boolean
  }) => React.ReactNode
}

export function Field({ id, label, required = false, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-label text-neutral-700">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-danger"> *</span>
            <span className="sr-only"> (bắt buộc)</span>
          </>
        ) : null}
      </label>

      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error), required })}

      {hint ? (
        <p id={hintId} className="text-caption text-neutral-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="animate-attention-in flex items-start gap-1.5 text-caption text-danger">
          <AlertCircle className="mt-px size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
