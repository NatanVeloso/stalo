import { useRef } from 'react'
import { gsap, useGSAP, heavy, MOTION_OK } from '../lib/gsap'
import { revealLines } from '../lib/reveal'
import { values, stats, images } from '../data/content'
import { sobreHref, t } from '../i18n'
import { CursorGlow } from './CursorGlow'

/**
 * "Sobre" da home (12/10/2026): painel escuro nas cores da foto do CEO
 * (parede azul-ardósia, LED violeta atrás do retrato, mesa quase preta), com o
 * texto à esquerda e o retrato à direita fundindo no fundo pela base. A
 * diagonal do topo é a própria section: ela sobe por cima do espaço do
 * SectionDivider (margem negativa) e é recortada por clip-path, então o
 * triângulo tem exatamente a cor, o grão e as ripas da section.
 *
 * Fundo (13/10/2026): a cena da foto continua para fora do retrato. As ripas
 * verticais da parede viram fios finos à direita, a luz violeta do LED vira uma
 * elipse de luz atrás do retrato (`.glow`, com parallax) e um halo mint fraco
 * marca onde o gráfico termina. Tudo estático em CSS (barato no modo leve); só
 * o `.glow` e o gráfico animam, e dentro de `heavy()`. A coluna do texto fica
 * quieta de propósito: só gradiente e grão.
 */
/** Ruído de feTurbulence num tile pequeno: a textura é gerada pelo navegador, sem imagem. */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

