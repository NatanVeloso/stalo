import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LegalPage } from './components/LegalPage'
import { applyDocumentMeta, page } from './i18n'
import { initPerf, watchPerf } from './lib/perf'
import { initPixel } from './lib/pixel'

// Modo de performance decidido antes do primeiro render (o CSS e o GSAP leem).
initPerf()
applyDocumentMeta()
initPixel()

// Roteamento mínimo por caminho, resolvido em src/i18n junto com o idioma: as
// páginas legais são só texto; qualquer outro caminho cai no site de página única.
const root = page.kind === 'legal' ? <LegalPage docKey={page.key} /> : <App />

createRoot(document.getElementById('root')!).render(<StrictMode>{root}</StrictMode>)

// Medições reais de fps só no site (as páginas legais são leves de qualquer jeito).
if (page.kind === 'home') watchPerf()
