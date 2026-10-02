import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LegalPage } from './components/LegalPage'
import { legalDocs, type LegalSlug } from './data/legal'
import { initPerf, watchPerf } from './lib/perf'

// Modo de performance decidido antes do primeiro render (o CSS e o GSAP leem).
initPerf()

// Roteamento mínimo por caminho: /privacidade e /termos são páginas de texto;
// qualquer outro caminho cai no site de página única.
const slug = window.location.pathname.replace(/^\/+|\/+$/g, '')
const page = slug in legalDocs ? <LegalPage slug={slug as LegalSlug} /> : <App />

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)

// Medições reais de fps só no site (as páginas legais são leves de qualquer jeito).
if (!(slug in legalDocs)) watchPerf()
