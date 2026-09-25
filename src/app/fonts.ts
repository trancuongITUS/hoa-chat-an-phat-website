import { Be_Vietnam_Pro, Noto_Sans } from 'next/font/google'

// MASTER §3.1 — font phủ đầy đủ diacritics tiếng Việt, chỉ preload font tiêu đề.
export const fontHeading = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
  preload: true,
})

export const fontBody = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: false,
})
