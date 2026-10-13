# Stalo Sistema — guia do agente de front

Front do sistema de gestão da Stalo. SPA logada, em três idiomas, tema claro/escuro, visual
"liquid glass" (vidro translúcido, cantos bem arredondados, monocromático).

**Stack:** React 19, Vite 8, TypeScript 5 (strict), Tailwind v4 (config no CSS), React Router 7
(modo biblioteca), TanStack Query 5, Zustand 5, react-hook-form + zod 4, lucide-react, Radix UI
(primitivos sem estilo: Tooltip, Select, Switch, DropdownMenu e Popover; o visual é sempre nosso).
Lint: ESLint 9 + typescript-eslint. Formatação: Prettier (+ plugin Tailwind). Testes: Vitest.

```bash
npm run dev        # http://localhost:5174  (sem VITE_API_URL = modo mock, dados fake)
npm run check      # tsc + eslint + prettier --check + vitest — obrigatório antes de entregar
npm run build      # tsc -b && vite build
npm run format
```

Contrato com o back (perfis, rotas, formato de erro, auth): `../DOMINIO.md`. Leia primeiro.

## Mapa do código

```
src/
  main.tsx                  monta <App/>
  app/
    App.tsx                 Providers + Router + Toaster + efeitos globais (prefs, bootstrap da sessão)
    providers.tsx           QueryClientProvider (cliente de shared/lib/queryClient) + TooltipProvider
    router.tsx              TODAS as rotas: guards de auth/permissão + AppShell + errorElement
    styles/index.css        tokens de tema e densidade (@theme inline), utilities de vidro, animações
  shared/                   o que é de todo mundo
    ui/                     design system, UM componente por arquivo, export pelo index
                            (Button/LinkButton + buttonClass.ts, Card/CardHeader, DataTable, Drawer,
                            Menu/MenuItem/MenuLabel/MenuSeparator, Popover, EmptyState/ErrorState,
                            ForbiddenPage/NotFoundPage/ErrorFallback, toast.store.ts, Logo + logoPaths.ts...)
    layout/                 AppShell (inclui o menu mobile), Sidebar, Topbar, PageHeader, nav.ts
    auth/                   auth.store (sessão), auth.api (login/refresh/logout/esqueci-senha),
                            permissions, guards de rota, usePermission
    i18n/                   useT(), fmt(), getDictionary(), errorMessage(), dicionários
                            (locales/<idioma>/<modulo>.ts), LanguageMenu
    theme/                  useTheme.ts (useApplyPrefs, useResolvedTheme, useDensity, useThemePref), ThemeToggle
    prefs/                  store persistido: tema, idioma, tamanho da fonte, densidade, sons do atendimento
    hooks/                  useLiquidGlass, useMediaQuery (+ useIsDesktop), useDebounce
    lib/                    http (cliente da API com refresh single-flight), queryClient, format
                            (moeda/número/data/competência/percentual/CNPJ), env, cn, particleLogo
                            (geometria pura do asterisco em partículas, usada no login)
    types/                  tipos de contrato genéricos (Paginated, PageQuery, Id)
  features/<modulo>/        um módulo de negócio = uma pasta
    index.ts                ÚNICA porta de entrada do módulo (páginas, tipos, keys e componentes públicos)
    types.ts                tipos do recurso (espelham a API)
    api.ts                  funções que falam com a API (hoje: mock quando env.mock)
    queries.ts              hooks TanStack Query + queryKeys do módulo
    pages/                  uma página por arquivo, registrada em app/router.tsx
    components/             componentes só deste módulo (inclui as definições de colunas de tabela)
    hooks/  lib/            opcionais: hooks com regra e funções puras do módulo (ex.: atendimento)
  mocks/                    dados fake, fakeDelay, paginate, sessão simulada; some quando o back existir
  test/setup.ts             jest-dom + polyfills do jsdom
```

Módulo sem dado próprio (`auth`) pode não ter `types/api/queries`; a API de sessão fica em
`shared/auth/auth.api.ts`.

Alias `@/` = `src/`. Import relativo só dentro da mesma pasta ou um nível (`../`); o ESLint bloqueia
`../../` e também bloqueia importar arquivo interno de outra feature (só pelo `index.ts`).

