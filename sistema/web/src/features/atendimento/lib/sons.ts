import { usePrefs } from '@/shared/prefs/prefs.store'
import type { Mensagem } from '../types'

/**
 * Sons do atendimento, gerados com a Web Audio API (sem asset): um "blip" curto ao enviar e
 * dois tons ("di-dim") ao receber. A preferência (ligado/desligado, por evento) fica em
 * `shared/prefs`. O navegador mantém o contexto suspenso até uma interação do usuário;
 * enviar já é uma, e o toggle do menu também.
 */
let ctx: AudioContext | null = null

function contexto(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tom(ctx: AudioContext, freq: number, at: number, dur: number, para?: number) {
  const now = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  if (para) osc.frequency.exponentialRampToValueAtTime(para, now + dur * 0.55)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.13, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}

/** Blip de envio (sobe de 520 Hz para 900 Hz). Ignora a preferência quando `forcar`. */
export function tocarSomEnvio(forcar = false) {
  if (!forcar && !usePrefs.getState().somAoEnviar) return
  const c = contexto()
  if (c) tom(c, 520, 0, 0.16, 900)
}

let ultimoRecebimento = 0

/** "Di-dim" de mensagem recebida. Dois disparos em menos de 500 ms tocam uma vez só. */
export function tocarSomRecebimento(forcar = false) {
  if (!forcar && !usePrefs.getState().somAoReceber) return
  const agora = Date.now()
  if (!forcar && agora - ultimoRecebimento < 500) return
  ultimoRecebimento = agora
  const c = contexto()
  if (!c) return
  tom(c, 880, 0, 0.22)
  tom(c, 1174.7, 0.12, 0.22)
}

/**
 * O total de não lidas cresceu desde a última carga (mensagem nova do contato em alguma conversa).
 * `antes === null` é a primeira carga: não toca.
 */
export function chegouNaoLida(antes: number | null, depois: number): boolean {
  return antes !== null && depois > antes
}

/**
 * Entrou mensagem nova do contato na conversa aberta: id desconhecido **e** mais recente que a
 * mais nova já vista. Assim, carregar páginas anteriores (mensagens antigas) não toca.
 */
export function chegouMensagem(antes: Mensagem[], depois: Mensagem[]): boolean {
  const ids = new Set(antes.map((m) => m.id))
  const maisNova = antes.reduce((max, m) => (m.em > max ? m.em : max), '')
  return depois.some((m) => m.de === 'contato' && !ids.has(m.id) && m.em > maisNova)
}
