import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LegalPage } from './components/LegalPage'
import { legalDocs, type LegalSlug } from './data/legal'

// Roteamento mínimo por caminho: /privacidade e /termos são páginas de texto;
// qualquer outro caminho cai no site de página única.
const slug = window.location.pathname.replace(/^\/+|\/+$/g, '')
const page = slug in legalDocs ? <LegalPage slug={slug as LegalSlug} /> : <App />

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)