## Regras de arquitetura

1. **Tudo que vem da API passa por TanStack Query.** `api.ts` faz a chamada, `queries.ts` expõe
   `useXxx()` com `queryKey` vindo de `xxxKeys`. Componente nunca chama `http` nem `fetch`.
   Mutação: `useMutation` em `queries.ts`, invalidando as chaves afetadas, inclusive de outros
   módulos pelas keys exportadas no index (ex.: entregar obrigação invalida `dashboardKeys.all` e
   `clientesKeys.all`). Nunca chave literal de outro módulo.
   **Erros:** toda mutação que falha vira toast traduzido pelo `code` da API (`MutationCache` em
   `shared/lib/queryClient.ts`); quem trata o erro na própria tela passa `meta: { silent: true }`.
   Erro de query é da tela (ver "Estados obrigatórios"). Logout limpa o cache inteiro.
   **Listas são paginadas no servidor** (`Paginated<T>`, `page/pageSize/search/sort/order` +
   filtros): `Pagination` + `DataTable` em modo controlado de ordenação; mudar filtro, busca ou
   ordenação volta para a página 1. Contagem de abas vem de endpoint de contagem, não do array.
2. **Zustand só para estado de cliente**: sessão (`shared/auth`), preferências (`shared/prefs`),
   toasts. Nada de dado de servidor em Zustand. Estado de tela (aba, filtro, drawer aberto) é
   `useState` na página.
3. **Mock é transparente.** `api.ts` tem o `if (!env.mock) return http.get(...)` em cima e o mock
   embaixo. Quando a API existir, apaga-se o bloco do mock; assinatura e tipos não mudam.
   Nenhum componente sabe que está em mock (exceto o badge "Dados de demonstração" e os atalhos
   de login, ambos atrás de `env.mock`).
4. **Permissão em três lugares, nunca em um só:** `nav.ts` (esconde do menu), `router.tsx`
   (`RequirePermission`, bloqueia a URL) e `usePermission()` no componente (esconde botão/coluna).
   A lista de permissões é `shared/auth/permissions.ts` e espelha `DOMINIO.md`.
5. **Feature não importa feature por dentro.** Precisa de algo de outro módulo? Ele exporta pelo
   `index.ts` (ex.: `VencimentoBadge` de obrigações usado no dashboard). Se dois módulos
   precisam do mesmo componente e ele não pertence a nenhum, vai para `shared/ui`.
6. **Tempo real** (atendimento, **ainda não implementado**: o back não existe): quando entrar, será
   um único cliente Socket.IO em `shared/lib/realtime.ts`, conectado depois do login com o access
   token e reconectado após refresh. Evento recebido invalida a query correspondente ou faz
   `setQueryData` com a mensagem nova; componente nunca abre socket próprio.
7. **Widget de terceiro** (Pluggy Connect para vincular conta): carregado sob demanda, só na
   página que usa, dentro de um wrapper em `features/bancos/components`; o token vem da API,
   nunca de variável de ambiente do front.
8. **Página = composição.** `pages/XxxPage.tsx` monta `PageHeader` + cards + tabela a partir de
   hooks e componentes; lógica de dado fica nos hooks, lógica visual nos componentes. Página com
   mais de ~150 linhas está pedindo para extrair componente.

## Componentização

- **Antes de criar, procure em `shared/ui`.** Botão, input, select, badge, avatar, card, tabela,
  paginação, drawer, menu, segmented, skeleton, estado vazio, stat tile, gráfico de barras, toast,
  tooltip. Variante nova entra no componente existente (prop `variant`/`tone`/`size`), não em cópia.
- **Controle com comportamento complexo (foco, teclado, posicionamento) vem do Radix**, nunca
  reimplementado: tooltip, select, switch, dropdown-menu (`Menu`) e popover (`Popover`) já estão;
  precisando de dialog, combobox ou tabs, adicione o primitivo Radix e embrulhe em `shared/ui` com
  as classes do tema. Nenhum componente fora de `shared/ui` importa Radix (o ESLint bloqueia).
