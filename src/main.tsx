import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LegalPage } from './components/LegalPage'
import { BlogPage } from './components/BlogPage'
import { PostPage } from './components/PostPage'
import { AboutPage } from './components/AboutPage'
import { TeamPage } from './components/TeamPage'
import { applyDocumentMeta, page } from './i18n'
import { stashHash } from './lib/hash'
import { initPerf, watchPerf } from './lib/perf'
import { initPixel } from './lib/pixel'
import { fetchHomePosts } from './lib/posts'

// Modo de performance decidido antes do primeiro render (o CSS e o GSAP leem).
initPerf()
applyDocumentMeta()
initPixel()
// Âncora na URL da home: guardada e tirada ANTES do primeiro render, para o salto nativo não rolar a página (ver lib/hash.ts).
if (page.kind === 'home') stashHash()

// Roteamento mínimo por caminho, resolvido em src/i18n junto com o idioma: as
// páginas legais e o blog são páginas estáticas; qualquer outro caminho cai no
// site de página única. A home recebe as últimas publicações já carregadas,
// para a section do blog não mudar de altura depois que os pins do scroll existem.
const root =
  page.kind === 'legal' ? (
    <LegalPage docKey={page.key} />
  ) : page.kind === 'blog' ? (
    <BlogPage />
  ) : page.kind === 'post' ? (
    <PostPage slug={page.slug} />
  ) : page.kind === 'sobre' ? (
    <AboutPage />
  ) : page.kind === 'equipe' ? (
    <TeamPage />
  ) : (
    <App posts={await fetchHomePosts()} />
  )

createRoot(document.getElementById('root')!).render(<StrictMode>{root}</StrictMode>)

// Medições reais de fps só no site (as páginas legais são leves de qualquer jeito).
if (page.kind === 'home') watchPerf()
