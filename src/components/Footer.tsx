import { useRef, type MouseEvent } from 'react'
import { gsap, useGSAP, ScrollTrigger, heavy } from '../lib/gsap'
import { contact, footerLinks } from '../data/content'
import { company } from '../data/company'
import { t, legal, legalHref } from '../i18n'
import { Logo } from './Logo'
import { scrollToAnchor } from './Header'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CookiePreferences } from './CookieConsent'

// Só o Instagram por enquanto; rede nova entra aqui com o link em data/company.ts
const socials = [
  {
    label: 'Instagram',
    href: company.instagram,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
]

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)

      // entrada do painel. Modo leve: sobe e aparece. Modo full: "footer bounce"
      // (demos.gsap.com): quanto mais rápido o scroll chega ao fim da página, mais
      // o painel chega amassado e balança (elastic) antes de assentar.
      const settle = () => {
        gsap.from(q('.panel'), {
          y: 50,
          autoAlpha: 0,
          duration: 1.2,
          scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
        })
      }
      heavy(
        () => {
          gsap.set(q('.panel'), { autoAlpha: 0 })
          ScrollTrigger.create({
            trigger: root.current,
            start: 'top 90%',
            once: true,
            onEnter: (self) => {
              // 0 = devagar, 1 = muito rápido (~5000 px/s); dita o amassado e a força do balanço
              const v = gsap.utils.clamp(0, 1, Math.abs(self.getVelocity()) / 5000)
              const panel = q('.panel')
              gsap.to(panel, { autoAlpha: 1, duration: 0.5, overwrite: 'auto' })
              gsap.fromTo(
                panel,
                { y: 50 + 70 * v, scaleY: 1 - 0.22 * v, transformOrigin: '50% 100%' },
                {
                  y: 0,
                  scaleY: 1,
                  duration: 1.4 + 0.6 * v,
                  ease: `elastic.out(${1 + 0.5 * v}, ${0.8 - 0.4 * v})`,
                },
              )
            },
          })
        },
        { lite: settle, scope: root },
      )
      gsap.from(q('.social'), {
        scale: 0.6,
        autoAlpha: 0,
        stagger: 0.07,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    },
    { scope: root },
  )

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#') || href === '#') return
    e.preventDefault()
    scrollToAnchor(href)
  }

  return (
    // #contato: é para cá que o link "Contato" e o CTA da hero rolam
    <footer ref={root} id="contato" className="relative px-6 pb-8">
      <div className="panel glass container-site rounded-4xl px-[clamp(24px,4vw,48px)] pb-7 pt-12">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex flex-col gap-8">
            <a href="#top" onClick={(e) => go(e, '#top')} className="self-start text-fog" aria-label={t.common.home}>
              <Logo className="h-14 w-auto" />
            </a>
            <div className="flex flex-col gap-2 text-[15px]">
              <a className="w-fit transition-colors hover:text-sky" href={contact.phoneHref}>
                {contact.phone}
              </a>
              <a className="w-fit transition-colors hover:text-sky" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.08] text-fog transition-colors hover:bg-white/[0.16]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 content-start gap-x-[72px] gap-y-5 text-base font-medium">
            {footerLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={(e) => go(e, l.href)} className="transition-colors hover:text-sky">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/[0.14] pt-6 text-sm text-fog/75">
          <span>
            © {new Date().getFullYear()} {company.name}. {t.common.rights}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={legalHref('privacy')} className="underline underline-offset-[3px] transition-colors hover:text-sky">
              {legal.privacy.title}
            </a>
            <a href={legalHref('terms')} className="underline underline-offset-[3px] transition-colors hover:text-sky">
              {legal.terms.title}
            </a>
            <CookiePreferences className="underline underline-offset-[3px] transition-colors hover:text-sky" />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}
