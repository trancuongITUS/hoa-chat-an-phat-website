'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Phone } from 'lucide-react'

import { BrandMark } from '@/components/brand-mark'
import { getIcon } from '@/components/icon-map'
import { NAV_ITEMS, type NavItem } from '@/components/layout/navigation'
import { Dialog, DialogClose, DialogTrigger, DrawerContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { COMPANY } from '@/data/company'
import { cn } from '@/lib/utils'

/**
 * Rê chuột phải dừng trên mục menu chừng này mới mở mega menu: con trỏ chỉ lướt ngang thanh
 * điều hướng thì không bật menu liên tục. Click và Enter vẫn mở ngay.
 */
const HOVER_OPEN_DELAY_MS = 100

/** Header thêm bóng khi cuộn quá 8px — đọc vị trí cuộn như một nguồn bên ngoài. */
function useScrolledPastHeader() {
  const subscribe = React.useCallback((onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true })
    return () => window.removeEventListener('scroll', onChange)
  }, [])

  return React.useSyncExternalStore(
    subscribe,
    () => window.scrollY > 8,
    () => false,
  )
}

/**
 * Cụm nút hành động của hero trang chủ (đánh dấu `data-hero-cta`) còn nhìn thấy được bên
 * dưới header hay chưa.
 *
 * Chỉ coi là đã khuất khi cụm nút cuộn hẳn lên sau mép dưới header, nên header không hiện
 * nút báo giá trùng với nút trên hero dù chỉ trong một khung hình.
 */
function useHeroCtaInView(enabled: boolean, headerRef: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = React.useState(true)
  const [wasEnabled, setWasEnabled] = React.useState(enabled)

  // Quay lại trang chủ thì đặt lại ngay trong lượt render, tránh một khung hình dùng kết quả
  // của lần ghé trước trong lúc observer chưa kịp báo
  if (enabled !== wasEnabled) {
    setWasEnabled(enabled)
    setInView(true)
  }

  React.useEffect(() => {
    const target = document.querySelector('[data-hero-cta]')
    if (!enabled || !target) return

    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting || entry.boundingClientRect.top > headerHeight),
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled, headerRef])

  return inView
}

