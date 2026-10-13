import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { Menu as MenuIcon, Search, Settings, LogOut, UserRound, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { env } from '@/shared/lib/env'
import { useT } from '@/shared/i18n'
import { LanguageMenu } from '@/shared/i18n/LanguageMenu'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { useAuth } from '@/shared/auth'
import { useLiquidGlass } from '@/shared/hooks/useLiquidGlass'
import { Avatar, Badge, IconButton, Menu, MenuItem, MenuLabel, MenuSeparator } from '@/shared/ui'

type Props = { onOpenMenu: () => void }

/**
 * Barra superior em pílula flutuante. É o único liquid glass (refração nas
 * bordas) da tela; os outros painéis usam o vidro comum.
 */
export function Topbar({ onOpenMenu }: Props) {
  const t = useT()
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const pill = useRef<HTMLDivElement>(null)
  const glass = useLiquidGlass(pill)

  return (
    <header className="sticky top-3 z-20 md:top-4">
      <div
        ref={pill}
        className={cn(
          'relative isolate flex h-14 items-center gap-2 rounded-full pr-2 pl-2',
          glass ? 'border border-(--glass-border) bg-(image:--glass) glass-rim shadow-(--glass-shadow)' : 'glass',
        )}
      >
        {glass && (
          <>
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <defs>
                <filter
                  id="liquid-topbar"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                  x="0"
                  y="0"
                  width={glass.width}
                  height={glass.height}
                >
                  <feImage
                    href={glass.map}
                    width={glass.width}
                    height={glass.height}
                    preserveAspectRatio="none"
                    result="map"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={glass.scale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="dr"
                  />
                  <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={glass.scale * 0.88}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="dg"
                  />
                  <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="map"
                    scale={glass.scale * 0.76}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="db"
                  />
                  <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
                  <feBlend in="r" in2="g" mode="screen" result="rg" />
                  <feBlend in="rg" in2="b" mode="screen" />
                </filter>
              </defs>
            </svg>
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-full"
              style={{ backdropFilter: 'url(#liquid-topbar) blur(4px) saturate(1.5)' }}
            />
          </>
        )}
        <span className="glass-sheen -z-10" aria-hidden="true" />

        <IconButton label={t.common.actions.openMenu} onClick={onOpenMenu} className="lg:hidden">
          <MenuIcon />
        </IconButton>

        {/* busca global: só visual por enquanto (Ctrl+K vira paleta de comandos) */}
        <button
          type="button"
          className="ml-1 flex h-10 flex-1 items-center gap-2.5 rounded-full px-3 text-sm text-fg-subtle transition-colors hover:bg-fg/[0.05] hover:text-fg-muted"
          aria-label={t.common.actions.search}
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.common.actions.searchPlaceholder}</span>
          <kbd className="ml-auto hidden rounded-full border border-line px-2 py-0.5 font-sans text-caption text-fg-subtle md:inline">
            {t.common.actions.searchShortcut}
          </kbd>
        </button>

        {env.mock && (
          <span className="hidden md:inline-flex">
            <Badge tone="warn">
              <Sparkles className="size-3" aria-hidden="true" />
              {t.common.mockBadge}
            </Badge>
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <LanguageMenu />
          {user && (
            <Menu
              trigger={
                <button
                  type="button"
                  className="ml-1 rounded-full transition-transform active:scale-95"
                  aria-label={user.nome}
                >
                  <Avatar name={user.nome} />
                </button>
              }
            >
              <MenuLabel>
                <span className="block text-caption font-normal text-fg-subtle">{t.common.user.loggedAs}</span>
                <span className="block truncate text-sm font-medium">{user.nome}</span>
                <span className="block truncate text-xs font-normal text-fg-muted">{user.email}</span>
              </MenuLabel>
              <MenuSeparator />
              <MenuItem icon={<UserRound />} onSelect={() => void navigate('/configuracoes')}>
                {t.common.user.profile}
              </MenuItem>
              <MenuItem icon={<Settings />} onSelect={() => void navigate('/configuracoes')}>
                {t.common.nav.configuracoes}
              </MenuItem>
              <MenuSeparator />
              <MenuItem icon={<LogOut />} tone="danger" onSelect={() => void logout()}>
                {t.common.actions.logout}
              </MenuItem>
            </Menu>
          )}
        </div>
      </div>
    </header>
  )
}
