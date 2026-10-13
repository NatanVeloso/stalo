import { Check } from 'lucide-react'
import { useT, fmt } from '@/shared/i18n'
import { Button, toast } from '@/shared/ui'
import { useMarcarEntregue } from '../queries'
import type { Obrigacao } from '../types'

/**
 * "Marcar como entregue" de uma linha. Cada botão tem a própria mutação, então o loading é só
 * dele. Erro já vira toast traduzido no MutationCache (shared/lib/queryClient).
 */
export function EntregarButton({ obrigacao: o }: { obrigacao: Obrigacao }) {
  const t = useT()
  const entregar = useMarcarEntregue()
  const vars = { tipo: t.obrigacoes.tipos[o.tipo], cliente: o.cliente }

  return (
    <Button
      size="sm"
      variant="secondary"
      leading={<Check className="size-3.5" />}
      loading={entregar.isPending}
      // o texto some abaixo de lg: o nome acessível não pode depender dele
      aria-label={fmt(t.obrigacoes.markDeliveredLabel, vars)}
      onClick={(e) => {
        e.stopPropagation()
        entregar.mutate(o.id, { onSuccess: () => toast(fmt(t.obrigacoes.delivered, vars), 'ok') })
      }}
    >
      <span className="hidden lg:inline">{t.obrigacoes.markDelivered}</span>
    </Button>
  )
}