- **Menu × Popover:** lista de ações → `<Menu trigger={…}>` com `MenuItem`/`MenuLabel`/
  `MenuSeparator` (setas, Esc, foco volta ao gatilho, item fecha o menu). Painel com controles
  (toggles, campos) → `<Popover trigger={…} label={t.x}>`. Os dois em portal.
- **Navegação com cara de botão:** `LinkButton`. Nunca `<Link><Button/></Link>` (controle dentro de
  controle).
- **Tooltip:** `IconButton` já mostra o `label` como tooltip (desligue com `tooltip={false}` quando
  o botão abre um menu com o mesmo texto). Para outros gatilhos use `<Tooltip content={t.x.y}>` em
  volta de um elemento que aceita `ref`. Nunca use o atributo `title`: não traduz bem, não abre no
  foco e não segue o tema. Tooltip é só visual; o rótulo acessível continua sendo `aria-label`.
- **Select:** `shared/ui/Select` (Radix) com `value`/`onChange(valor)`/`options`. Aceita `''` para
  "Todos". Com rótulo visível, envolva em `Field`; como filtro inline, passe `aria-label`. Não use
  `<select>` nativo (visual do sistema operacional, fora do tema).
- **Até os loadings são componentes:** `Skeleton` com a mesma forma do conteúdo final (a tabela já
  faz isso com `loading`), `StatTile loading`, `SplashScreen` na carga da sessão. Nunca "Carregando..."
  solto nem spinner centralizado em página inteira.
- **Estados obrigatórios** de toda lista/tela de dado: carregando (skeleton), vazio (`EmptyState`
  com texto traduzido), erro (`ErrorState` com `onRetry`, ou `DataTable error`), sucesso. Erro de
  mutação já vira toast sozinho. `ErrorFallback` é só para erro de render da rota (errorElement).
- Componente genérico recebe **dados prontos** (strings formatadas, callbacks); quem formata moeda,
  data e percentual é a página/feature com `shared/lib/format` e o `locale` atual (ex.:
  `StatTile delta.text`). Exceção: números de controle do próprio componente (`Pagination`,
  contagem do `Segmented`) são formatados por dentro com `useLocale`.
- Componentes com `forwardRef` quando envolvem um elemento nativo (Input, SearchInput, Button,
  LinkButton, IconButton, Select, Switch) para funcionarem com react-hook-form e como gatilho Radix.
- Ícones: `lucide-react`, tamanho via classe (`size-4`). A versão instalada já põe `aria-hidden` em
  ícone sem rótulo. Ícone que **transmite informação** (✓✓ lida, ponto de estado) precisa de texto
  `sr-only` ao lado: `aria-label` em `<span>`/`<svg>` sem role é ignorado pelo leitor de tela.
- Botão cujo texto some no mobile (`hidden sm:inline`) precisa de `aria-label` com o mesmo texto.
- Coluna de ações de tabela: `header={t.common.table.actions}` + `hideHeader` (nunca `<th>` vazio).
- Formulários: react-hook-form + zod. O schema recebe `t.xxx.errors` para as mensagens saírem
  traduzidas (ver `LoginPage`). Campo = `Field` (label/erro/aria) envolvendo o controle.
- Arquivo exporta **um componente** com o nome do arquivo (`ClienteDrawer.tsx` → `ClienteDrawer`).
  Helpers privados pequenos podem ficar no fim do mesmo arquivo, sem export. Hooks, constantes e
  funções de classe (`buttonClass.ts`) em arquivo `.ts` próprio (regra do HMR /
  `react-refresh/only-export-components`).

## Tradução (pt-BR, en, es)

**Todo texto visível ou lido por leitor de tela vem do dicionário.** Nem rótulo, nem placeholder,
nem `aria-label`, nem título de tooltip fica fixo em componente.

- `const t = useT()` no componente; `t.<modulo>.<chave>`. Interpolação com
  `fmt(t.clientes.subtitle, { n: total })` (chaves `{n}` no texto).
