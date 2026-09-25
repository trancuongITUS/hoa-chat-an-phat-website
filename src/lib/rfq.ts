// `zod/mini` với import theo tên (không dùng namespace `z`): namespace kéo theo toàn bộ
// locale của zod vào bundle client, import theo tên thì chỉ giữ đúng các hàm được dùng.
import { array, email, maxLength, minLength, object, partial, refine, regex, string, trim } from 'zod/mini'
import type { core, infer as Infer } from 'zod/mini'

import { COMPANY } from '@/data/company'

/**
 * Lớp nghiệp vụ của form yêu cầu báo giá — `pages/quote-contact.md` §A.
 *
 * Đây là **bản nháp của một form**, không phải giỏ hàng: không có huy hiệu số lượng ở
 * header, không có trang "giỏ", và không có trạng thái nào tồn tại giữa các trang ngoài
 * bản nháp lưu trong `localStorage` của chính người dùng.
 */
export const MAX_LINES = 10

export const UNITS = ['kg', 'lít', 'can', 'phuy', 'bao', 'bồn IBC', 'tấn'] as const

export const DELIVERY_MODES = [
  { value: 'nhan-tai-kho', label: 'Nhận tại kho An Phát' },
  { value: 'giao-tan-noi', label: 'Giao tận nơi' },
] as const

const trimmed = () => string().check(trim())
const requiredText = (message: string, ...checks: core.$ZodCheck<string>[]) =>
  string().check(trim(), minLength(1, message), ...checks)

export const quoteLineSchema = object({
  product: requiredText('Vui lòng nhập tên hoá chất cần báo giá'),
  packaging: trimmed(),
  quantity: requiredText(
    'Vui lòng nhập số lượng cần mua',
    regex(/^[0-9]+([.,][0-9]+)?$/, 'Số lượng chỉ gồm chữ số, ví dụ 500 hoặc 2,5'),
  ),
  unit: requiredText('Vui lòng chọn đơn vị tính'),
})

export const quoteRequestSchema = object({
  lines: array(quoteLineSchema).check(
    minLength(1, 'Cần ít nhất một dòng sản phẩm'),
    maxLength(MAX_LINES, `Tối đa ${MAX_LINES} dòng sản phẩm mỗi yêu cầu`),
  ),
  contactName: requiredText('Vui lòng nhập tên người liên hệ'),
  phone: requiredText(
    'Vui lòng nhập số điện thoại',
    regex(/^0[0-9]{9}$/, 'Vui lòng nhập số điện thoại có 10 chữ số, bắt đầu bằng số 0'),
  ),
  email: requiredText(
    'Vui lòng nhập email để nhận bản báo giá',
    email('Email chưa đúng định dạng, ví dụ ten@congty.com'),
  ),
  company: requiredText('Vui lòng nhập tên công ty'),
  taxCode: string().check(
    trim(),
    refine((value) => value === '' || /^[0-9]{10}(-[0-9]{3})?$/.test(value), {
      message: 'Mã số thuế gồm 10 chữ số, hoặc 10 chữ số kèm 3 chữ số chi nhánh',
    }),
  ),
  address: trimmed(),
  neededBy: trimmed(),
  deliveryMode: trimmed(),
  note: trimmed(),
})

export type QuoteLine = Infer<typeof quoteLineSchema>
export type QuoteRequest = Infer<typeof quoteRequestSchema>

export const EMPTY_LINE: QuoteLine = { product: '', packaging: '', quantity: '', unit: 'kg' }

export const EMPTY_REQUEST: QuoteRequest = {
  lines: [{ ...EMPTY_LINE }],
  contactName: '',
  phone: '',
  email: '',
  company: '',
  taxCode: '',
  address: '',
  neededBy: '',
  deliveryMode: DELIVERY_MODES[0].value,
  note: '',
}

/** Nhãn tiếng Việt của từng trường, dùng cho tóm tắt lỗi và nội dung thư. */
export const FIELD_LABELS: Record<string, string> = {
  contactName: 'Tên người liên hệ',
  phone: 'Số điện thoại',
  email: 'Email',
  company: 'Tên công ty',
  taxCode: 'Mã số thuế',
  address: 'Địa chỉ nhận hàng',
  neededBy: 'Thời gian cần hàng',
  deliveryMode: 'Hình thức giao',
  note: 'Ghi chú',
}

