import { Download, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { ProductDocument } from '@/data/types'
import { documentSize } from '@/lib/document-size'
import { formatDate } from '@/lib/utils'

/**
 * Khối tài liệu tải về — MASTER §7.6.
 *
 * Nêu rõ định dạng và dung lượng trước khi tải là bắt buộc. Dung lượng đọc trực tiếp từ
 * tệp trong `public/` nên nhãn không bao giờ lệch với tệp người dùng nhận được.
 *
 * Server Component: `documentSize` đọc hệ tệp.
 */
export function DocumentList({ documents }: { documents: ProductDocument[] }) {
  return (
    <ul className="divide-y divide-neutral-200 overflow-hidden rounded-[var(--radius-lg)] border border-neutral-200 bg-card">
      {documents.map((doc) => {
        const size = documentSize(doc.href)
        const meta = size ? `PDF · ${size}` : 'PDF'

        return (
          <li key={doc.kind} className="flex flex-wrap items-center gap-3 p-4">
            <FileText className="size-5 shrink-0 text-primary-600" aria-hidden="true" />

            <div className="min-w-0 flex-1">
              <p className="text-body font-medium text-neutral-900">{doc.name}</p>
              <p className="text-caption text-neutral-500">
                <span className="tabular">{meta}</span>
                {' · Ban hành '}
                <span className="tabular">{formatDate(doc.issuedAt)}</span>
              </p>
            </div>

            <Button asChild variant="outline" size="sm">
              <a href={doc.href} download>
                <Download aria-hidden="true" />
                Tải về
                <span className="sr-only">
                  {' '}
                  {doc.name}, {meta}
                </span>
              </a>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
