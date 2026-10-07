import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Providers } from './providers'
import { router } from './router'
import { useAuth } from '@/shared/auth'
import { useApplyPrefs } from '@/shared/theme/useTheme'
import { Toaster } from '@/shared/ui'

export function App() {
  return (
    <Providers>
      <Boot />
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  )
}

/** Efeitos globais: tema/idioma no <html> e verificação da sessão na carga. */
function Boot() {
  useApplyPrefs()
  const bootstrap = useAuth((s) => s.bootstrap)
  useEffect(() => {
    void bootstrap()
  }, [bootstrap])
  return null
}
