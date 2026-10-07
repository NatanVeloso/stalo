import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/shared/lib/cn'

export type BarDatum = { key: string; label: string; value: number }

type Props = {
  data: BarDatum[]
  /** Formata o valor para o tooltip, o rótulo do pico e os ticks do eixo. */
  formatValue: (v: number) => string
  /** Ticks do eixo Y (valor arredondado, compacto). */
  formatTick?: (v: number) => string
  /** Altura em rem (acompanha a fonte). Sem valor, o gráfico preenche a altura do container. */
  heightRem?: number
  className?: string
  style?: CSSProperties
}

/** Tamanho da fonte raiz em px (o usuário muda em Configurações). */
function rootFontPx() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
}

/**
 * Gráfico de colunas de uma série, em SVG. Monocromático (a série usa a cor do
 * texto), colunas finas com topo arredondado, grade recessiva, tooltip por
 * coluna no hover e no foco. Para várias séries, criar outro componente.
 *
 * O SVG é desenhado no tamanho real do container (sem viewBox): assim o texto
 * fica em rem e acompanha a fonte/densidade, em vez de escalar com a largura.
 */
export function BarChart({ data, formatValue, formatTick = formatValue, heightRem, className, style }: Props) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0, rem: 16 })

  // mede o container e a fonte raiz; refaz em resize e quando a fonte muda (a largura muda junto)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight, rem: rootFontPx() })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  const { width, rem } = size
  const height = heightRem ? heightRem * rem : size.height
  const fontPx = 0.6875 * rem // 11px a 16px de base
  const max = niceMax(Math.max(...data.map((d) => d.value), 1))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f)
  // margem esquerda cresce com o rótulo mais longo do eixo (≈0.6em por caractere)
  const tickWidth = Math.max(...ticks.map((v) => formatTick(v).length)) * fontPx * 0.6 + rem
  const pad = { top: rem, right: 3 * rem, bottom: 1.75 * rem, left: Math.max(2.75 * rem, tickWidth) }
  const innerW = Math.max(0, width - pad.left - pad.right)
  const innerH = height - pad.top - pad.bottom
  const slot = innerW / Math.max(data.length, 1)
  const barW = Math.min(1.5 * rem, slot * 0.55)
  const peak = data.reduce((m, d, i) => (d.value > (data[m]?.value ?? -Infinity) ? i : m), 0)

  const x = (i: number) => pad.left + i * slot + (slot - barW) / 2
  const y = (v: number) => pad.top + innerH - (v / max) * innerH

  return (
    <div ref={root} className={cn('relative w-full', className)} style={{ ...style, ...(heightRem ? { height } : {}) }}>
      {width > 0 && height > 0 && (
        <svg
          width={width}
          height={height}
          className="block"
          role="img"
          aria-labelledby={`${id}-title`}
          style={{ fontSize: fontPx }}
        >
          <title id={`${id}-title`}>{data.map((d) => `${d.label}: ${formatValue(d.value)}`).join('; ')}</title>
          {ticks.map((tv) => (
            <g key={tv}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(tv)}
                y2={y(tv)}
                className="stroke-line"
                strokeWidth="1"
              />
              <text x={pad.left - 0.5 * rem} y={y(tv)} dy="0.35em" textAnchor="end" className="fill-fg-subtle tabular">
                {formatTick(tv)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const h = Math.max(0, y(0) - y(d.value))
            const r = Math.min(4, h / 2)
            const active = hover === i
            return (
              <g key={d.key}>
                {/* alvo de hover maior que a coluna */}
                <rect
                  x={pad.left + i * slot}
                  y={pad.top}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${d.label}: ${formatValue(d.value)}`}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="outline-none"
                />
                <path
                  d={`M${x(i)},${y(0)} v${-(h - r)} a${r},${r} 0 0 1 ${r},${-r} h${barW - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - r} z`}
                  className={cn('fill-fg transition-opacity', hover !== null && !active ? 'opacity-40' : 'opacity-85')}
                  pointerEvents="none"
                />
                {i === peak && hover === null && (
                  <text
                    x={x(i) + barW / 2}
                    y={y(d.value) - 0.4 * rem}
                    textAnchor="middle"
                    className="fill-fg font-medium tabular"
                  >
                    {formatValue(d.value)}
                  </text>
                )}
                <text
                  x={x(i) + barW / 2}
                  y={height - 0.5 * rem}
                  textAnchor="middle"
                  className="fill-fg-subtle capitalize"
                >
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      )}
      {hover !== null && data[hover] && (
        <div
          role="status"
          className={cn(
            'pointer-events-none absolute -translate-x-1/2 rounded-xl px-3 py-2 text-xs glass-strong',
            y(data[hover].value) < 4 * rem ? 'translate-y-0' : '-translate-y-full',
          )}
          // ancorado logo acima do topo da coluna em foco; coluna muito alta (sem espaço em cima) → abaixo do topo
          style={{
            left: x(hover) + barW / 2,
            top: y(data[hover].value) + (y(data[hover].value) < 4 * rem ? 0.5 : -0.5) * rem,
          }}
        >
          <p className="text-sm font-semibold text-fg tabular">{formatValue(data[hover].value)}</p>
          <p className="text-fg-muted capitalize">{data[hover].label}</p>
        </div>
      )}
    </div>
  )
}

/** Topo do eixo arredondado para um número "limpo" acima do maior valor. */
function niceMax(v: number) {
  const mag = 10 ** Math.floor(Math.log10(v))
  const n = v / mag
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return nice * mag
}
