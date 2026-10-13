import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { IconButton } from './IconButton'
import { Input } from './Input'

type Props = { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }

/** Busca com lupa e botão de limpar. O `ref` vai para o `<input>`. */
export const SearchInput = forwardRef<HTMLInputElement, Props>(function SearchInput(
  { value, onChange, placeholder, className },
  ref,
) {
  const t = useT()
  return (
    <Input
      ref={ref}
      type="search"
      role="searchbox"
      aria-label={t.common.actions.search}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? t.common.actions.searchPlaceholder}
      leading={<Search aria-hidden="true" />}
      trailing={
        value ? (
          <IconButton size="xs" label={t.common.actions.clear} onClick={() => onChange('')}>
            <X />
          </IconButton>
        ) : undefined
      }
      className={className}
    />
  )
})
