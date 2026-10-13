import { useT } from '@/shared/i18n'
import { PageHeader } from '@/shared/layout'
import { AparenciaCard } from '../components/AparenciaCard'
import { PerfilCard } from '../components/PerfilCard'
import { SegurancaCard } from '../components/SegurancaCard'

export function ConfiguracoesPage() {
  const t = useT()
  return (
    <>
      <PageHeader title={t.configuracoes.title} description={t.configuracoes.subtitle} />

      <div className="animate-rise grid items-start gap-(--stack-y) xl:grid-cols-2">
        <PerfilCard />
        <div className="flex flex-col gap-(--stack-y)">
          <AparenciaCard />
          <SegurancaCard />
        </div>
      </div>
    </>
  )
}
