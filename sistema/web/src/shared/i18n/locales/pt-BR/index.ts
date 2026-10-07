import { common } from './common'
import { auth } from './auth'
import { dashboard } from './dashboard'
import { clientes } from './clientes'
import { obrigacoes } from './obrigacoes'
import { financeiro } from './financeiro'
import { usuarios } from './usuarios'
import { configuracoes } from './configuracoes'
import { atendimento } from './atendimento'

/** Um bloco por módulo. Texto de componente compartilhado vai em `common`. */
export const ptBR = { common, auth, dashboard, clientes, obrigacoes, financeiro, usuarios, configuracoes, atendimento }

export type Dictionary = typeof ptBR
