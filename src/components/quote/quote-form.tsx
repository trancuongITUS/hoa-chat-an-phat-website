'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, Plus, Printer, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { COMPANY } from '@/data/company'
import type { Product } from '@/data/types'
import {
  clearDraft,
  DELIVERY_MODES,
  EMPTY_LINE,
  EMPTY_REQUEST,
  FIELD_LABELS,
  formatRequestText,
  loadDraft,
  MAX_LINES,
  quoteRequestSchema,
  saveDraft,
  submitQuoteRequest,
  UNITS,
  type QuoteLine,
  type QuoteRequest,
} from '@/lib/rfq'
import { useMediaQuery } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Form yêu cầu báo giá — `pages/quote-contact.md` §A.
 *
 * Một trang, ba nhóm trường, không có luồng nhiều bước. Validate khi `blur`, không validate
 * theo từng phím gõ. Chiều cao input tối thiểu 48px trên trang này, cao hơn mặc định 44px
 * của MASTER, để giảm sai sót khi nhập trên điện thoại ngoài công trường.
 */
type FieldErrors = Record<string, string>

/** Phần dữ liệu sản phẩm form cần: gợi ý tên và điền sẵn quy cách khi đến từ trang chi tiết. */
export type QuoteProductOption = Pick<Product, 'slug' | 'name' | 'chemicalName' | 'cas' | 'packaging'>

const CONTROL_HEIGHT = 'h-12 min-h-12'
const DATALIST_ID = 'goi-y-hoa-chat'

/**
 * Mỗi dòng mang một khoá ổn định chỉ dùng trong form. Dùng chỉ số làm key thì khi xoá một
 * dòng, React tái dùng DOM của dòng bên dưới và hiệu ứng thu lại chạy nhầm chỗ.
 */
type FormLine = QuoteLine & { key: string }
type FormRequest = Omit<QuoteRequest, 'lines'> & { lines: FormLine[] }

let lineKeySeed = 0
const nextLineKey = () => `dong-${++lineKeySeed}`

const withLineKeys = (value: QuoteRequest): FormRequest => ({
  ...value,
  lines: value.lines.map((line) => ({ ...line, key: nextLineKey() })),
})

/** Bỏ khoá nội bộ trước khi lưu nháp hoặc gửi đi. */
const withoutLineKeys = (value: FormRequest): QuoteRequest => ({
  ...value,
  lines: value.lines.map(({ key: _key, ...line }) => line),
})

