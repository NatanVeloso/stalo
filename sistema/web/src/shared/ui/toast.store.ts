import { create } from 'zustand'

export type Toast = { id: number; message: string; tone: 'neutral' | 'ok' | 'danger' }

type ToastState = {
  toasts: Toast[]
  push: (message: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
}

let seq = 0

export const useToasts = create<ToastState>()((set) => ({
  toasts: [],
  push(message, tone = 'neutral') {
    const id = ++seq
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Fora de componentes: toast('Salvo', 'ok'). */
export const toast = (message: string, tone?: Toast['tone']) => useToasts.getState().push(message, tone)
