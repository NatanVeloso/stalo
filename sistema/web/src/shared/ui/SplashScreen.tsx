import { Logo } from './Logo'

/** Tela cheia enquanto a sessão é verificada na carga. */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg text-fg" role="status" aria-live="polite">
      <Logo markOnly className="h-10 w-auto animate-[spin_1.6s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
    </div>
  )
}
