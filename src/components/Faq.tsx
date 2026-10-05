import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { faq, servicesCta } from '../data/content'
import { CursorGlow } from './CursorGlow'

/**
 * "Perguntas frequentes": sanfona com uma resposta aberta por vez, logo antes
 * dos depoimentos. A altura abre por grid-template-rows (0fr → 1fr),
 * sem medir nada em JS; o ScrollSmoother acompanha a mudança de altura sozinho.
 */
export function Faq() {
  const root = useRef<HTMLDivElement>(null)
  const uid = useId()
  const [open, setOpen] = useState(-1) // -1: todas fechadas

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.from(q('.lead'), {
        y: 20,
        autoAlpha: 0,
        scrollTrigger: { trigger: q('.title'), start: 'top 80%', once: true },
      })
      gsap.from(q('.item'), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.1,
        scrollTrigger: { trigger: q('.items'), start: 'top 85%', once: true },
      })
      gsap.from(q('.cta'), {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        scrollTrigger: { trigger: q('.cta'), start: 'top 90%', once: true },
      })
    },
    { scope: root },
  )

  return (
    // pt alto: o header fixo ocupa os ~80px de cima quando o link #faq rola até aqui
    // bloco claro no topo da section escura: os cantos de baixo arredondados fecham o "cartão" antes dos depoimentos
    <div
      ref={root}
      id="faq"
      className="relative overflow-hidden rounded-b-[28px] bg-paper px-6 pb-20 pt-24 text-navy md:rounded-b-[40px] md:pb-24 md:pt-28"
    >
      {/* fundo: grade de pontinhos que some em direção às bordas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(11,18,32,0.2)_1px,transparent_1.6px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_25%,transparent_100%)]"
      />

      {/* no desktop o convite fica embaixo do título; no mobile, depois das perguntas */}
      <div className="container-site relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div>
          <h2 className="title m-0 mb-4 text-balance text-[clamp(36px,4.6vw,60px)] font-medium leading-[1.02] tracking-[-0.03em]">
            {faq.title} <span className="serif-italic">{faq.accent}</span>
          </h2>
          <p className="lead m-0 max-w-[380px] text-[17px] leading-[1.55] text-slate-2">{faq.lead}</p>
        </div>

        <div className="items flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className={`item rounded-[22px] border transition-[background-color,border-color,box-shadow] duration-300 ${
                  isOpen
                    ? 'border-navy/[0.12] bg-white shadow-[0_12px_40px_rgba(11,18,32,0.06)]'
                    : 'border-navy/[0.08] bg-white/70 hover:bg-white'
                }`}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`${uid}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-[22px] border-0 bg-transparent px-6 py-5 text-left text-[17px] font-medium leading-[1.3] text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:px-7 md:py-6 md:text-[19px]"
                  >
                    <span className="font-mono text-[13px] tabular-nums text-navy/45">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-pretty">{item.q}</span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/[0.12] transition-[transform,background-color,color] duration-300 ${
                        isOpen ? 'rotate-45 bg-navy text-fog' : 'bg-navy/[0.04]'
                      }`}
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                {/* fechada fica invisible para o leitor de tela não ler a resposta escondida */}
                <div
                  id={`${uid}-a-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q-${i}`}
                  className={`grid transition-[grid-template-rows,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 max-w-[62ch] text-pretty px-6 pb-6 text-base leading-[1.6] text-slate-2 md:px-7 md:pb-7">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cta self-start rounded-[22px] border border-navy/[0.08] bg-white/70 p-7 lg:col-start-1 lg:row-start-2">
          <div className="mb-1.5 text-[19px] font-medium">{faq.cta.title}</div>
          <p className="m-0 mb-6 text-pretty text-base leading-[1.55] text-slate-2">{faq.cta.text}</p>
          <a
            href={servicesCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-3 rounded-full bg-navy py-3 pl-6 pr-2 text-[15px] font-semibold text-fog shadow-[0_8px_24px_rgba(11,18,32,0.18)] transition-[background-color,box-shadow] duration-300 hover:bg-blue"
          >
            {servicesCta.label}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <CursorGlow />
          </a>
        </div>
      </div>
    </div>
  )
}