- Dicionários em `shared/i18n/locales/<idioma>/<modulo>.ts`. **pt-BR é a fonte da verdade**: o tipo
  `Dictionary` sai dele; `en` e `es` são anotados com `Dictionary['modulo']`, então chave faltando ou
  sobrando quebra o `tsc`. Texto novo = criar em pt-BR, traduzir nos outros dois, usar.
- Módulo novo = arquivo novo nas três pastas + registrar no `index.ts` de cada idioma.
- Enums da API (status, regime, perfil, tipo de obrigação) têm tabela em `common.status`,
  `common.regime`, `common.roles`, `obrigacoes.tipos`: renderize `t.common.status[valor]`, nunca o
  valor cru.
- A troca de idioma é em runtime (store), sem recarregar. Não guarde texto traduzido em estado nem
  em `useMemo` sem `t` nas dependências: guarde a chave/código e traduza no render.
- Texto com pontuação ou separador entre partes (`"{a}: {b}"`, `"{a} · {b}"`) é uma chave com
  placeholders, não concatenação no JSX: a ordem e a pontuação mudam entre idiomas.
- Erro da API: traduza pelo `code` (`errorMessage(error, t)` → `t.common.errors.codes`), nunca pela
  `message` (é para log, em português).
- Formatação de número, moeda e data: `shared/lib/format` com o `locale` de `useLocale()`. Moeda é
  sempre BRL; só a grafia muda.
- Não traduza: nomes próprios, CNPJ, e-mails, siglas fiscais (DAS, DCTF...), dados vindos da API.

## Tema (claro/escuro) e liquid glass

O tema é **preto e branco**: a interface é monocromática; cor só em estado (`ok`, `warn`, `danger`)
e sempre acompanhada de texto ou ícone (nunca cor sozinha).

- Preferência em `shared/prefs` (`light | dark | system`), aplicada em `<html data-theme>` por
  `useApplyPrefs()`; o `index.html` tem um script inline que aplica antes do primeiro paint
  (mesma chave de localStorage: `stalo-sistema:prefs`). Não duplicar essa lógica.
- **Só tokens, nunca hex em componente.** Classes: `bg-bg`, `bg-bg-elevated`, `text-fg`,
  `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`, `bg-bg-sunken` (painel de
  destaque dentro de um vidro, um tom mais escuro: a coluna do contato no atendimento), `bg-accent`/`text-accent-fg`
  (botão primário: preto no claro, branco no escuro), `text-ok`/`bg-ok-soft`, `text-warn`/`bg-warn-soft`,
  `text-danger`/`bg-danger-soft`, `text-nav-<modulo>` (só o ícone do item ativo do menu lateral, uma cor por módulo, via `activeColor` em `nav.ts`; não é cor de estado). `bg-scrim` (véu atrás de overlay), `shadow-accent` (sombra do botão primário).
  Translucidez relativa ao texto: `bg-fg/[0.06]`, `hover:bg-fg/[0.08]`. Exceções a "nunca hex":
  as bandeiras do `Flag` (imagem de conteúdo) e o `#000` de `mask-image` (só o alfa importa).
  Token novo: definir em `:root` **e** em `[data-theme='dark']` em `styles/index.css`, expor no
  `@theme inline`.
- Prefira classes que já funcionam nos dois temas a `dark:`. Use `dark:` só para exceção pontual.
- A cor das luzes dos indicadores (`--light-*`), do fio (`--rim-chroma`) e das orbes é ambiente, como a
  luz passando pela lente; não é cor de estado nem de marca e nenhum componente a usa diretamente.
