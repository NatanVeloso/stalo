/**
 * Variáveis de ambiente, lidas uma vez. Sem VITE_API_URL o app roda em modo
 * mock: as `api.ts` de cada feature devolvem dados fake sem tocar na rede.
 */
export const env = {
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '',
  get mock() {
    return !this.apiUrl
  },
}
