import type { Usuario } from '@/features/usuarios'
import { hoursFromNow } from '../util'

/** Senha de todos na demo: 123456 */
export const mockUsers: Usuario[] = [
  {
    id: 'u1',
    nome: 'Ana Souza',
    email: 'admin@stalo.com.br',
    role: 'admin',
    status: 'ativo',
    ultimoAcesso: hoursFromNow(-1),
  },
  {
    id: 'u2',
    nome: 'Walex Mateus',
    email: 'contador@stalo.com.br',
    role: 'contador',
    status: 'ativo',
    ultimoAcesso: hoursFromNow(-3),
  },
  {
    id: 'u3',
    nome: 'Emanoel Oliveira',
    email: 'emanoel@stalo.com.br',
    role: 'contador',
    status: 'ativo',
    ultimoAcesso: hoursFromNow(-26),
  },
  {
    id: 'u4',
    nome: 'Júlia Ramos',
    email: 'assistente@stalo.com.br',
    role: 'assistente',
    status: 'ativo',
    ultimoAcesso: hoursFromNow(-5),
  },
  {
    id: 'u5',
    nome: 'Pedro Lima',
    email: 'pedro@stalo.com.br',
    role: 'assistente',
    status: 'inativo',
    ultimoAcesso: hoursFromNow(-24 * 40),
  },
  {
    id: 'u6',
    nome: 'Marina Costa',
    email: 'cliente@stalo.com.br',
    role: 'cliente',
    status: 'ativo',
    ultimoAcesso: hoursFromNow(-72),
  },
  {
    id: 'u7',
    nome: 'Rafael Nunes',
    email: 'rafael@supriloc.com.br',
    role: 'cliente',
    status: 'ativo',
    ultimoAcesso: null,
  },
]
