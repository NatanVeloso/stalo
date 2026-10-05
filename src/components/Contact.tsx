import { useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { contact, images } from '../data/content'
import { t } from '../i18n'
import { CursorGlow } from './CursorGlow'

const field =
  'w-full rounded-[14px] border border-white/20 bg-white/[0.08] px-[18px] py-[15px] text-fog outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-fog/50 focus:border-white/60 focus:shadow-[0_0_0_4px_rgba(126,224,176,0.12)]'

export function Contact() {
  const root = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)
  const first = useRef(true)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.from([...q('.lead'), ...q('.link')], {
        y: 20,
        autoAlpha: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: q('.card'), start: 'top 70%', once: true },
      })
      gsap.from(q('.field'), {
        x: 30,
        autoAlpha: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: q('.form'), start: 'top 85%', once: true },
      })

      gsap.matchMedia().add(MOTION_OK, () => {
        // cartão "assenta" conforme entra na tela (vai e volta com o scroll)
        gsap.fromTo(
          q('.card'),
          { scale: 0.9, autoAlpha: 0.4 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.card'), start: 'top 95%', end: 'top 35%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  // troca form <-> sucesso
  useGSAP(
    () => {
      if (first.current) {
        first.current = false
        return
      }
      gsap.from('.panel', { y: 24, autoAlpha: 0, scale: 0.97, duration: 0.8 })
    },
    { dependencies: [sent], scope: root },
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div ref={root} className="relative px-6 pb-[120px] pt-16">
      <div
        className="card container-site relative overflow-hidden rounded-5xl bg-[#1a2230] bg-cover bg-center p-[clamp(28px,5vw,64px)] will-change-transform"
        style={{ backgroundImage: `url(${images.contact})` }}
      >
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="title m-0 mb-4 text-[clamp(36px,4.5vw,60px)] font-medium leading-none tracking-[-0.03em]">
              {t.contactForm.title}
            </h2>
            <p className="lead m-0 mb-7 max-w-[420px] text-[17px] leading-[1.55] text-fog/85">
              {t.contactForm.lead}
            </p>
            <div className="flex flex-col gap-2 text-[15px] text-fog/90">
              <a className="link w-fit transition-colors hover:text-sky" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <a className="link w-fit transition-colors hover:text-sky" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </div>
          </div>

          {sent ? (
            <div className="panel glass-strong rounded-[28px] px-8 py-10">
              <div className="mb-2 text-2xl font-medium">{t.contactForm.sentTitle}</div>
              <div className="mb-5 text-[15px] text-fog/80">{t.contactForm.sentText}</div>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="relative cursor-pointer rounded-full border border-white/30 bg-transparent px-[18px] py-3 text-fog transition-colors hover:bg-white/10"
              >
                {t.contactForm.again}
                <CursorGlow />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="panel form glass-strong flex flex-col gap-3 rounded-[28px] p-6">
              <input required name="nome" placeholder={t.contactForm.name} className={`field ${field}`} />
              <input required type="email" name="email" placeholder={t.contactForm.email} className={`field ${field}`} />
              <input name="empresa" placeholder={t.contactForm.company} className={`field ${field}`} />
              <textarea
                rows={3}
                name="mensagem"
                placeholder={t.contactForm.message}
                className={`field resize-y ${field}`}
              />
              <button
                type="submit"
                className="field relative w-full cursor-pointer rounded-full bg-fog p-4 text-[15px] font-semibold text-[#0a0a0a] transition-colors hover:bg-white"
              >
                {t.contactForm.submit}
                <CursorGlow />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
