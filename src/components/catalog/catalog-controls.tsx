'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'

import { useCatalogNavigate } from '@/components/catalog/catalog-transition'
import { FilterPanel } from '@/components/catalog/filter-panel'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DrawerContent } from '@/components/ui/dialog'
import { Select } from '@/components/ui/field'
import { CHEMICAL_GROUPS, GHS_CLASSES, INDUSTRIES, PHYSICAL_FORMS, STOCK_STATUS } from '@/data/taxonomy'
import {
  buildQuery,
  countActiveFilters,
  EMPTY_FILTERS,
  SORT_OPTIONS,
  type CatalogFacets,
  type CatalogFilters,
  type SortKey,
} from '@/lib/catalog'

/** Đẩy bộ lọc lên URL. Mọi control ở đây đều đổi ngay, không cần debounce. */
function useApplyFilters() {
  const navigate = useCatalogNavigate()
  const pathname = usePathname()

  return React.useCallback(
    (next: CatalogFilters) => {
      const query = buildQuery(next)
      navigate(query ? `${pathname}?${query}` : pathname)
    },
    [navigate, pathname],
  )
}

interface ActiveChip {
  label: string
  remove: (filters: CatalogFilters) => CatalogFilters
}

/** Dựng danh sách chip từ bộ lọc đang áp dụng, mỗi chip biết cách tự gỡ mình ra. */
function activeChips(filters: CatalogFilters): ActiveChip[] {
  const chips: ActiveChip[] = []

  for (const slug of filters.industries) {
    const industry = INDUSTRIES.find((item) => item.slug === slug)
    if (!industry) continue
    chips.push({
      label: `Ngành: ${industry.name}`,
      remove: (current) => ({ ...current, industries: current.industries.filter((item) => item !== slug) }),
    })
  }

  for (const slug of filters.groups) {
    const group = CHEMICAL_GROUPS.find((item) => item.slug === slug)
    if (!group) continue
    chips.push({
      label: `Nhóm: ${group.name}`,
      remove: (current) => ({ ...current, groups: current.groups.filter((item) => item !== slug) }),
    })
  }

  for (const code of filters.ghs) {
    chips.push({
      label: `GHS: ${GHS_CLASSES[code].name}`,
      remove: (current) => ({ ...current, ghs: current.ghs.filter((item) => item !== code) }),
    })
  }

  if (filters.form) {
    const form = PHYSICAL_FORMS.find((item) => item.value === filters.form)
    chips.push({
      label: `Dạng: ${form?.label ?? filters.form}`,
      remove: (current) => ({ ...current, form: null }),
    })
  }

  for (const pack of filters.packaging) {
    chips.push({
      label: `Quy cách: ${pack}`,
      remove: (current) => ({ ...current, packaging: current.packaging.filter((item) => item !== pack) }),
    })
  }

  for (const origin of filters.origins) {
    chips.push({
      label: `Xuất xứ: ${origin}`,
      remove: (current) => ({ ...current, origins: current.origins.filter((item) => item !== origin) }),
    })
  }

  if (filters.stock !== 'tat-ca') {
    chips.push({
      label: `Kho: ${STOCK_STATUS[filters.stock].label}`,
      remove: (current) => ({ ...current, stock: 'tat-ca' }),
    })
  }

  return chips
}

export function ActiveFilterChips({ filters }: { filters: CatalogFilters }) {
  const apply = useApplyFilters()
  const chips = activeChips(filters)

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-label text-neutral-500">Đang lọc theo:</span>
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => apply({ ...chip.remove(filters), page: 1 })}
          className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 text-caption font-semibold text-primary-700 transition-colors duration-[var(--duration-fast)] hover:bg-primary-100"
        >
          {chip.label}
          <X className="size-3.5" aria-hidden="true" />
          <span className="sr-only">— bỏ bộ lọc này</span>
        </button>
      ))}
      <Button variant="ghost" size="sm" onClick={() => apply({ ...EMPTY_FILTERS, sort: filters.sort })}>
        Xoá tất cả
      </Button>
    </div>
  )
}

export function SortSelect({ filters, className }: { filters: CatalogFilters; className?: string }) {
  const apply = useApplyFilters()

  return (
    <label className={className}>
      <span className="sr-only">Sắp xếp kết quả</span>
      <Select
        value={filters.sort}
        onChange={(event) => apply({ ...filters, sort: event.target.value as SortKey, page: 1 })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  )
}

/** Thanh công cụ dính dưới cùng trên mobile, nút "Bộ lọc" mở drawer từ trái. */
export function MobileCatalogToolbar({ filters, facets }: { filters: CatalogFilters; facets: CatalogFacets }) {
  const [open, setOpen] = React.useState(false)
  const active = countActiveFilters(filters)

  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-neutral-200 bg-neutral-0 px-4 py-3 shadow-[0_-4px_12px_rgb(15_29_46/0.08)] lg:hidden">
      <div className="flex gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="md" className="flex-1">
              <SlidersHorizontal aria-hidden="true" />
              Bộ lọc
              {active > 0 ? <span className="tabular">({active})</span> : null}
            </Button>
          </DialogTrigger>
          <DrawerContent
            title="Bộ lọc"
            side="left"
            footer={
              <Button variant="primary" size="md" className="w-full" onClick={() => setOpen(false)}>
                Xem kết quả
              </Button>
            }
          >
            <FilterPanel filters={filters} facets={facets} className="p-4" />
          </DrawerContent>
        </Dialog>

        <div className="flex flex-1 items-center gap-2">
          <ArrowUpDown className="size-5 shrink-0 text-neutral-500" aria-hidden="true" />
          <SortSelect filters={filters} className="flex-1" />
        </div>
      </div>
    </div>
  )
}
