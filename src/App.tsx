import { useCallback, useEffect, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother, heavy } from './lib/gsap'
import { Preloader } from './components/Preloader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { About } from './components/About'
import { Process } from './components/Process'
import { Blog } from './components/Blog'
import { Testimonials } from './components/Testimonials'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { StackSection } from './components/StackSection'
import { SectionDivider } from './components/SectionDivider'
import { ScrollProgress } from './components/ScrollProgress'
import { WhatsAppButton } from './components/WhatsAppButton'
import { CookieConsent } from './components/CookieConsent'
import { ConsultantInvite } from './components/ConsultantInvite'
import type { PostSummary } from './lib/posts'

type Props = {
  /** Últimas publicações do Instagram; vazio = sem a section do blog. */
  posts: PostSummary[]
}

export default function App({ posts }: Props) {
  const [intro, setIntro] = useState(false)
  const introDone = useCallback(() => setIntro(true), [])

  // scroll suave + transição "cartões empilhados" entre as sections.
  // Tudo dentro de heavy(): no modo leve as sections só rolam, sem pin nem smoother.
  useGSAP(() => {
    heavy(() => {
      const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.8, // leve: acompanha a roda sem "arrastar" a página
        effects: false,
      })
      smoother.paused(true) // libera quando o preloader terminar

      const sections = gsap.utils.toArray<HTMLElement>('[data-stack]')
      sections.forEach((section, i) => {
        if (i === sections.length - 1) return
        const inner = section.querySelector('[data-stack-inner]')
        const shade = section.querySelector('[data-stack-shade]')
        const end = () => '+=' + window.innerHeight

        // segura a section quando o fundo dela encosta no viewport; a próxima desliza por cima
        ScrollTrigger.create({
          trigger: section,
          start: 'bottom bottom',
          end,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: 'bottom bottom', end, scrub: true, invalidateOnRefresh: true },
          })
          .to(inner, { scale: 0.92, borderRadius: 40, ease: 'none' }, 0)
          .to(shade, { opacity: 0.65, ease: 'none' }, 0)
      })

      return () => smoother.kill()
    })
  })

  useGSAP(
    () => {
      if (!intro) return
      ScrollSmoother.get()?.paused(false)
      ScrollTrigger.refresh()
    },
    { dependencies: [intro] },
  )

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Preloader onDone={introDone} />
      <ScrollProgress />
      <Header show={intro} />
      <WhatsAppButton show={intro} />
      <CookieConsent show={intro} />
      <ConsultantInvite ready={intro} />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero play={intro} />
            {/* Serviços e Sobre são claros: num cartão só, com corte diagonal, em vez de um cartão claro deslizando sobre outro */}
            <StackSection z={2} innerClassName="bg-paper text-navy">
              <Services />
              <SectionDivider />
              <About />
            </StackSection>
            <Process />
            {posts.length > 0 && <Blog posts={posts} />}
            <StackSection z={6} innerClassName="bg-ink">
              <Faq />
              <Testimonials />
              <Footer />
            </StackSection>
          </main>
        </div>
      </div>
    </>
  )
}
