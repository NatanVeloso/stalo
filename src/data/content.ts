import { blogHref, t, type Dictionary } from '../i18n'
import { company } from './company'

/**
 * Conteúdo do site pronto para os componentes: junta o que não muda por
 * idioma (links, imagens, tons, ordem) com os textos do idioma atual (`t`).
 * Texto novo entra em src/i18n/locales, nunca aqui.
 */

export const nav = [
  { label: t.nav.services, href: '#servicos' },
  { label: t.nav.about, href: '#sobre' },
  { label: t.nav.process, href: '#processo' },
  { label: t.nav.blog, href: blogHref() },
  { label: t.nav.faq, href: '#faq' },
  { label: t.nav.contact, href: '#contato' },
]

export const contact = {
  email: company.email,
  phone: company.phone,
  phoneHref: company.phoneHref,
  whatsapp: `https://wa.me/${company.whatsappNumber}?text=` + encodeURIComponent(t.common.whatsappMessage),
}

// Fotos provisórias dos cards de serviço (Unsplash), substituir pelas definitivas
const servicePhoto = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`

type ServiceId = keyof Dictionary['services']['items']

// a ordem aqui é a ordem dos cards; título e texto vêm do dicionário pela chave
const serviceMedia: { id: ServiceId; image: string }[] = [
  { id: 'accounting', image: servicePhoto('1554224155-6726b3ff858f') },
  { id: 'hr', image: servicePhoto('1522071820081-009f0129c71c') },
  { id: 'tax', image: servicePhoto('1450101499163-c8848c66ca85') },
  { id: 'bpo', image: servicePhoto('1454165804606-c3d57bc86b40') },
  { id: 'recovery', image: servicePhoto('1554224154-26032ffc0d07') },
  { id: 'success', image: servicePhoto('1551288049-bebda4e38f71') },
]

export const services = serviceMedia.map(({ id, image }, i) => ({
  n: String(i + 1).padStart(2, '0'),
  image,
  ...t.services.items[id],
}))

export const servicesCta = { label: t.common.talkToConsultant, href: contact.whatsapp }

export const marquee = t.services.marquee

export const stats = t.about.stats

export const values = t.about.values

export type StepTone = 'dark' | 'light'
type StepId = keyof Dictionary['process']['steps']

const stepMedia: { id: StepId; image: string; tone: StepTone; bg: string }[] = [
  {
    id: 'analysis',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
    tone: 'dark',
    bg: 'bg-navy',
  },
  {
    id: 'strategy',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    tone: 'light',
    bg: 'bg-paper',
  },
  {
    id: 'support',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    tone: 'dark',
    bg: 'bg-teal-deep',
  },
]

export const steps = stepMedia.map(({ id, ...media }, i) => ({
  n: String(i + 1).padStart(2, '0'),
  ...media,
  ...t.process.steps[id],
}))

export type Testimonial = { text: string; author: string; company: string; avatar?: string }

/**
 * Carrossel de logos na base da hero (ClientLogos.tsx). Cliente novo: basta
 * incluir aqui, com o logo claro (para fundo escuro) em public/clientes.
 */
export const clients = [
  { name: 'Supriloc', src: '/clientes/supriloc-branca.avif' },
  { name: 'Lissen Fit Wear', src: '/clientes/lissen.avif' },
  { name: 'Tshirteria', src: '/clientes/tshirteria.avif' },
  { name: 'Sky Consórcios', src: '/clientes/sky.avif' },
]

/** Seção "Resultados": carrossel de depoimentos sobre a foto (ou vídeo) do escritório. */
export const results = {
  title: t.results.title,
  accent: t.results.accent,
  lead: t.results.lead,
  background: '/clientes/escritorio-blur.webp',
  testimonials: [
    {
      text: t.results.quotes.emanoel,
      author: 'Emanoel Oliveira',
      company: 'Gene Digital',
      avatar: '/clientes/emanoel-oliveira.avif',
    },
    {
      text: t.results.quotes.walex,
      author: 'Walex Mateus',
      company: 'Jarbas.ai',
      avatar: '/clientes/walex-mateus.avif',
    },
    // PLACEHOLDERS (ver aviso em t.results.placeholders): trocar por depoimentos reais antes de publicar
    ...t.results.placeholders.map((p) => ({
      text: p.text,
      author: t.results.placeholderAuthor,
      company: p.company,
      avatar: undefined,
    })),
  ] satisfies Testimonial[],
}

/** Seção "Perguntas frequentes" (sanfona), logo antes dos depoimentos. */
export const faq = t.faq

export const footerLinks = [
  { label: t.footer.links.solutions, href: '#servicos' },
  { label: t.footer.links.portal, href: '#' },
  { label: t.footer.links.process, href: '#processo' },
  { label: t.footer.links.contact, href: '#contato' },
  { label: t.footer.links.faq, href: '#faq' },
  { label: t.footer.links.blog, href: blogHref() },
]

export const images = {
  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
  about: '/sobre.webp',
  contact: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
}

/**
 * Vídeos de fundo (BackgroundVideo.tsx). Vazio = fica só a imagem de `images`
 * / `results.background`, que também serve de poster enquanto o vídeo carrega
 * e de fallback no modo leve. Coloque os arquivos em public/videos (mp4 H.264,
 * sem áudio, de preferência até ~5 MB) e aponte aqui, ex.: '/videos/hero.mp4'.
 */
export const videos = {
  hero: '/videos/hero.mp4',
  results: '',
}
