import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  daysUntil,
  formatCnpj,
  formatCompetencia,
  formatCurrency,
  formatDate,
  formatMonth,
  formatNumber,
  formatPercent,
  formatRelative,
  formatTime,
  initials,
  localDayKey,
} from './format'

/** O Intl usa espaço fino/inseparável em alguns idiomas; normaliza para comparar texto. */
const sp = (s: string) => s.replace(/[\u00a0\u202f]/g, ' ')

/**
 * Fuso fixo de São Paulo (UTC-3, sem horário de verão) para o teste não depender da máquina.
 * Datas de entrada são montadas com o construtor local, então os textos esperados valem em qualquer fuso.
 */
vi.stubEnv('TZ', 'America/Sao_Paulo')
afterAll(() => {
  vi.unstubAllEnvs()
})

const local = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min).toISOString()

describe('formatCnpj', () => {
  it('formata CNPJ com a máscara padrão', () => {
    expect(formatCnpj('12345678000190')).toBe('12.345.678/0001-90')
  })
  it('aceita já formatado e completa zeros à esquerda', () => {
    expect(formatCnpj('12.345.678/0001-90')).toBe('12.345.678/0001-90')
    expect(formatCnpj('1234567000190')).toBe('01.234.567/0001-90')
  })
})

describe('initials', () => {
  it('gera iniciais de até dois nomes, em maiúsculas', () => {
    expect(initials('Ana Souza')).toBe('AS')
    expect(initials('Walex')).toBe('W')
    expect(initials('maria  clara de jesus')).toBe('MC')
  })
  it('nome vazio devolve vazio', () => {
    expect(initials('')).toBe('')
    expect(initials('   ')).toBe('')
  })
})

describe('formatCurrency', () => {
  it('é sempre BRL; só a grafia muda com o idioma', () => {
    expect(sp(formatCurrency(1234.5, 'pt-BR'))).toBe('R$ 1.234,50')
    expect(sp(formatCurrency(1234.5, 'en'))).toBe('R$1,234.50')
    expect(sp(formatCurrency(1234.5, 'es'))).toMatch(/^1\.?234,50 (BRL|R\$)$/)
  })
  it('compact abrevia com uma casa', () => {
    expect(sp(formatCurrency(1_234_567, 'pt-BR', { compact: true }))).toBe('R$ 1,2 mi')
    expect(sp(formatCurrency(12_500, 'pt-BR', { compact: true }))).toBe('R$ 12,5 mil')
    expect(sp(formatCurrency(1_234_567, 'en', { compact: true }))).toBe('R$1.2M')
    expect(sp(formatCurrency(12_500, 'es', { compact: true }))).toMatch(/^12,5 mil (BRL|R\$)$/)
  })
  it('negativo mantém o sinal', () => {
    expect(sp(formatCurrency(-50, 'pt-BR'))).toBe('-R$ 50,00')
  })
})

describe('formatNumber', () => {
  it('separadores conforme o idioma', () => {
    expect(formatNumber(1_234_567.89, 'pt-BR')).toBe('1.234.567,89')
    expect(formatNumber(1_234_567.89, 'en')).toBe('1,234,567.89')
    expect(formatNumber(1_234_567.89, 'es')).toBe('1.234.567,89')
    expect(formatNumber(0, 'pt-BR')).toBe('0')
  })
})

describe('formatDate', () => {
  const iso = local(2026, 10, 5, 14, 7)

  it('short: dia/mês/ano com dois dígitos (ordem do idioma)', () => {
    expect(formatDate(iso, 'pt-BR')).toBe('05/10/2026')
    expect(formatDate(iso, 'en')).toBe('10/05/2026')
    expect(formatDate(iso, 'es')).toBe('05/10/2026')
  })
  it('medium: dia e mês abreviado', () => {
    expect(sp(formatDate(iso, 'pt-BR', 'medium'))).toBe('5 de out.')
    expect(sp(formatDate(iso, 'en', 'medium'))).toBe('Oct 5')
    expect(sp(formatDate(iso, 'es', 'medium'))).toBe('5 oct')
  })
  it('long: dia, mês por extenso e ano', () => {
    expect(formatDate(iso, 'pt-BR', 'long')).toBe('5 de outubro de 2026')
    expect(formatDate(iso, 'en', 'long')).toBe('October 5, 2026')
    expect(formatDate(iso, 'es', 'long')).toBe('5 de octubre de 2026')
  })

  /*
   * BUG: data só-dia (`YYYY-MM-DD`, como `vencimento`, `desde`, `ultimaEntrega`) é lida pelo
   * `new Date()` como meia-noite UTC; em São Paulo isso é 21h do dia anterior, e a tela mostra
   * um dia a menos. `formatCompetencia` já trata isso; `formatDate` não.
   */
  it('data só-dia (YYYY-MM-DD) não pode voltar um dia no fuso do Brasil', () => {
    expect(formatDate('2026-10-05', 'pt-BR')).toBe('05/10/2026')
  })
})