/** Pontos do gráfico atrás do retrato (viewBox 640×420, base em y = 400). */
const GRAFICO = [[40, 330], [116, 300], [192, 312], [268, 250], [344, 262], [420, 196], [496, 170], [572, 90]] as const

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q('.title')[0])

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from([...q('.eyebrow'), ...q('.lead')], {
          y: 20,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: q('.lead'), start: 'top 85%', once: true },
        })
        // retrato: sobe de dentro da máscara e a imagem "assenta"
        gsap
          .timeline({ scrollTrigger: { trigger: q('.img-wrap'), start: 'top 78%', once: true } })
          .fromTo(
            q('.img-wrap'),
            { clipPath: 'inset(100% 0% 0% 0% round 32px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4, ease: 'power4.inOut' },
          )
          .from(q('.img'), { scale: 1.2, duration: 1.8, ease: 'power3.out' }, 0)
          .from(q('.glow'), { autoAlpha: 0, scale: 0.6, duration: 1.6, ease: 'power2.out' }, 0.3)
        gsap.from(q('.value'), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: q('.values'), start: 'top 88%', once: true },
        })
        // números: entram em stagger e contam de 0 até o valor
        gsap.from(q('.stat'), {
          y: 32,
          autoAlpha: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: q('.stats'), start: 'top 88%', once: true },
        })
        q('.stat-num').forEach((el) => {
          gsap.from(el, {
            textContent: 0,
            snap: { textContent: 1 },
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })
      })

      heavy(() => {
        // gráfico de resultado: a linha se desenha no scroll, os fechamentos aparecem em seguida e o último pulsa
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%', once: true } })
          .from(q('.chart-line'), { drawSVG: '0%', duration: 2.6, ease: 'power2.inOut' })
          .from(q('.chart-area'), { autoAlpha: 0, duration: 1.2 }, 0.8)
          .from(q('.chart-dot'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.18, duration: 0.5, ease: 'back.out(2)' }, 0.6)
          .from(q('.chart-bar'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.4)
        gsap.to(q('.chart-pulse'), { scale: 2.4, autoAlpha: 0, transformOrigin: '50% 50%', duration: 2, repeat: -1, ease: 'power1.out' })
        gsap.to(q('.chart'), {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.fromTo(
          q('.img'),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: q('.img-wrap'), start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.to(q('.glow'), {
          y: -120,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section
      id="sobre"
      ref={root}
      className="relative -mt-14 overflow-hidden bg-dusk px-6 pb-24 pt-28 text-fog [clip-path:polygon(0_3.5rem,100%_0,100%_100%,0_100%)] sm:-mt-20 sm:pt-[8.5rem] sm:[clip-path:polygon(0_5rem,100%_0,100%_100%,0_100%)] md:-mt-28 md:pb-32 md:pt-48 md:[clip-path:polygon(0_7rem,100%_0,100%_100%,0_100%)]"
    >
      {/* fundo contínuo com a foto: ⚠ o primeiro stop tem de ser a cor do triângulo do divisor acima */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-dusk)_0%,#191d2e_46%,#0e1120_100%)]" />
      {/* ripas: fios verticais no passo das ripas da parede da foto, continuando a parede para fora do
          retrato. A máscara concentra na metade direita e esvai antes de chegar ao texto. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%] bg-[repeating-linear-gradient(90deg,rgba(197,211,227,0.14)_0_1px,transparent_1px_36px)] [mask-image:radial-gradient(64%_62%_at_100%_40%,#000_14%,transparent_100%)] lg:w-[50%]" />
      {/* luz do LED: elipse violeta inclinada como a diagonal do topo, atrás do canto superior do retrato */}
      <div className="glow pointer-events-none absolute right-[-30%] top-[3%] h-[380px] w-[620px] rotate-[-14deg] rounded-[50%] bg-[radial-gradient(closest-side,rgba(139,110,230,0.36),rgba(139,110,230,0.13)_46%,transparent_74%)] md:right-[-14%] md:top-[1%] md:h-[520px] md:w-[860px]" />
      {/* halo mint fraco na base direita: a luz "chega" onde o gráfico termina */}
      <div className="pointer-events-none absolute bottom-[4%] right-[-8%] hidden h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(126,224,176,0.09),transparent_70%)] lg:block" />
      {/* leve claridade fria na base esquerda, só para a coluna do texto não ficar chapada */}
      <div className="pointer-events-none absolute bottom-[-24%] left-[-20%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(185,212,255,0.07),transparent_70%)]" />
      {/* grão fino: tira o aspecto de gradiente liso e aproxima do grão da parede na foto */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-soft-light"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '180px 180px' }}
      />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="eyebrow m-0 mb-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky/80">{t.about.eyebrow}</p>
          <h2 className="title m-0 mb-6 max-w-[560px] text-balance text-[clamp(34px,4vw,54px)] font-medium leading-[1.04] tracking-[-0.03em]">
            {t.about.title} <span className="serif-italic">{t.about.accent}</span>
          </h2>
          <p className="lead m-0 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-fog/75 md:text-[18px]">{t.about.lead}</p>

          {/* três compromissos em lista, não em caixinhas: a numeração é o único ornamento */}
          <ol className="values m-0 mt-10 list-none border-t border-white/10 p-0">
            {values.map((v, i) => (
              <li key={v.title} className="value grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-b border-white/10 py-4">
                <span className="serif-italic text-[20px] leading-none text-sky/80">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="text-[17px] font-medium tracking-[-0.01em]">{v.title}</span>
                  <span className="text-[15px] text-fog/55">{v.text}</span>
                </div>
              </li>
            ))}
          </ol>

          {/* a página "Sobre nós" conta o resto: história, missão, visão e valores */}
          <a
            href={sobreHref()}
            className="value group/mais relative mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-3 pl-6 pr-2 text-[15px] font-semibold transition-colors duration-300 hover:bg-white/[0.12] active:scale-[0.98]"
          >
            {t.about.more}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover/mais:bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover/mais:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            <CursorGlow />
          </a>
        </div>

        {/* retrato: cantos arredondados em cima, base fundindo no fundo (sem moldura) */}
        <div className="relative order-1 lg:order-2">
          {/* gráfico de resultado ATRÁS do retrato: só aparece à direita do retrato e abaixo dele.
              ⚠ A base do retrato esmaece para transparente (mask-image), então o gráfico atrás apareceria
              POR DENTRO da foto e pareceria estar na frente. A caixa de recorte, parada, mascara tudo o
              que cai no retângulo da foto: visível à direita de 480px (= borda direita da foto, pois a
              caixa avança 160px além dela) OU abaixo de 364px (= base da foto, pois a caixa desce 96px
              além dela), com um fade curto na base para a linha "sair de trás". A caixa é 40px mais alta
              que o desenho porque o parallax do `.chart` sobe até 40px: o recorte não acompanha. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-40 z-0 hidden h-[460px] w-[640px] lg:block [mask-image:linear-gradient(to_right,transparent_480px,#000_480px),linear-gradient(to_bottom,transparent_364px,#000_416px)]"
          >
            {/* cada vela fica sob um ponto da linha e começa abaixo dele, sem passar do desenho */}
            <svg viewBox="0 0 640 420" fill="none" className="chart absolute bottom-0 left-0 h-[420px] w-[640px]">
              <defs>
                <linearGradient id="sobre-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#b9d4ff" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#b9d4ff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sobre-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#b9d4ff" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#7ee0b0" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* velas: centradas em cada ponto, do ponto (com folga) até a base do gráfico */}
              {GRAFICO.map(([x, y]) => (
                <rect key={x} className="chart-bar" x={x - 11} y={y + 14} width="22" height={400 - (y + 14)} rx="3" fill="rgba(197,211,227,0.07)" />
              ))}
              <path className="chart-area" d={`M${GRAFICO.map(([x, y]) => `${x},${y}`).join(' L')} L572,400 L40,400 Z`} fill="url(#sobre-area)" />
              <path className="chart-line" d={`M${GRAFICO.map(([x, y]) => `${x},${y}`).join(' L')}`} stroke="url(#sobre-line)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
              {GRAFICO.filter((_, i) => i % 2 === 1 && i < GRAFICO.length - 1).map(([x, y]) => (
                <circle key={x} className="chart-dot" cx={x} cy={y} r="3.5" fill="#0e1120" stroke="#b9d4ff" strokeWidth="1.5" />
              ))}
              <circle className="chart-pulse" cx="572" cy="90" r="6" stroke="#7ee0b0" strokeWidth="1" />
              <circle className="chart-dot" cx="572" cy="90" r="4" fill="#7ee0b0" />
            </svg>
          </div>
          <div className="img-wrap relative z-10 mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-[32px] lg:max-w-none [mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)]">
            <img
              src={images.aboutHome}
              alt={t.about.eyebrow}
              loading="lazy"
              decoding="async"
              className="img absolute inset-0 h-full w-full scale-[1.04] object-cover will-change-transform"
            />
            {/* a luz violeta da foto continua pela borda */}
            <div className="pointer-events-none absolute inset-0 rounded-[32px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
          </div>
        </div>
      </div>

      {/* números em linha, separados por fios */}
      <div className="stats container-site relative mt-16 grid gap-8 border-t border-white/10 pt-10 md:mt-20 md:grid-cols-3 md:gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className={`stat ${i ? 'md:border-l md:border-white/10 md:pl-8' : ''}`}>
            <div className="mb-3 flex items-baseline gap-1 text-[clamp(46px,5vw,68px)] font-medium leading-none tracking-[-0.04em]">
              {s.prefix && <span className="serif-italic text-[0.8em] text-sky">{s.prefix}</span>}
              <span className="stat-num tabular-nums" data-value={s.value}>
                {s.value}
              </span>
              {s.suffix && <span className="serif-italic text-[0.7em] text-sky">{s.suffix}</span>}
            </div>
            <div className="text-[16px] font-medium">{s.label}</div>
            {s.sub && <div className="mt-1 text-[14px] leading-[1.45] text-fog/55">{s.sub}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