// ---------------------------------------------------------------------------
// Bản nháp trong localStorage — hết hạn sau 7 ngày (quote-contact.md §A)
// ---------------------------------------------------------------------------

const DRAFT_KEY = 'an-phat:yeu-cau-bao-gia'
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function loadDraft(): QuoteRequest | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as { savedAt: number; value: unknown }
    if (Date.now() - parsed.savedAt > DRAFT_TTL_MS) {
      window.localStorage.removeItem(DRAFT_KEY)
      return null
    }

    const result = partial(quoteRequestSchema).safeParse(parsed.value)
    if (!result.success) return null

    return { ...EMPTY_REQUEST, ...(result.data as Partial<QuoteRequest>) }
  } catch {
    // localStorage bị chặn hoặc dữ liệu hỏng: coi như chưa có bản nháp
    return null
  }
}

export function saveDraft(value: QuoteRequest) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), value }))
  } catch {
    // Hết dung lượng hoặc chế độ riêng tư: bỏ qua, không chặn người dùng điền form
  }
}

export function clearDraft() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // Không có gì để dọn nếu localStorage không dùng được
  }
}

// ---------------------------------------------------------------------------
// Gửi yêu cầu
// ---------------------------------------------------------------------------

/** Mã tham chiếu do trình duyệt sinh, dạng RFQ-YYMMDD-XXXX. */
export function createReferenceCode(now = new Date()) {
  const stamp = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `RFQ-${stamp}-${random}`
}

export function formatRequestText(request: QuoteRequest, reference: string) {
  const lines = request.lines
    .filter((line) => line.product.trim())
    .map(
      (line, index) =>
        `${index + 1}. ${line.product}` +
        (line.packaging ? ` — quy cách ${line.packaging}` : '') +
        ` — số lượng ${line.quantity} ${line.unit}`,
    )

  const delivery = DELIVERY_MODES.find((mode) => mode.value === request.deliveryMode)?.label ?? ''

  return [
    `Mã tham chiếu: ${reference}`,
    '',
    'DANH SÁCH HOÁ CHẤT CẦN BÁO GIÁ',
    ...lines,
    '',
    'THÔNG TIN LIÊN HỆ',
    `${FIELD_LABELS.contactName}: ${request.contactName}`,
    `${FIELD_LABELS.phone}: ${request.phone}`,
    `${FIELD_LABELS.email}: ${request.email}`,
    `${FIELD_LABELS.company}: ${request.company}`,
    request.taxCode ? `${FIELD_LABELS.taxCode}: ${request.taxCode}` : null,
    request.address ? `${FIELD_LABELS.address}: ${request.address}` : null,
    '',
    'YÊU CẦU BỔ SUNG',
    request.neededBy ? `${FIELD_LABELS.neededBy}: ${request.neededBy}` : null,
    delivery ? `${FIELD_LABELS.deliveryMode}: ${delivery}` : null,
    request.note ? `${FIELD_LABELS.note}: ${request.note}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export interface SubmitResult {
  reference: string
  /** Cách yêu cầu được chuyển đi — quyết định nội dung màn hình xác nhận. */
  channel: 'email-client'
}

/**
 * **Điểm nối backend duy nhất của toàn site.**
 *
 * Dự án hiện chưa có backend theo quyết định ngày 2026-09-21. Để form vẫn làm việc thật
 * chứ không giả vờ đã gửi, hàm này mở ứng dụng email của người dùng với nội dung yêu cầu
 * đã soạn sẵn và địa chỉ nhận là hộp thư kinh doanh.
 *
 * Khi có API, thay phần thân hàm bằng lời gọi `fetch` tới endpoint đó và trả về mã yêu
 * cầu do máy chủ cấp. Mọi nơi khác trong mã nguồn không cần sửa gì.
 */
export async function submitQuoteRequest(request: QuoteRequest): Promise<SubmitResult> {
  const reference = createReferenceCode()
  const subject = `[${reference}] Yêu cầu báo giá — ${request.company}`
  const body = formatRequestText(request, reference)

  const href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const opened = window.open(href, '_self')
  if (!opened && typeof window.location.assign === 'function') {
    window.location.assign(href)
  }

  return { reference, channel: 'email-client' }
}
