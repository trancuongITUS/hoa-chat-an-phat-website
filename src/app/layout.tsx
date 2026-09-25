import type { Metadata, Viewport } from 'next'

import { fontBody, fontHeading } from '@/app/fonts'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { RouteFocus } from '@/components/layout/route-focus'
import { Toaster } from '@/components/ui/toaster'
import { COMPANY } from '@/data/company'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hoachatanphat.example.com'),
  title: {
    default: `${COMPANY.name} — Hoá chất công nghiệp`,
    template: `%s — ${COMPANY.shortName}`,
  },
  description: `${COMPANY.tagline}. Báo giá theo lô, có đầy đủ MSDS, COA và chứng từ xuất xứ.`,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: COMPANY.name,
  },
}

/** MASTER §10: không tắt zoom trong thẻ meta viewport. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `data-scroll-behavior`: Next tạm tắt cuộn mượt lúc chuyển trang, để trang mới hiện
    // thẳng ở đầu thay vì trượt từ vị trí cũ. Neo trong trang vẫn cuộn mượt.
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${fontHeading.variable} ${fontBody.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#noi-dung-chinh"
          className="sr-only rounded-[var(--radius-md)] bg-primary-600 px-4 text-label text-neutral-0 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-70 focus:inline-flex focus:h-11 focus:items-center"
        >
          Bỏ qua tới nội dung chính
        </a>

        <SiteHeader />
        <RouteFocus />

        <main id="noi-dung-chinh" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