describe('formatTime', () => {
  it('hora e minuto no formato do idioma', () => {
    const iso = local(2026, 10, 5, 14, 7)
    expect(formatTime(iso, 'pt-BR')).toBe('14:07')
    expect(formatTime(iso, 'es')).toBe('14:07')
    expect(sp(formatTime(iso, 'en'))).toBe('02:07 PM')
  })
})

describe('formatMonth', () => {
  it('mês abreviado sem o ponto final', () => {
    expect(formatMonth(local(2026, 10, 15), 'pt-BR')).toBe('out')
    expect(formatMonth(local(2026, 9, 15), 'pt-BR')).toBe('set')
    expect(formatMonth(local(2026, 10, 15), 'en')).toBe('Oct')
    expect(formatMonth(local(2026, 1, 15), 'es')).toBe('ene')
    for (const locale of ['pt-BR', 'en', 'es'] as const) {
      for (let m = 1; m <= 12; m++) expect(formatMonth(local(2026, m, 15), locale)).not.toContain('.')
    }
  })

  /* BUG: mesmo problema do formatDate. `monthsAgo()` dos mocks (e a API) mandam "2026-10-01";
   * lido como UTC vira 30/09 21h em São Paulo, e o eixo do gráfico de receita mostra o mês anterior. */
  it('primeiro dia do mês só-dia (YYYY-MM-01) mostra o próprio mês no fuso do Brasil', () => {
    expect(formatMonth('2026-10-01', 'pt-BR')).toBe('out')
  })
})

describe('formatCompetencia', () => {
  it('YYYY-MM → mês abreviado e ano, sem voltar um mês no fuso', () => {
    expect(sp(formatCompetencia('2026-09', 'pt-BR'))).toBe('set. de 2026')
    expect(sp(formatCompetencia('2026-01', 'pt-BR'))).toBe('jan. de 2026')
    expect(sp(formatCompetencia('2026-09', 'en'))).toBe('Sep 2026')
    expect(sp(formatCompetencia('2026-10', 'es'))).toBe('oct 2026')
  })
  it('valor inválido volta como veio', () => {
    expect(formatCompetencia('lixo', 'pt-BR')).toBe('lixo')
    expect(formatCompetencia('', 'pt-BR')).toBe('')
  })
})

describe('formatPercent', () => {
  it('entrada em pontos percentuais, uma casa decimal', () => {
    expect(formatPercent(8.3, 'pt-BR')).toBe('8,3%')
    expect(formatPercent(8.3, 'en')).toBe('8.3%')
    expect(sp(formatPercent(8.3, 'es'))).toBe('8,3 %')
  })
  it('signed põe "+" nos positivos', () => {
    expect(formatPercent(8.3, 'pt-BR', { signed: true })).toBe('+8,3%')
    expect(formatPercent(8.3, 'en', { signed: true })).toBe('+8.3%')
    expect(sp(formatPercent(8.3, 'es', { signed: true }))).toBe('+8,3 %')
  })
  it('negativo sempre com "-", com ou sem signed', () => {
    expect(formatPercent(-4.25, 'pt-BR', { signed: true })).toBe('-4,3%')
    expect(formatPercent(-2, 'pt-BR')).toBe('-2,0%')
    expect(formatPercent(-2, 'en')).toBe('-2.0%')
  })
  it('zero não leva sinal, mesmo com signed', () => {
    expect(formatPercent(0, 'pt-BR', { signed: true })).toBe('0,0%')
    expect(formatPercent(0, 'en', { signed: true })).toBe('0.0%')
  })
})