- **Vidro:** utilities `glass` (painéis, cards, sidebar) e `glass-strong` (o que flutua por cima
  de outro vidro: drawer, menu, select, tooltip, toast; é mais opaco, com mais sombra, tokens
  `--glass-float*`). O volume do vidro vem do `box-shadow` (`--glass-shadow`), não da borda:
  um bisel (banda escura logo abaixo da borda de cima), uma vinheta escura por dentro em volta,
  um fio de luz no canto superior esquerdo e a sombra externa longa. A borda é um fio de 1px
  discreto em gradiente (`--rim`, com a dispersão cromática `--rim-chroma` bem leve) desenhado
  por um `::before` mascarado; por isso o elemento com a classe precisa ser o próprio container
  arredondado (não ponha `glass` num wrapper sem `border-radius`). O reflexo (`glass-sheen`,
  filho absoluto que `Card`, `Sidebar`, `Drawer` e `Topbar` já têm) traz o brilho especular no
  canto superior esquerdo. Os quatro indicadores do dashboard têm, além disso, uma **luz colorida
  à direita, um pouco acima do meio** (34% da altura), uma cor por card (`StatTile light="blue|pink|amber|mint"`, utilities
  `glass-light-*`, tokens `--light-*`); não é para usar em outros cards.
  **Vidro embutido:** `glass-inset` é o item de vidro dentro de um painel (compromisso em lista,
  pílula ativa do `Segmented`, item ativo do menu, seção de drawer, chip): mesmo relevo e anel,
  **sem** backdrop-filter, então pode repetir numa lista curta. `glass-field` é o mesmo relevo
  para `Input`/`Select` (input não tem `::before`, então vai sem anel). `glass-well` é o trilho
  afundado onde uma pílula embutida se destaca (`Segmented`). `glass-rim` é só o anel, para um
  elemento que já tem o próprio fundo (a `Topbar` com refração).
  O modelo anterior do vidro está copiado em `design-v1/` (não importado; só para comparar/voltar).
  Os vidros são promovidos a camada própria (`translateZ(0)`) para o Chrome não reamostrar o
  backdrop em retângulos no hover; consequência: **nada com `position: fixed` dentro de um
  vidro** (vai ficar relativo ao card). Overlay, drawer, menu mobile, `Menu`, `Popover`, select e
  tooltip usam portal. `Card` já aplica. (O tooltip do `BarChart` é `absolute` dentro do próprio
  gráfico, não `fixed`, por isso não precisa de portal.) Cada vidro é uma cópia desfocada do fundo
  recalculada a cada frame: **nunca em linha de lista, célula ou item repetido**; nesses casos
  `glass-inset` ou `bg-fg/[0.04]` resolvem. Única exceção: a pilha de toasts (`glass-strong`,
  raramente mais de dois). `prefers-reduced-transparency` desliga o blur sozinho.
- **Liquid glass de verdade** (refração nas bordas via `useLiquidGlass` + filtro SVG) é **um por
  tela**, só em pílula fixa: hoje é a `Topbar`. Não aplicar em card, modal ou lista. Sempre com
  fallback (`glass` quando o hook devolve `null`: Safari, Firefox, reduced-transparency).
- Cantos: `rounded-3xl` em painéis, `rounded-2xl` em inputs/itens, `rounded-full` em botões, pílulas,
  badges e teclas (`kbd`). Item dentro de painel flutuante (menu, select, tooltip) e chip de ícone
  usam `rounded-xl`, um degrau abaixo do container. Nada com canto reto (linha de tabela é reta; o
  canto vem do card com `overflow-hidden`).
- Movimento: `animate-rise` na entrada de página/painel; transições de 200–300 ms. Animação em loop
  só no `SplashScreen`, no `Skeleton` (pulse), no spinner do `Button loading` e no fundo do login
  (`CosmosBackground`). `prefers-reduced-motion` para todas elas (regra em `styles/index.css`; o
  fundo do login checa sozinho e fica parado).
