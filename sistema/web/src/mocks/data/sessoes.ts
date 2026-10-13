import type { Sessao } from '@/features/configuracoes'
import { hoursFromNow } from '../util'

/** Sessões do usuário logado na demo. Mutável: "Encerrar" remove daqui. */
export const mockSessoes: Sessao[] = [
  {
    id: 's1',
    dispositivo: 'Windows',
    navegador: 'Chrome',
    ultimoAcesso: hoursFromNow(-0.05),
    atual: true,
    criadoEm: hoursFromNow(-24 * 3),
  },
  {
    id: 's2',
    dispositivo: 'iPhone',
    navegador: 'Safari',
    ultimoAcesso: hoursFromNow(-5),
    atual: false,
    criadoEm: hoursFromNow(-24 * 12),
  },
  {
    id: 's3',
    dispositivo: 'macOS',
    navegador: 'Firefox',
    ultimoAcesso: hoursFromNow(-24 * 4),
    atual: false,
    criadoEm: hoursFromNow(-24 * 20),
  },
]
