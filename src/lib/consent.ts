import { useSyncExternalStore } from 'react'

/**
 * Consentimento para cookies não essenciais (LGPD, art. 7º, I).
 *
 * Sem decisão, nada de marketing carrega e o banner fica aberto. A escolha
 * (`granted` ou `denied`) vai para o localStorage e vale por 12 meses; depois
 * disso o banner pergunta de novo. `reopen()` reabre o banner para o visitante
 * mudar de ideia (link "Preferências de cookies" no rodapé).
 *
 * Quem depende do consentimento (lib/pixel.ts) assina `subscribe`.
 */
export type Consent = 'granted' | 'denied'

const KEY = 'stalo:consent'
const TTL = 365 * 24 * 60 * 60 * 1000
const listeners = new Set<() => void>()

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as { value: Consent; t: number }
    if (Date.now() - s.t > TTL) return null
    return s.value === 'granted' || s.value === 'denied' ? s.value : null
  } catch {
    return null
  }
}

const saved = read()
let state: { value: Consent | null; open: boolean } = { value: saved, open: saved === null }

function set(next: typeof state) {
  state = next
  listeners.forEach((fn) => fn())
}

export const consent = {
  get value() {
    return state.value
  },
  decide(value: Consent) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, t: Date.now() }))
    } catch {
      /* sem storage: vale só nesta visita e o banner volta na próxima */
    }
    set({ value, open: false })
  },
  reopen() {
    set({ ...state, open: true })
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

/** Hook: decisão atual e se o banner está aberto. Re-renderiza na troca. */
export function useConsent() {
  return useSyncExternalStore(consent.subscribe, () => state)
}
