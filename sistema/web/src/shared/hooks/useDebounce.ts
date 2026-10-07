import { useEffect, useState } from 'react'

/** Valor atrasado em `ms`: para busca por texto não disparar uma query por tecla. */
export function useDebounce<T>(value: T, ms = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return debounced
}
