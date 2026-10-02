import { useCallback, useEffect, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother, MOTION_OK } from './lib/gsap'
import { Preloader } from './components/Preloader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { About } from './components/About'
import { Process } from './components/Process'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'
import { StackSection } from './components/StackSection'
import { ScrollProgress } from './components/ScrollProgress'
import { WhatsAppButton } from './components/WhatsAppButton'

export default function App() {
  const [intro, setIntro] = useState(false)
  const introDone = useCallback(() => setIntro(true), [])

  // scroll suave + transição "cartões empilhados" entre as sections
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
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

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero play={intro} />
            <Services />
            <About />
            <Process />
            <StackSection id="contato" z={5} innerClassName="bg-ink">
              <Testimonials />
              <Footer />
            </StackSection>
          </main>
        </div>
      </div>
    </>
  )
}
