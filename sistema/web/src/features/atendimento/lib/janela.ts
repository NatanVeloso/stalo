/** Minutos restantes da janela de 24 h do WhatsApp; `null` quando o contato nunca escreveu. */
export function janelaRestanteMin(expiraEm: string | null) {
  if (!expiraEm) return null
  return Math.round((new Date(expiraEm).getTime() - Date.now()) / 60_000)
}

/**
 * Janela encerrada: só template ou nota interna. Sem mensagem do contato (`null`) o front não
 * bloqueia; quem valida de verdade é o back, antes de enviar.
 */
export function janelaFechada(expiraEm: string | null) {
  return (janelaRestanteMin(expiraEm) ?? 1) <= 0
}
