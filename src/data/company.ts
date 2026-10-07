/**
 * Dados fixos da empresa, iguais em todos os idiomas. Módulo "folha": não
 * importa nada de src/i18n, porque os textos legais (src/i18n/legal) dependem
 * dele e um import de volta fecharia um ciclo.
 */
export const company = {
  name: 'Stalo Consulting',
  cnpj: '30.590.005/0001-82',
  address: 'Av. Deputado Jamel Cecílio, 3455, Ed. Flamboyant Park, Jardim Goiás, CEP 74810-100',
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