- **Fundo do login (`features/auth/components/CosmosBackground`)**: Canvas 2D, sem dependência, em
  duas camadas: o **universo** (galáxia de partículas inclinada girando devagar com o núcleo à
  direita do card, duas galáxias satélites à esquerda, uma galáxia distante e apagada no canto
  inferior direito, estrelas piscando e poeira) num canvas desfocado por CSS, como fora de foco, e o
  **asterisco** da Stalo à esquerda num canvas nítido por cima (gira no sentido horário, uma volta a
  cada 40 s, inclina em 3D para o lado do mouse, as partículas correm e tremulam dentro dos palitos
  e uma onda azul passa por eles a cada 6 s). Na entrada, universo e logo partem de pontos
  espalhados pela página e se organizam juntos. O mouse (sem tingir de azul o que está em volta
  dele) solta faíscas que mudam de cor conforme ele anda (paleta de nebulosa) e empurra as
  partículas do ícone; **clique no fundo** (fora de campo, botão, link ou elemento com `role`) solta
  uma rajada de faíscas e empurra tudo em volta, que volta com mola. Os canvas ficam atrás do card
  (`absolute inset-0`, `pointer-events-none`) e o motor escuta a janela. O card do login usa o vidro
  padrão (`glass`, não `strong`) e o núcleo da galáxia fica logo à direita dele: o vidro desfoca os
  pontos (não aparecem através dele, de propósito, pela legibilidade) e deixa passar o brilho do
  núcleo como luz fosca na borda. Só no **desktop e, por enquanto, só no tema escuro**: montado
  condicionalmente (`useIsDesktop()` + tema resolvido), não escondido por CSS (canvas escondido
  continuaria animando). Decorativo (`aria-hidden`); não usar em página logada. Ajustes (posição,
  tamanho, contagens, velocidades, inclinação, faíscas, clique, movimento interno) são constantes no
  topo de `features/auth/lib/cosmosEngine.ts`; o desfoque é a classe do canvas do universo no
  componente; a geometria pura e testada fica em `features/auth/lib/galaxy.ts` (galáxias, estrelas,
  paleta) e `shared/lib/particleLogo.ts` (ícone). Cores, todas tokens em `rgb()` (o canvas lê o
  valor literal): `--fg`, `--cosmos-blue` (o mesmo azul de `--orb-blue`, sem a transparência) e a
  paleta do rastro `--cosmos-violet`/`-magenta`/`-amber`/`-ice` (sem verde). Ambiente, nunca cor de
  estado. Os paths do logo vivem em `shared/ui/logoPaths.ts` (fonte única para `Logo` e o fundo).
- Fundo: `.orbs` atrás de tudo para o vidro ter o que desfocar. Já está no `AppShell` e no login;
  não repetir dentro de página. **O vidro só parece vidro com variação de cor atrás**: por isso o
  fundo tem brilhos suaves, todos tokens `--orb-*` por tema e com a **mesma composição nos dois
  temas**: um azul profundo atrás do menu (`--orb-blue` e `--orb-blue-2`, canto superior esquerdo)
  e um azul discreto no canto inferior direito (`--orb-c`); o resto é neutro. Componente nunca usa essas cores; são só ambiente.
- Intensidade do vidro é token por tema: `--glass` (opacidade do fundo), `--glass-blur`,
  `--glass-saturate`, `--glass-border`, `--glass-highlight`, `--sheen-opacity`. No claro o vidro é
  bem mais transparente, com blur e saturação altos e reflexo forte (estilo Apple); no escuro é
  mais discreto. Ajuste de "mais/menos vidro" é nesses tokens, nunca em classe de componente.

### Tamanho da fonte e densidade

O usuário escolhe em Configurações → Aparência (`shared/prefs`: `fontSize` sm/md/lg e `density`
confortável/média/compacta). Funciona assim, e todo componente novo precisa respeitar:

- **Fonte:** `useApplyPrefs` muda o `font-size` do `<html>` (14/16/18px). Como todo espaçamento do
  Tailwind é em `rem`, a interface inteira escala junto. Por isso **nunca use `px` fixo** para
  texto, padding ou largura de coluna; use as classes normais (`text-sm`, `p-4`, `w-44`) e, para os
  tamanhos intermediários, os tokens `text-micro` (10px), `text-caption` (11px), `text-small`
  (13px) e `text-title` (15px), definidos em rem no `@theme`. Nada de `text-[13px]`.