/**
 * Header + mega menu — MASTER §7.7.
 *
 * Header dính cao 72px (60px dưới `lg`), thêm `shadow-md` khi cuộn quá 8px. Mega menu mở
 * bằng cả hover và click/Enter, đóng bằng `Esc`, và trả tiêu điểm về nút mở.
 * Mục đang ở được đánh dấu bằng `aria-current` cộng gạch chân, không chỉ bằng màu.
 *
 * Trang chủ: header cố định và nằm đè lên hero thay vì chiếm chỗ trong luồng trang, để dải
 * tin cậy đè dưới hero lọt trọn khung nhìn đầu tiên. Ở đầu trang header trong suốt, chữ sáng;
 * mega menu mở ra vẫn giữ header trong suốt, chỉ khi cuộn quá 8px mới về nền trắng. Hotline và
 * nút báo giá trên header chỉ hiện khi hai nút tương ứng trên hero đã cuộn khuất sau header.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const scrolled = useScrolledPastHeader()
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const isHome = pathname === '/'
  const headerRef = React.useRef<HTMLElement>(null)
  const heroCtaInView = useHeroCtaInView(isHome, headerRef)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [lastPath, setLastPath] = React.useState(pathname)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = React.useRef<HTMLElement>(null)

  // Điều hướng xong thì đóng mọi lớp phủ đang mở. Đặt lại ngay trong lượt render thay vì
  // trong effect để tránh một khung hình hiện menu của trang cũ trên trang mới.
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpenMenu(null)
    setDrawerOpen(false)
  }

  React.useEffect(() => {
    if (!openMenu) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      // Trả tiêu điểm về nút đã mở menu
      navRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openMenu])

  const clearTimers = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (openTimer.current) clearTimeout(openTimer.current)
    closeTimer.current = null
    openTimer.current = null
  }, [])

  React.useEffect(() => clearTimers, [clearTimers])

  const scheduleOpen = (label: string) => {
    clearTimers()
    // Đang có menu mở thì chuyển sang menu bên cạnh ngay, không bắt chờ thêm lần nữa
    if (openMenu) {
      setOpenMenu(label)
      return
    }
    openTimer.current = setTimeout(() => setOpenMenu(label), HOVER_OPEN_DELAY_MS)
  }

  const scheduleClose = () => {
    clearTimers()
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const isCurrent = (href?: string) =>
    Boolean(href) && (pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)))

  const onDark = isHome && !scrolled

  return (
    <header
      ref={headerRef}
      className={cn(
        'top-0 z-20 transition-[background-color,box-shadow] duration-[var(--duration-fast)]',
        isHome ? 'fixed inset-x-0' : 'sticky',
        // Vòng focus mặc định `primary-600` chìm trên ảnh hero tối, đổi sang `primary-300`
        onDark ? 'bg-transparent [--ring:var(--color-primary-300)]' : 'bg-neutral-0',
        scrolled ? 'shadow-md' : 'shadow-none',
      )}
    >
      <div className="container-site flex h-15 items-center gap-4 lg:h-18">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-sm)]"
          aria-label={`${COMPANY.name} — về trang chủ`}
        >
          <Logo onDark={onDark} />
        </Link>

        <nav ref={navRef} aria-label="Điều hướng chính" className="ml-2 hidden lg:block">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (item.columns) scheduleOpen(item.label)
                }}
                onMouseLeave={() => {
                  if (item.columns) scheduleClose()
                }}
              >
                <NavTrigger
                  item={item}
                  open={openMenu === item.label}
                  current={isCurrent(item.href)}
                  onDark={onDark}
                  onToggle={() => {
                    clearTimers()
                    setOpenMenu((value) => (value === item.label ? null : item.label))
                  }}
                />
                {item.columns && openMenu === item.label ? (
                  <MegaMenu item={item} onNavigate={() => setOpenMenu(null)} />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Mỗi khung nhìn chỉ một nút `cta`: trên hero đã có nút báo giá và nút gọi */}
          {isHome && heroCtaInView ? null : (
            <>
              <a
                href={COMPANY.hotlineHref}
                className="hidden min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-label text-primary-700 transition-colors duration-[var(--duration-fast)] hover:bg-primary-50 md:inline-flex"
              >
                <Phone className="size-4" aria-hidden="true" />
                <span className="tabular">{COMPANY.hotlineDisplay}</span>
              </a>

              <Button asChild variant="cta" size="sm" className="hidden sm:inline-flex">
                <Link href="/yeu-cau-bao-gia">Yêu cầu báo giá</Link>
              </Button>
            </>
          )}

          <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('lg:hidden', onDark && 'text-on-dark hover:bg-neutral-0/10')}
                aria-label="Mở menu điều hướng"
              >
                <Menu aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <MobileDrawer isCurrent={isCurrent} />
          </Dialog>
        </div>
      </div>
    </header>
  )
}

function Logo({ onDark }: { onDark: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark tone={onDark ? 'dark' : 'light'} className="size-9 lg:size-10" />
      <span className="flex flex-col gap-1 leading-none">
        <span
          className={cn(
            'font-[family-name:var(--font-heading)] text-[19px] font-bold transition-colors duration-[var(--duration-fast)]',
            onDark ? 'text-on-dark' : 'text-primary-800',
          )}
        >
          An Phát
        </span>
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-[var(--duration-fast)]',
            onDark ? 'text-on-dark-muted' : 'text-neutral-500',
          )}
        >
          Hoá chất công nghiệp
        </span>
      </span>
    </span>
  )
}

function NavTrigger({
  item,
  open,
  current,
  onDark,
  onToggle,
}: {
  item: NavItem
  open: boolean
  current: boolean
  onDark: boolean
  onToggle: () => void
}) {
  const classes = cn(
    'inline-flex h-11 cursor-pointer items-center gap-1 rounded-[var(--radius-md)] px-3 text-label',
    'transition-colors duration-[var(--duration-fast)]',
    'border-b-2',
    onDark
      ? cn('text-on-dark hover:bg-neutral-0/10', current ? 'border-primary-300' : 'border-transparent')
      : current
        ? 'border-primary-600 text-primary-700'
        : 'border-transparent text-neutral-700 hover:bg-neutral-100',
  )

  if (!item.columns) {
    return (
      <Link href={item.href ?? '#'} aria-current={current ? 'page' : undefined} className={classes}>
        {item.label}
      </Link>
    )
  }

  return (
    <button
      type="button"
      data-menu-trigger={item.label}
      aria-expanded={open}
      aria-haspopup="true"
      onClick={onToggle}
      className={classes}
    >
      {item.label}
      <ChevronDown
        className={cn('size-4 transition-transform duration-[var(--duration-fast)]', open && 'rotate-180')}
        aria-hidden="true"
      />
    </button>
  )
}

function MegaMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <div
      className={cn(
        // Menu mở rất thường xuyên nên dùng mức thấp của dải Orientation: `duration-base`
        'animate-in fade-in-0 slide-in-from-top-1 duration-[var(--duration-base)] ease-[var(--ease-out)]',
        'absolute left-0 top-full z-40 w-[min(720px,calc(100vw-64px))] rounded-[var(--radius-lg)]',
        'border border-neutral-200 bg-popover p-6 shadow-lg',
      )}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {item.columns?.map((column) => (
          <div key={column.title}>
            <p className="text-overline mb-3 text-neutral-500">{column.title}</p>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => {
                const Icon = link.icon ? getIcon(link.icon) : null
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="flex gap-2.5 rounded-[var(--radius-md)] p-2 transition-colors duration-[var(--duration-fast)] hover:bg-primary-50"
                    >
                      {Icon ? <Icon className="mt-0.5 size-5 shrink-0 text-primary-600" aria-hidden="true" /> : null}
                      <span className="flex flex-col">
                        <span className="text-label text-neutral-900">{link.label}</span>
                        {link.description ? (
                          <span className="text-caption font-normal text-neutral-500">{link.description}</span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {item.featured ? (
        <Link
          href={item.featured.href}
          onClick={onNavigate}
          className="mt-4 flex items-center justify-between gap-4 rounded-[var(--radius-md)] bg-primary-50 p-4 transition-colors duration-[var(--duration-fast)] hover:bg-primary-100"
        >
          <span className="flex flex-col">
            <span className="text-label text-primary-700">{item.featured.label}</span>
            {item.featured.description ? (
              <span className="text-caption font-normal text-neutral-700">{item.featured.description}</span>
            ) : null}
          </span>
          <ChevronDown className="size-5 -rotate-90 text-primary-600" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

function MobileDrawer({ isCurrent }: { isCurrent: (href?: string) => boolean }) {
  return (
    <DrawerContent title="Điều hướng" side="right">
      {/* Hotline và nút báo giá luôn nằm ngay đầu drawer (MASTER §7.7) */}
      <div className="flex flex-col gap-2 border-b border-neutral-200 p-4">
        <Button asChild variant="cta" size="md">
          <Link href="/yeu-cau-bao-gia">Yêu cầu báo giá</Link>
        </Button>
        <Button asChild variant="outline" size="md">
          <a href={COMPANY.hotlineHref}>
            <Phone aria-hidden="true" />
            <span className="tabular">Gọi {COMPANY.hotlineDisplay}</span>
          </a>
        </Button>
      </div>

      <nav aria-label="Điều hướng chính" className="p-2">
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="border-b border-neutral-200 last:border-b-0">
              {item.href ? (
                <DialogClose asChild>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center px-3 py-3 text-label',
                      isCurrent(item.href)
                        ? 'text-primary-700 underline decoration-primary-600 decoration-2 underline-offset-8'
                        : 'text-neutral-900',
                    )}
                  >
                    {item.label}
                  </Link>
                </DialogClose>
              ) : (
                <p className="px-3 pb-1 pt-3 text-overline text-neutral-500">{item.label}</p>
              )}

              {item.columns ? (
                <ul className="flex flex-col pb-2">
                  {item.columns.flatMap((column) => column.links).map((link) => (
                    <li key={link.href}>
                      <DialogClose asChild>
                        <Link
                          href={link.href}
                          className="flex min-h-11 items-center rounded-[var(--radius-md)] px-3 py-2 text-body-sm text-neutral-700 transition-colors duration-[var(--duration-fast)] hover:bg-neutral-100"
                        >
                          {link.label}
                        </Link>
                      </DialogClose>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </DrawerContent>
  )
}