export function QuoteForm({ products }: { products: QuoteProductOption[] }) {
  const searchParams = useSearchParams()

  // Sản phẩm đến từ trang chi tiết. Tham số không khớp sản phẩm nào thì bỏ qua im lặng.
  const prefilledSlug = searchParams.get('sp')
  const prefilledProduct = products.find((product) => product.slug === prefilledSlug)
  const prefilledPackaging = searchParams.get('qc')

  /**
   * Trạng thái ban đầu đọc một lần khi component gắn vào DOM: `localStorage` chỉ tồn tại
   * trên trình duyệt, nên hàm khởi tạo này không bao giờ chạy ở phía máy chủ.
   */
  const [request, setRequest] = React.useState<FormRequest>(() => {
    if (typeof window === 'undefined') return withLineKeys(EMPTY_REQUEST)

    const base = loadDraft() ?? EMPTY_REQUEST
    if (!prefilledProduct) return withLineKeys(base)

    const firstLine: QuoteLine = {
      product: prefilledProduct.name,
      packaging:
        prefilledPackaging && prefilledProduct.packaging.includes(prefilledPackaging)
          ? prefilledPackaging
          : prefilledProduct.packaging[0],
      quantity: base.lines[0]?.quantity ?? '',
      unit: base.lines[0]?.unit ?? 'kg',
    }
    return withLineKeys({ ...base, lines: [firstLine, ...base.lines.slice(1)] })
  })

  /** Dòng có sẵn lúc mở form không chạy hiệu ứng mở ra; chỉ dòng thêm sau mới chạy. */
  const [initialKeys] = React.useState(() => new Set(request.lines.map((line) => line.key)))
  /** Dòng đang thu lại, chưa bị gỡ khỏi `request` cho tới khi hiệu ứng chạy xong. */
  const [leavingKeys, setLeavingKeys] = React.useState<ReadonlySet<string>>(() => new Set())
  const remainingLines = request.lines.length - leavingKeys.size

  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ reference: string; text: string } | null>(null)
  const summaryRef = React.useRef<HTMLDivElement>(null)

  const prefilled = prefilledProduct?.name ?? null

  React.useEffect(() => {
    if (result) return
    saveDraft(withoutLineKeys(request))
  }, [request, result])

  const setValue = <K extends keyof FormRequest>(key: K, value: FormRequest[K]) => {
    setRequest((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key as string]) return current
      const next = { ...current }
      delete next[key as string]
      return next
    })
  }

  const setLine = (index: number, patch: Partial<QuoteLine>) => {
    setRequest((current) => ({
      ...current,
      lines: current.lines.map((line, position) => (position === index ? { ...line, ...patch } : line)),
    }))
    setErrors((current) => {
      const key = Object.keys(current).find((name) => name.startsWith(`lines.${index}.`))
      if (!key) return current
      const next = { ...current }
      for (const name of Object.keys(next)) {
        if (name.startsWith(`lines.${index}.`)) delete next[name]
      }
      return next
    })
  }

  /** Thu toàn bộ lỗi về dạng phẳng `lines.0.product` / `phone` để gắn vào từng field. */
  const collectErrors = (value: FormRequest): FieldErrors => {
    const parsed = quoteRequestSchema.safeParse(value)
    if (parsed.success) return {}

    const collected: FieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      if (!collected[key]) collected[key] = issue.message
    }
    return collected
  }

  const validateField = (key: string) => {
    setTouched((current) => ({ ...current, [key]: true }))
    const all = collectErrors(request)
    setErrors((current) => {
      const next = { ...current }
      if (all[key]) next[key] = all[key]
      else delete next[key]
      return next
    })
  }

  const addLine = () => {
    if (request.lines.length >= MAX_LINES) return
    setRequest((current) => ({ ...current, lines: [...current.lines, { ...EMPTY_LINE, key: nextLineKey() }] }))
  }

  const stopLeaving = (key: string) =>
    setLeavingKeys((current) => {
      if (!current.has(key)) return current
      const next = new Set(current)
      next.delete(key)
      return next
    })

  /**
   * Xoá dòng chạy hai nhịp: dòng thu lại trước (các dòng dưới trượt lên theo), hết hiệu ứng
   * mới gỡ khỏi dữ liệu trong `finishRemoval`. Toast "Hoàn tác" hiện ngay khi bấm.
   */
  const removeLine = (index: number) => {
    const removed = request.lines[index]
    if (remainingLines <= 1 || leavingKeys.has(removed.key)) return
    setLeavingKeys((current) => new Set(current).add(removed.key))

    toast('Đã xoá một dòng sản phẩm', {
      description: removed.product || 'Dòng chưa nhập tên hoá chất',
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          stopLeaving(removed.key)
          setRequest((current) => {
            // Bấm hoàn tác khi dòng còn đang thu lại: dòng vẫn còn trong dữ liệu, chỉ cần giữ lại
            if (current.lines.some((line) => line.key === removed.key)) return current
            const restored = [...current.lines]
            // Khoá mới để dòng khôi phục chạy hiệu ứng mở ra như một dòng vừa thêm
            restored.splice(index, 0, { ...removed, key: nextLineKey() })
            return { ...current, lines: restored.slice(0, MAX_LINES) }
          })
        },
      },
    })
  }

  const finishRemoval = (key: string) => {
    setRequest((current) => ({ ...current, lines: current.lines.filter((line) => line.key !== key) }))
    stopLeaving(key)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const found = collectErrors(request)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      // Đưa tiêu điểm về field lỗi đầu tiên, sau khi tóm tắt lỗi đã hiện ra
      const firstKey = Object.keys(found)[0]
      requestAnimationFrame(() => {
        summaryRef.current?.scrollIntoView({ block: 'nearest' })
        document.getElementById(fieldId(firstKey))?.focus()
      })
      return
    }

    setSubmitting(true)
    try {
      const submitted = withoutLineKeys(request)
      const { reference } = await submitQuoteRequest(submitted)
      setResult({ reference, text: formatRequestText(submitted, reference) })
      clearDraft()
    } catch {
      setSubmitError(
        'Không mở được ứng dụng email trên thiết bị này. Dữ liệu bạn đã nhập vẫn được giữ nguyên — hãy thử lại hoặc gọi hotline để đọc yêu cầu trực tiếp.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return <QuoteConfirmation reference={result.reference} text={result.text} />
  }

  const errorEntries = Object.entries(errors).filter(([key]) => touched[key] || submitError === null)
  const showSummary = Object.keys(errors).length > 1

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-10">
      <datalist id={DATALIST_ID}>
        {products.map((product) => (
          <option key={product.slug} value={product.name}>
            {product.chemicalName} · CAS {product.cas}
          </option>
        ))}
      </datalist>

      <div ref={summaryRef}>
        {showSummary ? (
          <div role="alert" className="animate-attention-in rounded-[var(--radius-lg)] border border-danger bg-danger-bg p-4">
            <p className="flex items-center gap-2 text-label text-danger">
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
              Còn {errorEntries.length} trường cần sửa trước khi gửi
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-body-sm text-neutral-900">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>
                  <a href={`#${fieldId(key)}`} className="text-danger underline">
                    {errorLabel(key)}
                  </a>
                  {`: ${message}`}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {submitError ? (
        <div role="alert" className="animate-attention-in rounded-[var(--radius-lg)] border border-danger bg-danger-bg p-4">
          <p className="flex items-start gap-2 text-body-sm text-neutral-900">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            {submitError}
          </p>
          <p className="mt-3 text-body-sm">
            <a href={COMPANY.hotlineHref} className="text-primary-700 underline tabular">
              Gọi {COMPANY.hotlineDisplay}
            </a>
          </p>
        </div>
      ) : null}

      {/* Nhóm 1 — Sản phẩm cần báo giá */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-h3 mb-1 text-neutral-900">1. Sản phẩm cần báo giá</legend>

        {prefilled ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-body-sm text-primary-700">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            Đang yêu cầu báo giá cho: <strong className="font-semibold">{prefilled}</strong>
          </p>
        ) : null}

        {/* Mỗi dòng tự cộng khoảng cách phía dưới (pb-5) để khoảng cách thu lại cùng dòng khi xoá;
            -mb-5 trả lại phần thừa của dòng cuối. */}
        <ul className="-mb-5 flex flex-col">
          {request.lines.map((line, index) => {
            const leaving = leavingKeys.has(line.key)
            return (
              <li
                key={line.key}
                inert={leaving || undefined}
                className={cn(
                  'grid grid-rows-[1fr]',
                  leaving ? 'animate-row-collapse' : !initialKeys.has(line.key) && 'animate-row-expand',
                )}
                onAnimationEnd={(event) => {
                  // Lỗi bên trong dòng cũng có animation riêng và sự kiện nổi bọt lên đây
                  if (leaving && event.target === event.currentTarget) finishRemoval(line.key)
                }}
              >
                {/* -mx-1 px-1: chừa chỗ cho vòng focus của input khỏi bị overflow cắt mất */}
                <div className="-mx-1 min-h-0 overflow-hidden px-1">
                  <div className="pb-5">
                    <div className="rounded-[var(--radius-md)] border border-neutral-200 p-4 sm:border-0 sm:p-0">
                      <div className="flex items-center justify-between sm:mb-2">
                        <p className="text-label text-neutral-500">
                          Dòng <span className="tabular">{index + 1}</span>
                        </p>
                        {remainingLines > 1 ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="iconSm"
                            aria-label={`Xoá dòng ${index + 1}`}
                            onClick={() => removeLine(index)}
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        ) : null}
                      </div>

                      <div className="mt-2 grid gap-5 sm:grid-cols-12 sm:gap-4">
                        <Field
                          id={fieldId(`lines.${index}.product`)}
                          label="Tên hoá chất"
                          required
                          error={errors[`lines.${index}.product`]}
                          className="sm:col-span-5"
                        >
                          {(props) => (
                            <Input
                              {...props}
                              list={DATALIST_ID}
                              className={CONTROL_HEIGHT}
                              placeholder="Ví dụ: Axit sulfuric 98%"
                              value={line.product}
                              onChange={(event) => setLine(index, { product: event.target.value })}
                              onBlur={() => validateField(`lines.${index}.product`)}
                            />
                          )}
                        </Field>

                        <Field
                          id={fieldId(`lines.${index}.packaging`)}
                          label="Quy cách"
                          className="sm:col-span-3"
                        >
                          {(props) => (
                            <Input
                              {...props}
                              className={CONTROL_HEIGHT}
                              placeholder="Can 25 lít"
                              value={line.packaging}
                              onChange={(event) => setLine(index, { packaging: event.target.value })}
                            />
                          )}
                        </Field>

                        <Field
                          id={fieldId(`lines.${index}.quantity`)}
                          label="Số lượng"
                          required
                          error={errors[`lines.${index}.quantity`]}
                          className="sm:col-span-2"
                        >
                          {(props) => (
                            <Input
                              {...props}
                              inputMode="decimal"
                              className={cn(CONTROL_HEIGHT, 'tabular')}
                              placeholder="500"
                              value={line.quantity}
                              onChange={(event) => setLine(index, { quantity: event.target.value })}
                              onBlur={() => validateField(`lines.${index}.quantity`)}
                            />
                          )}
                        </Field>

                        <Field
                          id={fieldId(`lines.${index}.unit`)}
                          label="Đơn vị"
                          required
                          error={errors[`lines.${index}.unit`]}
                          className="sm:col-span-2"
                        >
                          {(props) => (
                            <Select
                              {...props}
                              className={CONTROL_HEIGHT}
                              value={line.unit}
                              onChange={(event) => setLine(index, { unit: event.target.value })}
                            >
                              {UNITS.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLine}
            disabled={request.lines.length >= MAX_LINES}
          >
            <Plus aria-hidden="true" />
            Thêm dòng
          </Button>
          <p className="text-caption text-neutral-500">
            <span className="tabular">{remainingLines}</span>/
            <span className="tabular">{MAX_LINES}</span> dòng
            {request.lines.length >= MAX_LINES ? ' — đã đạt số dòng tối đa của một yêu cầu' : ''}
          </p>
        </div>
      </fieldset>

      {/* Nhóm 2 — Thông tin liên hệ */}
      <fieldset className="flex flex-col gap-5">
        <legend className="text-h3 mb-1 text-neutral-900">2. Thông tin liên hệ</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={fieldId('contactName')} label={FIELD_LABELS.contactName} required error={errors.contactName}>
            {(props) => (
              <Input
                {...props}
                autoComplete="name"
                className={CONTROL_HEIGHT}
                value={request.contactName}
                onChange={(event) => setValue('contactName', event.target.value)}
                onBlur={() => validateField('contactName')}
              />
            )}
          </Field>

          <Field
            id={fieldId('phone')}
            label={FIELD_LABELS.phone}
            required
            hint="10 chữ số, bắt đầu bằng số 0"
            error={errors.phone}
          >
            {(props) => (
              <Input
                {...props}
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                className={cn(CONTROL_HEIGHT, 'tabular')}
                value={request.phone}
                onChange={(event) => setValue('phone', event.target.value)}
                onBlur={() => validateField('phone')}
              />
            )}
          </Field>

          <Field
            id={fieldId('email')}
            label={FIELD_LABELS.email}
            required
            hint="Bản báo giá được gửi bằng văn bản qua email"
            error={errors.email}
          >
            {(props) => (
              <Input
                {...props}
                type="email"
                autoComplete="email"
                className={CONTROL_HEIGHT}
                value={request.email}
                onChange={(event) => setValue('email', event.target.value)}
                onBlur={() => validateField('email')}
              />
            )}
          </Field>

          <Field id={fieldId('company')} label={FIELD_LABELS.company} required error={errors.company}>
            {(props) => (
              <Input
                {...props}
                autoComplete="organization"
                className={CONTROL_HEIGHT}
                value={request.company}
                onChange={(event) => setValue('company', event.target.value)}
                onBlur={() => validateField('company')}
              />
            )}
          </Field>

          <Field id={fieldId('taxCode')} label={FIELD_LABELS.taxCode} error={errors.taxCode}>
            {(props) => (
              <Input
                {...props}
                inputMode="numeric"
                className={cn(CONTROL_HEIGHT, 'tabular')}
                value={request.taxCode}
                onChange={(event) => setValue('taxCode', event.target.value)}
                onBlur={() => validateField('taxCode')}
              />
            )}
          </Field>

          <Field id={fieldId('address')} label={FIELD_LABELS.address}>
            {(props) => (
              <Input
                {...props}
                autoComplete="street-address"
                className={CONTROL_HEIGHT}
                value={request.address}
                onChange={(event) => setValue('address', event.target.value)}
              />
            )}
          </Field>
        </div>
      </fieldset>

      {/* Nhóm 3 — Yêu cầu bổ sung: mở sẵn trên desktop, đóng sẵn trên mobile */}
      <AdditionalDetails>
        <fieldset className="flex flex-col gap-5 pt-4">
          <legend className="sr-only">Yêu cầu bổ sung</legend>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fieldId('neededBy')} label={FIELD_LABELS.neededBy} hint="Ví dụ: trong tuần này, hoặc 30/09">
              {(props) => (
                <Input
                  {...props}
                  className={CONTROL_HEIGHT}
                  value={request.neededBy}
                  onChange={(event) => setValue('neededBy', event.target.value)}
                />
              )}
            </Field>

            <Field id={fieldId('deliveryMode')} label={FIELD_LABELS.deliveryMode}>
              {(props) => (
                <Select
                  {...props}
                  className={CONTROL_HEIGHT}
                  value={request.deliveryMode}
                  onChange={(event) => setValue('deliveryMode', event.target.value)}
                >
                  {DELIVERY_MODES.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <Field id={fieldId('note')} label={FIELD_LABELS.note} hint="Yêu cầu về chứng từ, nồng độ, tiêu chuẩn áp dụng…">
            {(props) => (
              <Textarea
                {...props}
                rows={4}
                value={request.note}
                onChange={(event) => setValue('note', event.target.value)}
              />
            )}
          </Field>
        </fieldset>
      </AdditionalDetails>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="cta" size="lg" loading={submitting} loadingLabel="Đang chuẩn bị yêu cầu">
          Gửi yêu cầu báo giá
        </Button>
        <p className="text-caption text-neutral-500">
          Bản nháp được lưu trên trình duyệt của bạn trong 7 ngày, nên có thoát ra giữa chừng cũng không
          mất dữ liệu đã nhập.
        </p>
      </div>
    </form>
  )
}

/** `<details>` mở sẵn từ `sm` trở lên, đóng sẵn trên mobile (quote-contact.md §A). */
function AdditionalDetails({ children }: { children: React.ReactNode }) {
  const isWide = useMediaQuery('(width >= 640px)')
  const [overridden, setOverridden] = React.useState<boolean | null>(null)

  // Mặc định theo bề rộng màn hình, nhưng một khi người dùng tự đóng/mở thì giữ lựa chọn
  // của họ thay vì bật lại khi xoay ngang thiết bị.
  const open = overridden ?? isWide

  return (
    <details
      open={open}
      onToggle={(event) => setOverridden((event.currentTarget as HTMLDetailsElement).open)}
      className="rounded-[var(--radius-lg)] border border-neutral-200 p-4"
    >
      <summary className="text-h3 flex min-h-11 cursor-pointer items-center text-neutral-900">
        3. Yêu cầu bổ sung
      </summary>
      {children}
    </details>
  )
}

function QuoteConfirmation({ reference, text }: { reference: string; text: string }) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 size-6 shrink-0 text-success" aria-hidden="true" />
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-h3 text-neutral-900 focus:outline-none">
            Yêu cầu đã được soạn xong
          </h2>
          <p className="text-body mt-2 text-neutral-700">
            Nội dung yêu cầu vừa được mở trong ứng dụng email của bạn, gửi tới{' '}
            <strong className="font-semibold">{COMPANY.email}</strong>. Bấm <strong>Gửi</strong> trong
            ứng dụng đó để hoàn tất. Bộ phận kinh doanh phản hồi trong {COMPANY.responseTime} kể từ khi
            nhận được thư.
          </p>
        </div>
      </div>

      <p className="rounded-[var(--radius-md)] bg-neutral-100 p-4 text-body">
        Mã tham chiếu: <strong className="tabular font-semibold">{reference}</strong>
        <span className="mt-1 block text-caption text-neutral-500">
          Nhắc mã này khi gọi hotline để nhân viên tra đúng yêu cầu của bạn.
        </span>
      </p>

      <section aria-labelledby="ban-sao-yeu-cau">
        <h3 id="ban-sao-yeu-cau" className="text-h5 mb-2 text-neutral-900">
          Bản sao yêu cầu
        </h3>
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50 p-4 text-body-sm text-neutral-900">
          {text}
        </pre>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" size="md" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          Lưu bản sao (in ra PDF)
        </Button>
        <Button asChild variant="outline" size="md">
          <a href={COMPANY.hotlineHref}>
            <span className="tabular">Gọi {COMPANY.hotlineDisplay}</span>
          </a>
        </Button>
      </div>
    </div>
  )
}

/** `lines.0.product` → `rfq-lines-0-product`, dùng chung cho `id`, anchor và focus. */
function fieldId(key: string) {
  return `rfq-${key.replace(/\./g, '-')}`
}

function errorLabel(key: string) {
  const match = key.match(/^lines\.(\d+)\.(\w+)$/)
  if (match) {
    const names: Record<string, string> = {
      product: 'Tên hoá chất',
      quantity: 'Số lượng',
      unit: 'Đơn vị',
      packaging: 'Quy cách',
    }
    return `Dòng ${Number(match[1]) + 1} — ${names[match[2]] ?? match[2]}`
  }
  return FIELD_LABELS[key] ?? key
}
