import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Button — MASTER §7.1.
 *
 * Biến thể `cta` chỉ dành cho hành động chuyển đổi "Yêu cầu báo giá" và tối đa một nút
 * trên mỗi khung nhìn. Trên nền tối (`primary-800/900`) phải dùng `ctaOnDark`: `cta-600`
 * chỉ đạt 2,35:1 so với nền tối nên viền nút gần như tan vào nền.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'text-label font-semibold cursor-pointer select-none',
    'rounded-[var(--radius-md)] transition-[background-color,border-color,color,box-shadow,scale]',
    'duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
    'active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        cta: 'bg-cta-600 text-neutral-0 shadow-xs hover:bg-cta-700',
        ctaOnDark: 'bg-cta-400 text-ink shadow-xs hover:bg-cta-hover-dark',
        primary: 'bg-primary-600 text-neutral-0 shadow-xs hover:bg-primary-700',
        outline:
          'border border-neutral-400 bg-transparent text-primary-700 hover:bg-primary-50 hover:border-primary-600',
        outlineOnDark:
          'border border-primary-300 bg-transparent text-on-dark hover:bg-primary-800',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
        destructive: 'bg-danger text-neutral-0 shadow-xs hover:bg-[color-mix(in_srgb,var(--color-danger)_85%,black)]',
      },
      size: {
        // MASTER §7.1: trên mobile mọi nút tối thiểu 44×44px, nên `sm` chỉ co lại
        // xuống 36px từ breakpoint `sm` trở lên.
        sm: 'h-11 px-4 sm:h-9 [&_svg]:size-4',
        md: 'h-11 px-6 [&_svg]:size-5',
        lg: 'h-13 px-8 text-body [&_svg]:size-5',
        /** Nút chỉ có icon — bắt buộc kèm `aria-label` (MASTER §8). */
        icon: 'size-11 p-0 [&_svg]:size-5',
        iconSm: 'size-11 sm:size-9 p-0 [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Khoá nút, hiện spinner và đặt `aria-busy`; chiều rộng nút giữ nguyên. */
  loading?: boolean
  /** Nhãn đọc cho trình đọc màn hình khi đang tải. */
  loadingLabel?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, loading = false, loadingLabel = 'Đang xử lý', children, disabled, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'

  if (asChild) {
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </Comp>
    )
  }

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        // Xếp chồng spinner lên nhãn ẩn để chiều rộng nút không đổi khi đang tải
        <span className="grid place-items-center">
          <span aria-hidden="true" className="invisible col-start-1 row-start-1 inline-flex items-center gap-2">
            {children}
          </span>
          <Loader2 className="col-start-1 row-start-1 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingLabel}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
})

export { buttonVariants }
