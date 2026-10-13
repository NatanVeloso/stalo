import { ICON_PATHS, WORDMARK_PATHS } from './logoPaths'

type Props = {
  className?: string
  /** Só o asterisco, sem o wordmark. */
  markOnly?: boolean
}

/** Logo Stalo inline (fill = currentColor): segue a cor do texto nos dois temas. */
export function Logo({ className = '', markOnly = false }: Props) {
  const viewBox = markOnly ? '0 0 68 75' : '0 0 260 75'
  return (
    <svg viewBox={viewBox} fill="currentColor" className={className} aria-label="Stalo" role="img">
      <g>
        {ICON_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {!markOnly && (
        <g>
          {WORDMARK_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
    </svg>
  )
}
