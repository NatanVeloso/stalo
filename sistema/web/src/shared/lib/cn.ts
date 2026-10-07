/**
 * Junta classes condicionais. Sem tailwind-merge de propósito: conflitos de
 * classe são resolvidos no componente (variantes), não em runtime.
 */
export type ClassValue = string | false | null | undefined | 0

export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(' ')
}
