import { Search, X } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { Input } from './Input'

type Props = { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }

export function SearchInput({ value, onChange, placeholder, className }: Props) {
  const t = useT()
  return (
    <Input
      type="search"
      role="searchbox"
      aria-label={t.common.actions.search}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? t.common.actions.searchPlaceholder}
      leading={<Search />}
      trailing={
        value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={t.common.actions.clear}
            className="rounded-full p-1 hover:text-fg"
          >
            <X className="size-4" />
          </button>
        ) : undefined
      }
      className={className}
    />
  )
}
