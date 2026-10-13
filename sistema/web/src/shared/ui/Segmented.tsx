import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useLocale, useT } from '@/shared/i18n'
import { formatNumber } from '@/shared/lib/format'
import { IconButton } from './IconButton'

export type SegmentOption<V extends string> = { value: V; label: ReactNode; count?: number; icon?: ReactNode }

type Props<V extends string> = {
  value: V
  onChange: (value: V) => void
  options: SegmentOption<V>[]
  /** Nome do grupo para leitores de tela (traduzido). */
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/** Ponta que transborda: some de vez sob a seta (GAP) e esmaece até FADE (em rem, acompanha a fonte). */
const GAP = '1.75rem'
const FADE = '3.75rem'

/**
 * Controle segmentado (abas curtas, filtros, tema). A opção ativa vira uma pílula de vidro
 * embutido. Com mais opções que largura, rola no eixo X sem barra: dá para arrastar com o
 * mouse, a ponta que transborda esmaece e ganha uma seta clicável, e a ativa fica à vista.
 */
export function Segmented<V extends string>({ value, onChange, options, label, size = 'md', className }: Props<V>) {
  const t = useT()
  const locale = useLocale()
  const track = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState({ left: false, right: false })
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const overflowing = more.left || more.right

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const left = el.scrollLeft > 1
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setMore((m) => (m.left === left && m.right === right ? m : { left, right }))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [measure, options.length])

  useEffect(() => {
    const el = track.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    el.querySelector<HTMLElement>('[aria-checked="true"]')?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [value])

  const scrollBy = (dir: -1 | 1) => {
    const el = track.current
    el?.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  // arrastar com o mouse rola a faixa; se moveu, o clique que vem em seguida não troca a opção
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !overflowing || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = track.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      setDragging(true)
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  const onPointerEnd = () => {
    if (drag.current && !drag.current.moved) drag.current = null
    setDragging(false)
  }
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (drag.current?.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
    drag.current = null
  }

  const mask = overflowing
    ? `linear-gradient(to right, ${more.left ? `transparent 0, transparent ${GAP}, #000 ${FADE}` : '#000 0'}, ${more.right ? `#000 calc(100% - ${FADE}), transparent calc(100% - ${GAP}), transparent 100%` : '#000 100%'})`
    : undefined

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('relative inline-flex max-w-full rounded-full p-1 glass-well', className)}
    >
      {more.left && <ScrollHint side="left" label={t.common.actions.scrollLeft} onClick={() => scrollBy(-1)} />}
      <div
        ref={track}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        className={cn(
          'scrollbar-none flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-full',
          overflowing && 'cursor-grab select-none',
          dragging && 'cursor-grabbing',
        )}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                'relative inline-flex shrink-0 items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 [&>svg]:size-4',
                size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-3.5 text-small',
                active ? 'text-fg glass-inset' : 'text-fg-muted hover:text-fg',
              )}
            >
              {o.icon}
              {o.label}
              {o.count !== undefined && (
                <span
                  className={cn('rounded-full px-1.5 text-caption tabular', active ? 'bg-fg/[0.08]' : 'bg-fg/[0.06]')}
                >
                  {formatNumber(o.count, locale)}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {more.right && <ScrollHint side="right" label={t.common.actions.scrollRight} onClick={() => scrollBy(1)} />}
    </div>
  )
}

/** Seta na ponta que transborda: mostra que há mais e rola ao clicar. */
function ScrollHint({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <IconButton
      size="xs"
      label={label}
      onClick={onClick}
      className={cn('absolute top-1/2 z-10 -translate-y-1/2', side === 'left' ? 'left-1.5' : 'right-1.5')}
    >
      {side === 'left' ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  )
}
