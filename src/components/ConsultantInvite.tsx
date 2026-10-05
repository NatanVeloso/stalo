import { useEffect, useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { contact } from '../data/content'
import { t } from '../i18n'
import { Logo } from './Logo'
import { CursorGlow } from './CursorGlow'

type Props = {
  /** Só começa a contar depois do preloader. */
  ready: boolean
}

/** Tempo no site até o convite aparecer. */
const DELAY = 2 * 60 * 1000
/** sessionStorage: milissegundos já contados nesta sessão, ou `done` quando não deve mais abrir. */
const KEY = 'stalo:invite'

function read(): number | 'done' {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === 'done' ? 'done' : Number(v) || 0
  } catch {
    return 0
  }
}

function write(v: number | 'done') {
  try {
    sessionStorage.setItem(KEY, String(v))
  } catch {
    /* sem storage: a contagem recomeça na próxima carga */
  }
}

/**
 * Convite para falar com um consultor: modal no centro da tela depois de 2 min
 * no site. Abre no máximo uma vez por sessão e nunca para quem já clicou num
 * link do WhatsApp. A contagem só anda com a aba visível e fica no
 * sessionStorage, porque trocar de idioma recarrega a página e zeraria o tempo.
 * `?invite` na URL abre em instantes, para testar.
 */
export function ConsultantInvite({ ready }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const titleId = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!ready) return
    const force = new URLSearchParams(window.location.search).has('invite')
    const saved = force ? DELAY - 1500 : read()
    if (saved === 'done') return
    let elapsed = saved

    const stop = () => {
      write('done')
      window.clearInterval(timer)
      document.removeEventListener('click', onClick, true)
    }
    // quem já foi para o WhatsApp não precisa do convite
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('a[href*="wa.me/"]')) stop()
    }
    const timer = window.setInterval(() => {
      if (document.hidden) return
      elapsed += 1000
      if (elapsed < DELAY) return write(elapsed)
      stop()
      setOpen(true)
    }, 1000)
    document.addEventListener('click', onClick, true)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('click', onClick, true)
    }
  }, [ready])

  useGSAP(
    () => {
      if (!open) return
      const q = gsap.utils.selector(root)
      tl.current = gsap
        .timeline()
        .from(q('.veil'), { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0)
        .from(q('.card'), { y: 48, scale: 0.92, autoAlpha: 0, duration: 0.9 }, 0.05)
        .from(q('.mark'), { rotation: -180, scale: 0.3, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.2)
        .from(q('.line'), { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, 0.3)
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) tl.current.progress(1)
    },
    { dependencies: [open], scope: root },
  )

  const close = () => {
    const timeline = tl.current
    if (!timeline || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setOpen(false)
    timeline.eventCallback('onReverseComplete', () => setOpen(false))
    timeline.timeScale(2.4).reverse()
  }

  // enquanto aberto: foco preso no modal, Esc fecha e a página de trás não rola
  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    // o foco vai para o próprio diálogo: os botões ainda estão invisíveis na entrada e não aceitam foco
    root.current?.focus({ preventScroll: true })

    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab' || !root.current) return
      const items = root.current.querySelectorAll<HTMLElement>('a[href], button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === root.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // bloquear o evento serve para os dois modos: o ScrollSmoother só segue o scroll nativo
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('keydown', key)
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('touchmove', block, { passive: false })

    return () => {
      document.removeEventListener('keydown', key)
      window.removeEventListener('wheel', block)
      window.removeEventListener('touchmove', block)
      before?.focus?.({ preventScroll: true })
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[80] flex items-center justify-center p-5 outline-none"
    >
      <div className="veil absolute inset-0 bg-ink/75" onClick={close} />

      {/* fundo sólido em vez de vidro: sem backdrop-filter não precisa de versão para o modo leve */}
      <div className="card relative w-full max-w-[460px] overflow-hidden rounded-[32px] border border-white/[0.14] bg-navy px-7 pb-8 pt-12 text-center text-fog shadow-[0_40px_120px_rgba(0,0,0,0.6)] md:px-10 md:pb-10 md:pt-14">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue opacity-45 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-56 w-56 rounded-full bg-teal opacity-30 blur-[90px]" />

        <button
          type="button"
          onClick={close}
          aria-label={t.invite.close}
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-fog/80 transition-colors duration-300 hover:bg-white/10 hover:text-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="relative">
          <span aria-hidden="true" className="mark mx-auto mb-7 flex h-12 w-12 items-center justify-center">
            <Logo markOnly className="h-12 w-auto" />
          </span>
          <h2
            id={titleId}
            className="line m-0 mb-4 text-balance text-[clamp(30px,6vw,40px)] font-medium leading-[1.05] tracking-[-0.03em]"
          >
            {t.invite.title} <span className="serif-italic">{t.invite.accent}</span>
          </h2>
          <p className="line m-0 mb-8 text-pretty text-base leading-[1.55] text-fog/80">{t.invite.text}</p>
          <div className="line">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="group relative inline-flex items-center gap-3 rounded-full bg-fog py-3 pl-6 pr-2 text-[15px] font-semibold text-[#0a0a0a] transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
            >
              {t.common.talkToConsultant}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-fog">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <CursorGlow />
            </a>
          </div>
          <button
            type="button"
            onClick={close}
            className="line mt-4 cursor-pointer rounded-full border-0 bg-transparent px-4 py-2 text-sm text-fog/65 transition-colors duration-300 hover:text-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            {t.invite.dismiss}
          </button>
        </div>
      </div>
    </div>
  )
}
