import { describe, expect, it } from 'vitest'
import { can, permissions, roles, type Permission, type Role } from './permissions'

/**
 * Tabela de sistema/DOMINIO.md → "Perfis e permissões", copiada à mão de propósito:
 * se alguém mudar `permissions.ts` sem mudar o contrato (ou vice-versa), este teste quebra.
 * Ordem das colunas: admin, contador, assistente, cliente.
 */
const dominio: Record<Permission, [boolean, boolean, boolean, boolean]> = {
  'dashboard:ver': [true, true, true, true],
  'clientes:ver': [true, true, true, false],
  'clientes:editar': [true, true, false, false],
  'obrigacoes:ver': [true, true, true, true],
  'obrigacoes:editar': [true, true, true, false],
  'financeiro:ver': [true, true, false, false],
  'financeiro:editar': [true, false, false, false],
  'usuarios:gerenciar': [true, false, false, false],
  'configuracoes:ver': [true, true, true, true],
  'atendimento:ver': [true, true, true, false],
  'atendimento:responder': [true, true, true, false],
  'atendimento:gerenciar': [true, false, false, false],
  'bancos:ver': [true, true, false, true],
  'bancos:vincular': [true, false, false, true],
  'bancos:conciliar': [true, true, false, false],
}

const ordem: Role[] = ['admin', 'contador', 'assistente', 'cliente']

describe('permissões', () => {
  it('os perfis são os quatro do contrato', () => {
    expect([...roles]).toEqual(ordem)
  })

  it('a lista de permissões é exatamente a do contrato', () => {
    expect(Object.keys(permissions).sort()).toEqual(Object.keys(dominio).sort())
  })

  for (const [permission, esperado] of Object.entries(dominio) as [Permission, boolean[]][]) {
    it.each(ordem.map((role, i) => [role, esperado[i]] as const))(`${permission}: %s → %s`, (role, ok) => {
      expect(can(role, permission)).toBe(ok)
    })
  }

  it('sem perfil (null/undefined) nunca pode', () => {
    for (const permission of Object.keys(dominio) as Permission[]) {
      expect(can(null, permission)).toBe(false)
      expect(can(undefined, permission)).toBe(false)
    }
  })
})
