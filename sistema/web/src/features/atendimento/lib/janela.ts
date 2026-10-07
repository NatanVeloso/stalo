/** Minutos restantes da janela de 24 h do WhatsApp; `null` quando o contato nunca escreveu. */
export function janelaRestanteMin(expiraEm: string | null) {
  if (!expiraEm) return null
  return Math.round((new Date(expiraEm).getTime() - Date.now()) / 60_000)
}
