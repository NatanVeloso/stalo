import { cn } from '@/shared/lib/cn'
import { initials } from '@/shared/lib/format'

type Props = { name: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }

const sizes = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-14 text-base' }

export function Avatar({ name, src, size = 'md', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent font-semibold text-accent-fg',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials(name)}
    </span>
  )
}