- **Densidade:** `<html data-density>` troca os tokens `--card-p`, `--card-p-lg`, `--cell-y`,
  `--head-y`, `--nav-y`, `--tile-h`, `--list-y`, `--list-gap`, `--stack-y` (entre cards e seções),
  `--card-head-mb`, `--page-head-mb`, `--shell-gap`, `--tile-value` (número grande dos
  indicadores) e `--page-title` em `styles/index.css`. Componentes usam `p-(--card-p)`,
  `py-(--cell-y)`, `gap-(--stack-y)` etc. `Card`, `DataTable`, `StatTile`, `Sidebar`, `PageHeader`
  e o dashboard já usam. Token de densidade novo: definir nos três blocos (`:root`,
  `[data-density='medium']`, `[data-density='compact']`). Só na compacta a fonte raiz também
  encolhe (`compactFontScale` em `shared/prefs`, espelhado no script do `index.html`), então ali
  tudo em rem aperta junto.
  **Padding e espaço vertical de item repetido ou de empilhamento (linha, célula, item de lista,
  gap entre cards) vem de um token de densidade**, não de `py-3`/`gap-4` fixo. Altura calculada
  (`calc(100dvh - …)`) também usa os tokens (`--shell-gap`), senão só bate numa densidade. Valor
  em JS (altura de gráfico): `useDensity()`.

## Autenticação e sessão

- `useAuth()` (Zustand): `status` (`booting | anonymous | authenticated`), `user`,
  `login(email, password, remember)`, `logout`, `bootstrap`, `setUser`. `accessToken` fica **só em
  memória**; o `persist` guarda apenas `user` (render otimista + saber se vale tentar o refresh).
  Login, logout e sessão expirada limpam o cache das queries.
- `shared/lib/http.ts` injeta o Bearer, faz refresh single-flight no 401 e desloga se o refresh
  falhar. O bootstrap da sessão usa o **mesmo** `refreshSession()`: dois refresh com o mesmo cookie
  fariam o back revogar a família de sessões. Não criar outro cliente HTTP nem usar `fetch` direto.
- No modo mock a sessão simulada fica em `mocks/session.ts` (chave própria do localStorage).
- Rotas: `RequireAuth` (sessão) → `AppShell` → `RequirePermission` por módulo. `/login` dentro de
  `RedirectIfAuthenticated`. Nova página protegida segue exatamente esse aninhamento em `router.tsx`.
- Perfil `cliente` enxerga só o que é dele; isso é filtro do back, mas as telas desse perfil devem
  esconder colunas e filtros que não fazem sentido (ex.: coluna "Cliente").

## Acessibilidade e UX

- Foco visível (já global). Controles só com ícone usam `IconButton` com `label` traduzido.
- `DataTable`: linha clicável tem `tabIndex` e Enter; cabeçalho ordenável tem `aria-sort`.
- Drawer, menu mobile, `Menu` e `Popover` fecham com Esc e clique fora; `Drawer` e menu mobile usam
  `<dialog>` (prendem o foco), `Menu`/`Popover` devolvem o foco ao gatilho.
- Tabela com muitas colunas: marque as secundárias com `hideOnMobile` e mostre o essencial dentro
  da primeira célula no mobile (ver `ObrigacoesPage`).
- Gráficos: uma série por gráfico, cor = `fill-fg`, grade recessiva, tooltip no hover/foco e
  **sempre** um modo tabela (`ReceitaChart`). Gráfico novo segue `shared/ui/BarChart` como modelo.
- Números em coluna ou lado a lado: classe `tabular`.

## Testes

- Vitest + Testing Library (`src/test/setup.ts`, com polyfill de `<dialog>` para o jsdom). Arquivo
  `xxx.test.ts(x)` ao lado do que testa.
- Obrigatório testar: funções puras de `shared/lib`, `fmt`/dicionários, lógica de permissão,
  hooks com regra (ex.: refresh no `http`). Componente de UI: teste só comportamento com regra
  (ordenação da tabela, fechar drawer no Esc), não snapshot.
- Nada de teste que dependa de rede ou de relógio real; mock `Date` quando a regra envolve "hoje".

## Atendimento (WhatsApp)

`features/atendimento` é o inbox em três colunas: `ConversaList` (canais como abas com contagem
de abertas, filtro de estado, busca, itens em `ConversaItem`) · `ConversaView` (`ConversaHeader`
com estado, janela de 24 h e ações; `MensagensLista` com separador de dia; `Composer`) ·
`ContatoPanel` (contato, `ClienteVinculado` via `useCliente` de clientes, canal, atendente,
etiquetas). Regras:

