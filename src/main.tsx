import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LegalPage } from './components/LegalPage'
import { BlogPage } from './components/BlogPage'
import { PostPage } from './components/PostPage'
import { applyDocumentMeta, page } from './i18n'
import { initPerf, watchPerf } from './lib/perf'
import { initPixel } from './lib/pixel'
import { fetchHomePosts } from './lib/posts'

// Modo de performance decidido antes do primeiro render (o CSS e o GSAP leem).
initPerf()
applyDocumentMeta()
initPixel()

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
  ) : (
    <App posts={await fetchHomePosts()} />
  )

createRoot(document.getElementById('root')!).render(<StrictMode>{root}</StrictMode>)

// Medições reais de fps só no site (as páginas legais são leves de qualquer jeito).
if (page.kind === 'home') watchPerf()
