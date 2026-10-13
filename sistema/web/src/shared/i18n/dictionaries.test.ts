import { describe, expect, it } from 'vitest'
import { ptBR } from './locales/pt-BR'
import { en } from './locales/en'
import { es } from './locales/es'

/**
 * O `tsc` já pega chave faltando/sobrando em en/es, mas não pega texto vazio nem placeholder
 * esquecido na tradução ("Página {page}" traduzido como "Page"): o `fmt` deixaria o valor de fora.
 */
type Leaves = Map<string, unknown>

function flatten(value: unknown, path = '', out: Leaves = new Map()): Leaves {
  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, path ? `${path}.${k}` : k, out)
    }
  } else {
    out.set(path, value)
  }
  return out
}

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

const base = flatten(ptBR)
const others = { en: flatten(en), es: flatten(es) }

describe('dicionários', () => {
  it('pt-BR tem conteúdo', () => {
    expect(base.size).toBeGreaterThan(50)
  })

  for (const [name, dict] of Object.entries(others)) {
    describe(name, () => {
      it('tem exatamente as mesmas chaves que pt-BR', () => {
        const faltando = [...base.keys()].filter((k) => !dict.has(k))
        const sobrando = [...dict.keys()].filter((k) => !base.has(k))
        expect({ faltando, sobrando }).toEqual({ faltando: [], sobrando: [] })
      })

      it('cada valor tem o mesmo tipo que em pt-BR', () => {
        const diferentes = [...base].filter(([k, v]) => dict.has(k) && typeof dict.get(k) !== typeof v).map(([k]) => k)
        expect(diferentes).toEqual([])
      })

      it('os mesmos placeholders {x} em cada texto', () => {
        const divergentes = [...base]
          .filter(([, v]) => typeof v === 'string')
          .flatMap(([k, v]) => {
            const other = dict.get(k)
            if (typeof other !== 'string') return []
            const a = placeholders(v as string)
            const b = placeholders(other)
            return a.join() === b.join() ? [] : [`${k}: pt-BR {${a.join()}} × ${name} {${b.join()}}`]
          })
        expect(divergentes).toEqual([])
      })
    })
  }

  it('nenhum texto vazio em nenhum idioma', () => {
    const vazios = Object.entries({ 'pt-BR': base, ...others }).flatMap(([name, dict]) =>
      [...dict].filter(([, v]) => typeof v === 'string' && v.trim() === '').map(([k]) => `${name}:${k}`),
    )
    expect(vazios).toEqual([])
  })
})