- Abaixo de `lg` mostra uma coluna por vez (lista ou conversa, com botão voltar); abaixo de `xl`
  o painel do contato vira `Drawer`, que fecha sozinho se a janela crescer até `xl`.
- Nomes de canal e de template são **dado** (o admin configura), não tradução; estados, ações,
  rótulos e **eventos de sistema** são: mensagem de sistema chega como `evento` + `dados` e o
  `MensagemBubble` monta o texto com `fmt` (`message.eventos.*`).
- Permissão: sem `atendimento:responder` a conversa é só leitura (sem composer, sem atribuir,
  resolver, transferir ou vincular; selects do painel desabilitados).
- Listas paginadas com `useInfiniteQuery`: conversas ("Carregar mais" no fim) e mensagens (a API
  manda as mais recentes primeiro; a tela inverte e oferece "Carregar anteriores" no topo). Os
  contadores das abas e o total de não lidas vêm de `GET /atendimento/conversas/contagem`.
- `Composer` bloqueia texto livre quando a janela fechou (`lib/janela.ts`) e oferece template
  (`TemplateMenu`, lista de `GET /atendimento/templates`); nota interna continua liberada e nunca
  vai para o WhatsApp (bolha tracejada âmbar).
- Atribuir e transferir mandam **ids** (`atendenteId`, `canalId`); os atendentes vêm de
  `GET /atendimento/atendentes`, nunca de lista fixa.
- Mutações invalidam o módulo inteiro (`atendimentoKeys.all`): lista, contadores e mensagens
  mudam juntos. Quando o WebSocket existir, o evento faz a mesma invalidação.
- Abrir uma conversa zera as não lidas (`useMarcarLida`), e de novo se chegar mensagem com ela
  aberta. A conversa aberta vem de `useConversa(id)`, então não some quando sai do filtro.
- Separador hoje/ontem: chave do dia **local** (`localDayKey`), calculada uma vez por abertura
  (`MensagensLista` montada com `key={conversa.id}`); render puro, sem `Date.now()` no corpo.
- A altura da tela é `calc(100dvh - … - var(--shell-gap))`, para valer nas três densidades.
- **Sons** (`lib/sons.ts`, Web Audio, sem asset): blip ao enviar (no `onSuccess` de
  `useEnviarMensagem`, nota interna não toca) e "di-dim" ao receber, disparado pelos hooks de
  `hooks/useSomRecebimento.ts` quando o total de não lidas da contagem sobe ou a conversa aberta
  ganha mensagem do contato mais nova que a última vista (primeira carga e "carregar anteriores"
  não tocam; dois disparos juntos tocam um). O sino da lista (`SomMenu`, um `Popover`) tem um
  `Switch` e um botão de ouvir por som; a preferência fica em `shared/prefs`.
- Ainda sem ação (falta tela/contrato): vincular contato a um cliente (precisa de seletor de
  cliente) e anexo.

## Módulos previstos (ainda sem tela)

- `features/bancos`: contas vinculadas por cliente com saldo, extrato paginado com filtros e
  exportação, botão "Vincular conta" (widget do agregador), consentimento com validade,
  conciliação com lançamentos. Perfil `cliente` vê só as próprias contas.

Permissões já estão em `shared/auth/permissions.ts`; rotas e itens de menu entram quando a
tela existir.

## Antes de entregar

- [ ] `npm run check` passa (tsc, eslint, prettier, vitest).
- [ ] Texto novo existe em pt-BR, en e es; conferido trocando o idioma na Topbar.
- [ ] Conferido nos dois temas e em largura de celular (menu, tabela, drawer).
- [ ] Nenhum hex solto, nenhum texto fixo, nenhum `fetch` fora de `http.ts`, nenhum vidro em lista.
- [ ] Estado vazio, skeleton e erro (`ErrorState`/`DataTable error`) cobertos na tela nova.
- [ ] Lista nova paginada no servidor; permissão nos três lugares; perfil `cliente` sem colunas inúteis.
- [ ] Rota nova registrada em `router.tsx` com `RequirePermission`; item de menu em `nav.ts`.
- [ ] Se tocou em contrato (tipo, rota, permissão): `../DOMINIO.md` atualizado.
