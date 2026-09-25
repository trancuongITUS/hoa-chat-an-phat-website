'use client'

import * as React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { minLength, object, regex, string, trim } from 'zod/mini'
import type { infer as Infer } from 'zod/mini'

import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { COMPANY, CONTACT_TOPICS } from '@/data/company'

/**
 * Form liên hệ ngắn — quote-contact.md §B4.
 *
 * Tối đa 4 trường và **không** bắt buộc email: email chỉ bắt buộc ở luồng báo giá vì báo
 * giá cần gửi văn bản. Đây là form riêng, không dùng lại form RFQ.
 *
 * Chưa có backend, nên khi gửi, nội dung được chuyển sang ứng dụng email của người dùng —
 * hành vi thật, không giả vờ đã gửi. Khi có API, thay phần thân `onSubmit` là đủ.
 */
const contactSchema = object({
  name: string().check(trim(), minLength(1, 'Vui lòng nhập tên của bạn')),
  phone: string().check(
    trim(),
    regex(/^0[0-9]{9}$/, 'Vui lòng nhập số điện thoại có 10 chữ số, bắt đầu bằng số 0'),
  ),
  topic: string().check(trim(), minLength(1, 'Vui lòng chọn chủ đề')),
  message: string().check(trim(), minLength(10, 'Vui lòng mô tả nội dung cần hỗ trợ, tối thiểu 10 ký tự')),
})

type ContactValues = Infer<typeof contactSchema>

const EMPTY: ContactValues = { name: '', phone: '', topic: CONTACT_TOPICS[0], message: '' }

export function ContactForm() {
  const [values, setValues] = React.useState<ContactValues>(EMPTY)
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactValues, string>>>({})
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  const setValue = (key: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const validateField = (key: keyof ContactValues) => {
    const parsed = contactSchema.safeParse(values)
    const issue = parsed.success ? null : parsed.error.issues.find((item) => item.path[0] === key)
    setErrors((current) => ({ ...current, [key]: issue?.message }))
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      const found: Partial<Record<keyof ContactValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactValues
        if (!found[key]) found[key] = issue.message
      }
      setErrors(found)
      document.getElementById(`lien-he-${Object.keys(found)[0]}`)?.focus()
      return
    }

    setSending(true)
    const subject = `[Liên hệ] ${values.topic} — ${values.name}`
    const body = [
      `Chủ đề: ${values.topic}`,
      `Người liên hệ: ${values.name}`,
      `Số điện thoại: ${values.phone}`,
      '',
      values.message,
    ].join('\n')

    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-card p-6">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden="true" />
        <div>
          <h3 className="text-h5 text-neutral-900">Nội dung liên hệ đã được soạn xong</h3>
          <p className="text-body-sm mt-2 text-neutral-700">
            Thư gửi tới <strong className="font-semibold">{COMPANY.email}</strong> vừa mở trong ứng dụng
            email của bạn. Bấm Gửi trong ứng dụng đó để hoàn tất. Nếu cần gấp, gọi{' '}
            <a href={COMPANY.hotlineHref} className="text-primary-700 underline tabular">
              {COMPANY.hotlineDisplay}
            </a>
            .
          </p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSent(false); setValues(EMPTY) }}>
            Gửi nội dung khác
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lien-he-name" label="Tên của bạn" required error={errors.name}>
          {(props) => (
            <Input
              {...props}
              autoComplete="name"
              value={values.name}
              onChange={(event) => setValue('name', event.target.value)}
              onBlur={() => validateField('name')}
            />
          )}
        </Field>

        <Field
          id="lien-he-phone"
          label="Số điện thoại"
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
              className="tabular"
              value={values.phone}
              onChange={(event) => setValue('phone', event.target.value)}
              onBlur={() => validateField('phone')}
            />
          )}
        </Field>
      </div>

      <Field id="lien-he-topic" label="Chủ đề" required error={errors.topic}>
        {(props) => (
          <Select {...props} value={values.topic} onChange={(event) => setValue('topic', event.target.value)}>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field id="lien-he-message" label="Nội dung" required error={errors.message}>
        {(props) => (
          <Textarea
            {...props}
            rows={5}
            value={values.message}
            onChange={(event) => setValue('message', event.target.value)}
            onBlur={() => validateField('message')}
          />
        )}
      </Field>

      <div className="flex flex-col gap-2">
        <Button type="submit" variant="primary" size="md" loading={sending} className="self-start">
          Gửi nội dung
        </Button>
        <p className="flex items-start gap-1.5 text-caption text-neutral-500">
          <AlertCircle className="mt-px size-4 shrink-0" aria-hidden="true" />
          Form này dành cho câu hỏi chung. Cần báo giá, hãy dùng{' '}
          <a href="/yeu-cau-bao-gia" className="text-primary-700 underline">
            form yêu cầu báo giá
          </a>
          .
        </p>
      </div>
    </form>
  )
}
