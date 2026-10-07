import { useRef, useState, type MouseEvent } from 'react'
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from '../lib/gsap'
import { nav, contact } from '../data/content'
import { blogHref, t } from '../i18n'
import { useLiquidGlass } from '../hooks/useLiquidGlass'
import { Logo } from './Logo'
import { CursorGlow } from './CursorGlow'
import { LanguageSwitcher } from './LanguageSwitcher'

type Props = { show: boolean }

/** Rola até uma âncora usando o ScrollSmoother (ou nativo, se ele não existir). */
export function scrollToAnchor(href: string) {
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(href, true, 'top top')
  else document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export function Header({ show }: Props) {
  const root = useRef<HTMLElement>(null)
  const pill = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const glass = useLiquidGlass(pill)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // entrada após o preloader
  useGSAP(
    () => {
      if (!show) return
      gsap.fromTo(root.current, { y: -40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, delay: 0.1 })
    },
    { dependencies: [show], scope: root },
  )

  // estado "scrolled" + link ativo por section
  useGSAP(() => {
    ScrollTrigger.create({
      start: 'top -80',
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    })
    // âncoras da própria página e o link do blog (página /blog), que aqui acompanha a section #blog
    nav.forEach(({ href }) => {
      const target = href.startsWith('#') ? href : href === blogHref() ? '#blog' : null
      if (!target || !document.querySelector(target)) return
      ScrollTrigger.create({
        trigger: target,
        // clamp: o rodapé (#contato) é baixo e nunca chega a 45% da tela; assim ele ativa no fim da página
        start: 'clamp(top 45%)',
        end: 'bottom 45%',
        // calcula depois dos pins das sections (o do "Como funciona" empurra a página); sem isso as
        // posições ficavam adiantadas e o FAQ acendia com o Blog ainda na tela
        refreshPriority: -1,
        onToggle: (self) => self.isActive && setActive(href),
      })
    })
  })

  // menu mobile
  const { contextSafe } = useGSAP({ scope: menu })
  const toggle = contextSafe((next: boolean) => {
    setOpen(next)
    const el = menu.current
    if (!el) return
    if (next) {
      gsap.timeline()
        .set(el, { display: 'flex' })
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' })
        .fromTo('.menu-link', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6 }, '-=0.2')
    } else {
      gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => gsap.set(el, { display: 'none' }) })
    }
  })

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (open) toggle(false)
    if (!href.startsWith('#')) return // link de página (ex.: /blog): navegação normal
    e.preventDefault()
    scrollToAnchor(href)
  }

  return (
    <>
      <header
        ref={root}
        data-intro
        className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4"
      >
        <nav
          ref={pill}
          className={`container-site relative isolate flex items-center justify-between gap-4 rounded-full border border-white/[0.18] pl-5 pr-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.06),0_10px_40px_rgba(0,0,0,0.3)] transition-[padding,background-color] duration-500 ${
            glass ? '' : 'backdrop-blur-2xl backdrop-saturate-[180%]'
          } ${
            scrolled
              ? glass ? 'bg-[rgba(10,13,20,0.55)] py-1.5' : 'bg-[rgba(10,13,20,0.78)] py-1.5'
              : glass ? 'bg-[rgba(14,18,28,0.3)] py-2.5' : 'bg-[rgba(14,18,28,0.55)] py-2.5'
          }`}
        >
          {/* liquid glass (Chromium): o fundo é refratado nas bordas da pílula por um feDisplacementMap */}
          {glass && (
            <>
              <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                  <filter
                    id="liquid-nav"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                    x="0"
                    y="0"
                    width={glass.width}
                    height={glass.height}
                  >
                    <feImage href={glass.map} width={glass.width} height={glass.height} preserveAspectRatio="none" result="map" />
                    {/* cada canal de cor é deslocado um pouco diferente → franja cromática sutil na borda */}
                    <feDisplacementMap in="SourceGraphic" in2="map" scale={glass.scale} xChannelSelector="R" yChannelSelector="G" result="dr" />
                    <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
                    <feDisplacementMap in="SourceGraphic" in2="map" scale={glass.scale * 0.88} xChannelSelector="R" yChannelSelector="G" result="dg" />
                    <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
                    <feDisplacementMap in="SourceGraphic" in2="map" scale={glass.scale * 0.76} xChannelSelector="R" yChannelSelector="G" result="db" />
                    <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
                    <feBlend in="r" in2="g" mode="screen" result="rg" />
                    <feBlend in="rg" in2="b" mode="screen" />
                  </filter>
                </defs>
              </svg>
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                style={{ backdropFilter: 'url(#liquid-nav) blur(3px) saturate(1.6) brightness(0.9)' }}
              />
              {/* reflexo na borda, como o vidro do iOS */}
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[linear-gradient(120deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_30%,rgba(255,255,255,0)_70%,rgba(255,255,255,0.1)_100%)]" />
            </>
          )}
          <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-center text-fog" aria-label={t.common.home}>
            <Logo className="h-[26px] w-auto" />
          </a>

          {/* entre md e lg os 5 links dividem a pílula com o CTA: fonte e espaçamento menores para caber numa linha */}
          <div className="hidden items-center gap-3 text-[13px] md:flex lg:gap-6 lg:text-[15px]">
            {nav.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => go(e, href)}
                className={`relative whitespace-nowrap rounded-md py-1 outline-none transition-colors duration-300 hover:text-sky focus-visible:text-sky focus-visible:ring-1 focus-visible:ring-sky/60 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${
                  active === href ? 'text-fog' : 'text-fog/75'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-mint transition-transform duration-500 ${
                    active === href ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* entre md e lg não cabe na pílula ao lado dos 5 links: ali o seletor fica só no rodapé */}
            <LanguageSwitcher variant="menu" className="md:hidden lg:block" />
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative hidden whitespace-nowrap rounded-full bg-fog px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white sm:block"
            >
              {t.common.talkToAccountant}
              <CursorGlow />
            </a>
            <button
              type="button"
              aria-label={open ? t.common.closeMenu : t.common.openMenu}
              aria-expanded={open}
              onClick={() => toggle(!open)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 md:hidden"
            >
              <span className={`absolute h-px w-4 bg-fog transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-4 bg-fog transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* overlay mobile */}
      <div
        ref={menu}
        className="fixed inset-0 z-[55] hidden flex-col items-center justify-center gap-6 bg-ink/80 backdrop-blur-2xl md:hidden"
        style={{ display: 'none' }}
      >
        {nav.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => go(e, href)}
            className="menu-link text-[clamp(32px,9vw,44px)] font-medium tracking-[-0.03em] text-fog"
          >
            {label}
          </a>
        ))}
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => toggle(false)}
          className="menu-link mt-4 rounded-full bg-fog px-7 py-4 text-base font-semibold text-[#0a0a0a]"
        >
          {t.common.talkToAccountant}
        </a>
      </div>
    </>
  )
}
