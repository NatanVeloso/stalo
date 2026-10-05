/**
 * Rastreamento de campanhas. Módulo "folha", sem imports.
 *
 * `metaPixelId`: ID do Pixel da Meta (Gerenciador de Eventos), só os números.
 * Vazio = rastreamento desligado: o Pixel não carrega e o banner de cookies
 * nem aparece, porque não há cookie não essencial para consentir.
 */
export const tracking = { metaPixelId: '' }
