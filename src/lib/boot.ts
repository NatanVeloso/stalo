/**
 * Logo de carregamento do index.html (`#boot`): cobre a tela do primeiro paint
 * até o React assumir. Trocar de idioma e "Voltar ao site" recarregam a página,
 * e sem ele esse intervalo é uma tela preta.
 *
 * Quem assume chama `hideBoot()`: o Preloader (junto com o fade da cortina) na
 * home e a LegalPage ao montar. Pode ser chamado mais de uma vez.
 */
export function hideBoot() {
  const boot = document.getElementById('boot')
  if (!boot || boot.classList.contains('out')) return
  boot.classList.add('out') // fade de 0.35s definido no index.html
  window.setTimeout(() => boot.remove(), 400)
}
