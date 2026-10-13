import { afterEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAuth, useRole, type AuthUser } from './auth.store'
import { usePermission } from './usePermission'

const user = (role: AuthUser['role']): AuthUser => ({ id: 'u1', nome: 'Ana', email: 'a@stalo.com.br', role })

afterEach(() => {
  useAuth.setState({ status: 'anonymous', user: null, accessToken: null })
})

describe('usePermission', () => {
  it('sem usuário nega', () => {
    const { result } = renderHook(() => usePermission('dashboard:ver'))
    expect(result.current).toBe(false)
  })

  it('segue o perfil do usuário logado', () => {
    useAuth.setState({ status: 'authenticated', user: user('contador') })
    expect(renderHook(() => usePermission('clientes:editar')).result.current).toBe(true)
    expect(renderHook(() => usePermission('financeiro:editar')).result.current).toBe(false)
  })

  it('re-renderiza quando o perfil muda (ex.: logout ou troca de usuário)', () => {
    useAuth.setState({ status: 'authenticated', user: user('admin') })
    const { result } = renderHook(() => usePermission('usuarios:gerenciar'))
    expect(result.current).toBe(true)

    act(() => useAuth.setState({ user: user('cliente') }))
    expect(result.current).toBe(false)

    act(() => useAuth.setState({ user: null }))
    expect(result.current).toBe(false)
  })

  it('cliente não vê clientes nem atendimento, mas vê bancos', () => {
    useAuth.setState({ status: 'authenticated', user: user('cliente') })
    expect(renderHook(() => usePermission('clientes:ver')).result.current).toBe(false)
    expect(renderHook(() => usePermission('atendimento:ver')).result.current).toBe(false)
    expect(renderHook(() => usePermission('bancos:ver')).result.current).toBe(true)
  })
})

describe('useRole', () => {
  it('devolve o perfil ou null', () => {
    const { result } = renderHook(() => useRole())
    expect(result.current).toBeNull()
    act(() => useAuth.setState({ user: user('assistente') }))
    expect(result.current).toBe('assistente')
  })
})
