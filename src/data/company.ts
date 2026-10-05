/**
 * Dados fixos da empresa, iguais em todos os idiomas. Módulo "folha": não
 * importa nada de src/i18n, porque os textos legais (src/i18n/legal) dependem
 * dele e um import de volta fecharia um ciclo.
 * CNPJ e endereço precisam ser preenchidos antes de publicar.
 */
export const company = {
  name: 'Stalo Consulting',
  cnpj: '[CNPJ]',
  address: '[endereço completo]',
  city: 'Goiânia/GO',
  site: 'staloconsulting.com.br',
  /** Endereço definitivo do site, sem barra no fim (canonical e tags og). */
  url: 'https://www.staloconsulting.com.br',
  email: 'contato@staloconsulting.com.br',
  phone: '(62) 9 9513-6343',
  phoneHref: 'tel:+5562995136343',
  whatsappNumber: '5562995136343',
  instagram: 'https://www.instagram.com/staloconsulting/',
}
