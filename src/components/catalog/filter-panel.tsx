'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { useCatalogNavigate } from '@/components/catalog/catalog-transition'
import { GhsPictogram } from '@/components/ghs-pictogram'
import { Select } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { CHEMICAL_GROUPS, GHS_CLASSES, INDUSTRIES, PHYSICAL_FORMS, STOCK_STATUS } from '@/data/taxonomy'
import type { GhsCode, PhysicalForm, StockStatus } from '@/data/types'
import { buildQuery, EMPTY_FILTERS, type CatalogFacets, type CatalogFilters } from '@/lib/catalog'
import { cn } from '@/lib/utils'

/**
 * Sidebar bộ lọc — products.md §A.
 *
 * Mỗi nhóm lọc là một `fieldset` có `legend`, mặc định hiện 5 mục đầu. Thay đổi được gom
 * lại và đẩy vào URL sau 300ms để trạng thái lọc chia sẻ và deep link được; điều hướng
 * dùng `replace` với `scroll: false` nên vị trí cuộn không nhảy khi đang chọn.
 */
const DEBOUNCE_MS = 300
const VISIBLE_BY_DEFAULT = 5

export function FilterPanel({
  filters,
  facets,
  className,
  onApplied,
}: {
  filters: CatalogFilters
  /** Tính trên máy chủ và truyền xuống, để dữ liệu sản phẩm không lọt vào bundle client. */
  facets: CatalogFacets
  className?: string
  /** Gọi sau khi đã đẩy bộ lọc lên URL — drawer mobile dùng để tự đóng. */
  onApplied?: () => void
}) {
  const navigate = useCatalogNavigate()
  const pathname = usePathname()
  const applied = buildQuery(filters)

  const [draft, setDraft] = React.useState(filters)
  const [lastApplied, setLastApplied] = React.useState(applied)

  // URL đã đổi (ví dụ người dùng xoá một chip ở ngoài panel) thì kéo lại trạng thái từ
  // nguồn sự thật. Đồng bộ ngay trong lượt render để panel không hiện một khung hình với
  // bộ lọc cũ. `applied` là dạng chuỗi hoá của `filters`, so sánh rẻ hơn so sánh đối tượng.
  if (applied !== lastApplied) {
    setLastApplied(applied)
    setDraft(filters)
  }

  React.useEffect(() => {
    // Sau khi đồng bộ từ URL, `draft` bằng đúng `filters` nên biểu thức dưới đây tự nhận
    // ra "không có gì để đẩy" — không cần cờ đánh dấu người dùng đã chỉnh hay chưa.
    const next = buildQuery(draft)
    if (next === applied) return

    const timer = setTimeout(() => {
      navigate(next ? `${pathname}?${next}` : pathname)
      onApplied?.()
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, applied, pathname])

  /** Mọi thay đổi bộ lọc đều quay về trang 1 — giữ nguyên trang cũ sẽ ra kết quả rỗng. */
  const update = (patch: Partial<CatalogFilters>) => {
    setDraft((current) => ({ ...current, ...patch, page: 1 }))
  }

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <FilterGroup legend="Ngành ứng dụng">
        {INDUSTRIES.map((industry) => (
          <CheckboxRow
            key={industry.slug}
            label={industry.name}
            checked={draft.industries.includes(industry.slug)}
            onChange={() => update({ industries: toggleIn(draft.industries, industry.slug) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Nhóm hoá chất">
        {CHEMICAL_GROUPS.map((group) => (
          <CheckboxRow
            key={group.slug}
            label={group.name}
            checked={draft.groups.includes(group.slug)}
            onChange={() => update({ groups: toggleIn(draft.groups, group.slug) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Phân loại nguy hại GHS">
        {facets.ghs.map((code) => (
          <CheckboxRow
            key={code}
            label={GHS_CLASSES[code].name}
            title={GHS_CLASSES[code].description}
            icon={<GhsPictogram code={code as GhsCode} size={18} />}
            checked={draft.ghs.includes(code as GhsCode)}
            onChange={() => update({ ghs: toggleIn(draft.ghs, code) as GhsCode[] })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Dạng tồn tại">
        <RadioRow
          name="dang-ton-tai"
          label="Tất cả"
          checked={draft.form === null}
          onChange={() => update({ form: null })}
        />
        {PHYSICAL_FORMS.map((form) => (
          <RadioRow
            key={form.value}
            name="dang-ton-tai"
            label={form.label}
            checked={draft.form === form.value}
            onChange={() => update({ form: form.value as PhysicalForm })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Quy cách đóng gói">
        {facets.packaging.map((pack) => (
          <CheckboxRow
            key={pack}
            label={pack}
            checked={draft.packaging.includes(pack)}
            onChange={() => update({ packaging: toggleIn(draft.packaging, pack) })}
          />
        ))}
      </FilterGroup>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-label mb-2 text-neutral-900">Xuất xứ</legend>
        <Select
          aria-label="Chọn xuất xứ"
          value={draft.origins[0] ?? ''}
          onChange={(event) => update({ origins: event.target.value ? [event.target.value] : [] })}
        >
          <option value="">Tất cả xuất xứ</option>
          {facets.origins.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </Select>
      </fieldset>

      <FilterGroup legend="Tình trạng kho">
        <RadioRow
          name="tinh-trang-kho"
          label="Tất cả"
          checked={draft.stock === 'tat-ca'}
          onChange={() => update({ stock: 'tat-ca' })}
        />
        {(Object.keys(STOCK_STATUS) as StockStatus[]).map((status) => (
          <RadioRow
            key={status}
            name="tinh-trang-kho"
            label={STOCK_STATUS[status].label}
            checked={draft.stock === status}
            onChange={() => update({ stock: status })}
          />
        ))}
      </FilterGroup>

      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => setDraft({ ...EMPTY_FILTERS, sort: draft.sort })}
      >
        Xoá tất cả bộ lọc
      </Button>
    </div>
  )
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  const items = React.Children.toArray(children)
  const [expanded, setExpanded] = React.useState(false)
  const hidden = items.length - VISIBLE_BY_DEFAULT
  const visible = expanded ? items : items.slice(0, VISIBLE_BY_DEFAULT)

  return (
    <fieldset className="border-b border-neutral-200 pb-6 last-of-type:border-b-0">
      <legend className="text-label mb-2 text-neutral-900">{legend}</legend>
      <div className="flex flex-col">{visible}</div>
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-1 cursor-pointer rounded-[var(--radius-sm)] text-label text-primary-700 hover:underline"
        >
          {expanded ? 'Thu gọn' : `Xem thêm ${hidden} mục`}
        </button>
      ) : null}
    </fieldset>
  )
}

const rowClasses =
  'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-1 text-body-sm text-neutral-700 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100'

const controlClasses =
  'size-4.5 shrink-0 cursor-pointer accent-[var(--color-primary-600)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]'

function CheckboxRow({
  label,
  checked,
  onChange,
  icon,
  title,
}: {
  label: string
  checked: boolean
  onChange: () => void
  icon?: React.ReactNode
  title?: string
}) {
  return (
    <label className={rowClasses} title={title}>
      <input type="checkbox" checked={checked} onChange={onChange} className={controlClasses} />
      {icon}
      <span>{label}</span>
    </label>
  )
}

function RadioRow({
  name,
  label,
  checked,
  onChange,
}: {
  name: string
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className={rowClasses}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className={controlClasses} />
      <span>{label}</span>
    </label>
  )
}
