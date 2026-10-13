/**
 * Âncora na URL da home (ex.: /#faq vindo do header de outra página). O salto
 * nativo do navegador acontece antes do preloader e dos pins do GSAP (e o
 * Chromium repete o salto depois do load, quando o elemento aparece, mesmo com
 * o hash já tirado da URL); a página chegava rolada e o "Como funciona"
 * calculava as posições erradas. Então o hash é guardado e tirado da URL logo
 * no carregamento (main.tsx), a rolagem fica presa em zero até a home liberar,
 * e aí o App rola até a âncora por conta própria (App.tsx).
 */
let stashed = ''
const hold = () => window.scrollTo(0, 0)

export function stashHash() {
  if (!location.hash) return
  stashed = location.hash
  history.replaceState(history.state, '', location.pathname + location.search)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  hold()
  window.addEventListener('scroll', hold)
  // segurança: se a home não liberar (preloader travado), a rolagem não pode ficar presa
  window.setTimeout(() => window.removeEventListener('scroll', hold), 6000)
}

export function takeHash() {
  window.removeEventListener('scroll', hold)
  const h = stashed
  stashed = ''
  return h
}
