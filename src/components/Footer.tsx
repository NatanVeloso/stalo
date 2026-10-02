import { useRef, type MouseEvent } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { contact, footerLinks } from '../data/content'
import { Logo } from './Logo'
import { scrollToAnchor } from './Header'

const socials = [
  {
    label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3V9.5h2.8v1.3h.1a3.1 3.1 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.6V19z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
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
      gsap.from(q('.panel'), {
        y: 50,
        autoAlpha: 0,
        duration: 1.2,
        scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
      })
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
    <footer ref={root} className="relative px-6 pb-8">
      <div className="panel glass container-site rounded-4xl px-[clamp(24px,4vw,48px)] pb-7 pt-12">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex flex-col gap-8">
            <a href="#top" onClick={(e) => go(e, '#top')} className="self-start text-fog" aria-label="Início">
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
                  href="#"
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
          <span>© {new Date().getFullYear()} Stalo Consulting. Todos os direitos reservados.</span>
          <div className="flex flex-wrap gap-6">
            <a href="/privacidade" className="underline underline-offset-[3px] transition-colors hover:text-sky">
              Política de Privacidade
            </a>
            <a href="/termos" className="underline underline-offset-[3px] transition-colors hover:text-sky">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
