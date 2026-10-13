import { LayoutTemplate } from 'lucide-react'
import { useT } from '@/shared/i18n'
import { Button, Menu, MenuItem, MenuLabel, Skeleton } from '@/shared/ui'
import { useTemplates } from '../queries'

type Props = { disabled?: boolean; onEscolher: (templateId: string) => void }

/**
 * Botão "Enviar template" + lista dos templates aprovados. Escolher é uma ação (envia na hora),
 * por isso é `Menu` (fecha sozinho ao escolher), não `Popover`. Nome e texto são dado da Meta.
 */
export function TemplateMenu({ disabled, onEscolher }: Props) {
  const t = useT()
  const templates = useTemplates()

  return (
    <Menu
      align="end"
      trigger={
        <Button size="sm" variant="secondary" disabled={disabled} leading={<LayoutTemplate className="size-3.5" />}>
          {t.atendimento.composer.template}
        </Button>
      }
    >
      <MenuLabel>
        <span className="text-caption font-semibold tracking-[0.08em] text-fg-subtle uppercase">
          {t.atendimento.templates.label}
        </span>
      </MenuLabel>
      {templates.isPending ? (
        <div className="flex w-72 flex-col gap-(--list-gap) px-3 pb-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ) : templates.isError ? (
        <p role="alert" className="w-72 px-3 pb-2 text-small text-danger">
          {t.atendimento.templates.error}
        </p>
      ) : templates.data.length === 0 ? (
        <p className="w-72 px-3 pb-2 text-small text-fg-muted">{t.atendimento.templates.empty}</p>
      ) : (
        templates.data.map((tp) => (
          <MenuItem key={tp.id} onSelect={() => onEscolher(tp.id)}>
            <span className="block w-64 max-w-[calc(100vw-5rem)]">
              <span className="block text-sm font-medium text-fg">{tp.nome}</span>
              <span className="line-clamp-2 block text-xs text-fg-muted">{tp.texto}</span>
            </span>
          </MenuItem>
        ))
      )}
    </Menu>
  )
}