describe('com relógio fixo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 10, 15, 0, 0)) // 10/10/2026 15:00 local
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatRelative', () => {
    const ago = (ms: number) => new Date(Date.now() - ms).toISOString()
    const MIN = 60_000
    const H = 60 * MIN
    const D = 24 * H

    it('minutos, horas, dias e meses nos três idiomas', () => {
      expect(formatRelative(ago(5 * MIN), 'pt-BR')).toBe('há 5 minutos')
      expect(formatRelative(ago(5 * MIN), 'en')).toBe('5 minutes ago')
      expect(formatRelative(ago(5 * MIN), 'es')).toBe('hace 5 minutos')

      expect(formatRelative(ago(-2 * H), 'pt-BR')).toBe('em 2 horas')
      expect(formatRelative(ago(-2 * H), 'en')).toBe('in 2 hours')
      expect(formatRelative(ago(-2 * H), 'es')).toBe('dentro de 2 horas')

      expect(formatRelative(ago(3 * D), 'pt-BR')).toBe('há 3 dias')
      expect(formatRelative(ago(3 * D), 'en')).toBe('3 days ago')
      expect(formatRelative(ago(3 * D), 'es')).toBe('hace 3 días')

      expect(formatRelative(ago(60 * D), 'pt-BR')).toBe('há 2 meses')
    })

    it('usa as formas naturais (agora, ontem, amanhã)', () => {
      expect(formatRelative(ago(10_000), 'pt-BR')).toBe('este minuto')
      expect(formatRelative(ago(D), 'pt-BR')).toBe('ontem')
      expect(formatRelative(ago(D), 'en')).toBe('yesterday')
      expect(formatRelative(ago(-D), 'es')).toBe('mañana')
    })

    it('troca de unidade nos limites (60 min → hora, 24 h → dia, 30 dias → mês)', () => {
      expect(formatRelative(ago(59 * MIN), 'en')).toBe('59 minutes ago')
      expect(formatRelative(ago(60 * MIN), 'en')).toBe('1 hour ago')
      expect(formatRelative(ago(23 * H), 'en')).toBe('23 hours ago')
      expect(formatRelative(ago(29 * D), 'en')).toBe('29 days ago')
      expect(formatRelative(ago(30 * D), 'en')).toBe('last month')
    })
  })

  describe('daysUntil', () => {
    /*
     * BUG latente: com data-hora (não só-dia) o `Math.round` arredonda pela hora. Vencimento hoje
     * às 12h ou mais conta como "amanhã" (0,5 dia → 1). Hoje o contrato manda `vencimento` só-dia,
     * por isso não aparece na tela; se a API passar a mandar timestamp, o badge erra.
     */
    it('com data-hora conta dias de calendário (a hora não importa)', () => {
      expect(daysUntil(local(2026, 10, 10, 23, 59)) === 0).toBe(true)
      expect(daysUntil(local(2026, 10, 15, 20))).toBe(5)
    })

    it('com data-hora de manhã conta os dias de calendário', () => {
      expect(daysUntil(local(2026, 10, 10, 8)) === 0).toBe(true)
      expect(daysUntil(local(2026, 10, 15, 8))).toBe(5)
      expect(daysUntil(local(2026, 10, 9, 8))).toBe(-1)
      expect(daysUntil(local(2026, 9, 30, 8))).toBe(-10)
    })

    it('aceita data só-dia (YYYY-MM-DD) do contrato', () => {
      expect(daysUntil('2026-10-15')).toBe(5)
      expect(daysUntil('2026-10-11')).toBe(1)
      expect(daysUntil('2026-10-10') === 0).toBe(true)
      expect(daysUntil('2026-10-07')).toBe(-3)
    })
  })
})

describe('localDayKey', () => {
  it('23:30 local é o dia local, não o do UTC (que já virou)', () => {
    const tardeDaNoite = new Date(2026, 9, 10, 23, 30) // 10/10 23:30 em SP = 11/10 02:30 UTC
    expect(tardeDaNoite.toISOString().slice(0, 10)).toBe('2026-10-11')
    expect(localDayKey(tardeDaNoite)).toBe('2026-10-10')
    expect(localDayKey(tardeDaNoite.toISOString())).toBe('2026-10-10')
    expect(localDayKey(tardeDaNoite.getTime())).toBe('2026-10-10')
  })

  it('00:10 local já é o dia seguinte', () => {
    expect(localDayKey(new Date(2026, 9, 11, 0, 10))).toBe('2026-10-11')
  })

  it('zera à esquerda mês e dia', () => {
    expect(localDayKey(new Date(2026, 0, 5, 12))).toBe('2026-01-05')
  })
})
