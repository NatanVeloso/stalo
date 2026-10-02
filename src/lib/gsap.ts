import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrambleTextPlugin,
  CustomEase,
)

// Easings compartilhados — "hero" é uma expo-out suave usada nas revelações grandes.
CustomEase.create('hero', 'M0,0 C0.16,1 0.3,1 1,1')
CustomEase.create('soft', 'M0,0 C0.25,0.1 0.25,1 1,1')

gsap.defaults({ ease: 'hero', duration: 1 })

ScrollTrigger.config({ ignoreMobileResize: true })

/** Media query usada em gsap.matchMedia() para pular animações pesadas. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText }
