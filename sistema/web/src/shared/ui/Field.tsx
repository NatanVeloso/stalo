import { useId, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type Props = {
  label: string
  hint?: string
  error?: string
  className?: string
  /** Recebe o id para ligar `<label>` ao controle e o `aria-describedby`. */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

/** Rótulo + controle + erro, com os atributos ARIA certos. Usar com Input, Select etc. */
export function Field({ label, hint, error, className, children }: Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-fg-muted">
        {label}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-[13px] text-fg-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
