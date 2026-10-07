import { ptBR, type Dictionary } from './locales/pt-BR'
import { en } from './locales/en'
import { es } from './locales/es'
import { legalPtBR } from './legal/pt-BR'
import { legalEn } from './legal/en'
import { legalEs } from './legal/es'
import type { LegalDocs, LegalKey } from './types'
import { company } from '../data/company'

export type { Dictionary }

/**
 * Idiomas do site.
 *
 * O idioma vem só da URL: `/` é pt-BR, `/en` inglês e `/es` espanhol; as
 * páginas legais ficam em `/<prefixo>/<slug>` (ex.: /en/privacy). Trocar de
 * idioma é uma navegação comum, então tudo aqui é resolvido uma única vez, na
 * carga do módulo, e os componentes leem `t` direto, sem contexto nem re-render.
 *
 * Idioma novo: adicione em `locales`, `prefixes`, `dictionaries`, `legalDocs`
 * e `labels`, e crie os arquivos em locales/ e legal/.
 */
export const locales = ['pt-BR', 'en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'pt-BR'

/** Prefixo de URL de cada idioma; o padrão fica na raiz. */
const prefixes: Record<Locale, string> = { 'pt-BR': '', en: 'en', es: 'es' }
const dictionaries: Record<Locale, Dictionary> = { 'pt-BR': ptBR, en, es }
const legalDocs: Record<Locale, LegalDocs> = { 'pt-BR': legalPtBR, en: legalEn, es: legalEs }
const labels: Record<Locale, { short: string; name: string }> = {
  'pt-BR': { short: 'PT', name: 'Português' },
  en: { short: 'EN', name: 'English' },
  es: { short: 'ES', name: 'Español' },
}

/** Segmento do blog na URL, igual nos três idiomas: /blog, /en/blog, /es/blog/<slug>. */
const BLOG_SLUG = 'blog'
const POST_PATH = new RegExp(`^${BLOG_SLUG}/([a-z0-9]+(?:-[a-z0-9]+)*)$`)

export type Page =
  | { kind: 'home' }
  | { kind: 'legal'; key: LegalKey }
  | { kind: 'blog' }
  | { kind: 'post'; slug: string }

/** Qualquer caminho que não seja uma página legal cai no site de página única. */
function resolve(pathname: string): { locale: Locale; page: Page } {
  const segments = pathname.split('/').filter(Boolean)
  const found = locales.find((l) => prefixes[l] && prefixes[l] === segments[0]?.toLowerCase())
  const locale = found ?? defaultLocale
  const rest = (found ? segments.slice(1) : segments).join('/')
  const docs = legalDocs[locale]
  const key = (Object.keys(docs) as LegalKey[]).find((k) => docs[k].slug === rest)
  if (key) return { locale, page: { kind: 'legal', key } }
  if (rest === BLOG_SLUG) return { locale, page: { kind: 'blog' } }
  const post = POST_PATH.exec(rest)
  if (post) return { locale, page: { kind: 'post', slug: post[1] } }
  return { locale, page: { kind: 'home' } }
}

const current = resolve(window.location.pathname)

export const locale = current.locale
export const page = current.page
/** Textos do idioma atual. */
export const t = dictionaries[locale]
/** Textos legais do idioma atual. */
export const legal = legalDocs[locale]

export function homeHref(l: Locale = locale) {
  return '/' + prefixes[l]
}

export function legalHref(key: LegalKey, l: Locale = locale) {
  return `${prefixes[l] ? '/' + prefixes[l] : ''}/${legalDocs[l][key].slug}`
}

export function blogHref(l: Locale = locale) {
  return `${prefixes[l] ? '/' + prefixes[l] : ''}/${BLOG_SLUG}`
}

export function postHref(slug: string, l: Locale = locale) {
  return `${blogHref(l)}/${slug}`
}

/** A mesma página em outro idioma. */
export function pageHref(p: Page, l: Locale = locale) {
  switch (p.kind) {
    case 'legal':
      return legalHref(p.key, l)
    case 'blog':
      return blogHref(l)
    case 'post':
      return postHref(p.slug, l)
    default:
      return homeHref(l)
  }
}

/** A página atual em cada idioma: alimenta o seletor de idioma e as tags hreflang. */
export const localeOptions = locales.map((l) => ({
  locale: l,
  ...labels[l],
  href: pageHref(page, l),
}))

/**
 * Ajusta `<html lang>`, título, descrição e as tags hreflang para o idioma
 * atual (o index.html sai em português). Chamar antes do primeiro render.
 */
export function applyDocumentMeta() {
  document.documentElement.lang = locale
  document.title = t.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)

  const alternates = [...localeOptions.map((o) => [o.locale, o.href]), ['x-default', localeOptions[0].href]]
  alternates.forEach(([hreflang, href]) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    link.href = window.location.origin + href
    document.head.append(link)
  })

  // canonical sempre no domínio definitivo, mesmo com o site servido de outro host
  const canonical = document.createElement('link')
  canonical.rel = 'canonical'
  canonical.href = company.url + pageHref(page)
  document.head.append(canonical)
}
