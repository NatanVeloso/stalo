import { tracking } from '../data/tracking'
import { consent, type Consent } from './consent'

/**
 * Meta Pixel (rastreamento das campanhas do gestor de tráfego).
 *
 * Só carrega se `tracking.metaPixelId` estiver preenchido (data/tracking.ts) E
 * o visitante tiver aceitado os cookies de marketing (lib/consent.ts). Antes do
 * aceite nada é baixado nem enviado; se ele recusar depois, o Pixel para de
 * enviar e os cookies da Meta são apagados.
 *
 * Eventos: `PageView` a cada carregamento (site e páginas legais) e `Contact`
 * em qualquer clique num link do WhatsApp, que é para onde todos os CTAs levam.
 */
type Fbq = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Fbq
  loaded: boolean
  version: string
}

const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq }

function load(id: string) {
  // Mesmo stub do snippet oficial: enfileira as chamadas até o fbevents.js chegar.
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }) as Fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  w.fbq = w._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', id)
  fbq('track', 'PageView')
}

/** Apaga os cookies da Meta no host atual e em cada domínio pai (o Pixel grava no domínio raiz). */
function clearCookies() {
  const parts = window.location.hostname.split('.')
  const domains = ['', ...parts.slice(0, -1).map((_, i) => `; domain=.${parts.slice(i).join('.')}`)]
  for (const name of ['_fbp', '_fbc']) {
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}`
  }
}

export function initPixel() {
  const id = tracking.metaPixelId
  if (!id) return

  let last: Consent | null | undefined
  const sync = () => {
    // reabrir o banner também notifica; só age quando a decisão muda
    if (consent.value === last) return
    last = consent.value
    const granted = consent.value === 'granted'
    if (w.fbq) w.fbq('consent', granted ? 'grant' : 'revoke')
    else if (granted) load(id)
    if (consent.value === 'denied') clearCookies()
  }
  sync()
  consent.subscribe(sync)

  // Um ouvinte só no documento cobre header, seções, FAQ e botão flutuante.
  document.addEventListener(
    'click',
    (e) => {
      if (consent.value !== 'granted') return
      if ((e.target as Element).closest?.('a[href*="wa.me/"]')) w.fbq?.('track', 'Contact')
    },
    true,
  )
}
