# Stalo Sistema — guia do agente de front

Front do sistema de gestão da Stalo. SPA logada, em três idiomas, tema claro/escuro, visual
"liquid glass" (vidro translúcido, cantos bem arredondados, monocromático).

**Stack:** React 19, Vite 8, TypeScript 5 (strict), Tailwind v4 (config no CSS), React Router 7
(modo biblioteca), TanStack Query 5, Zustand 5, react-hook-form + zod 4, lucide-react, Radix UI
(primitivos sem estilo: hoje Tooltip e Select; o visual é sempre nosso).
Lint: ESLint 9 + typescript-eslint. Formatação: Prettier (+ plugin Tailwind). Testes: Vitest.

```bash
npm run dev        # http://localhost:5174  (sem VITE_API_URL = modo mock, dados fake)
npm run check      # tsc + eslint + vitest — obrigatório antes de entregar
npm run build      # tsc -b && vite build
npm run format
```

Contrato com o back (perfis, rotas, formato de erro, auth): `../DOMINIO.md`. Leia primeiro.

## Mapa do código

```
src/
  main.tsx                  monta <App/>
  app/
    App.tsx                 Providers + Router + Toaster + efeitos globais (tema, bootstrap da sessão)
    providers.tsx           QueryClient
    router.tsx              TODAS as rotas: guards de auth/permissão + AppShell
    styles/index.css        tokens de tema (@theme inline), utilities de vidro, animações
  shared/                   o que é de todo mundo
    ui/                     design system (Button, Card, DataTable, Drawer, Menu, Badge...) — export pelo index
    layout/                 AppShell, Sidebar, Topbar, PageHeader, nav.ts (itens do menu)
    auth/                   store de sessão, permissões, guards de rota, usePermission
    i18n/                   useT(), fmt(), dicionários (locales/<idioma>/<modulo>.ts), LanguageMenu
    theme/                  useTheme (aplica data-theme), ThemeToggle
    prefs/                  store persistido: tema + idioma
    hooks/                  useLiquidGlass, useMediaQuery, useDebounce
    lib/                    http (cliente da API com refresh), format (moeda/data/CNPJ), env, cn
    types/                  tipos de contrato genéricos (Paginated, PageQuery)
  features/<modulo>/        um módulo de negócio = uma pasta
    index.ts                ÚNICA porta de entrada do módulo (páginas, tipos e componentes públicos)
    types.ts                tipos do recurso (espelham a API)
    api.ts                  funções que falam com a API (hoje: mock quando env.mock)
    queries.ts              hooks TanStack Query + queryKeys do módulo
    pages/                  uma página por arquivo, registrada em app/router.tsx
    components/             componentes só deste módulo
  mocks/                    dados fake + fakeDelay; some quando o back existir
  test/setup.ts             jest-dom
```

Alias `@/` = `src/`. Import relativo só dentro da mesma pasta ou um nível (`../`); o ESLint bloqueia
`../../` e também bloqueia importar arquivo interno de outra feature (só pelo `index.ts`).

## Regras de arquitetura

1. **Tudo que vem da API passa por TanStack Query.** `api.ts` faz a chamada, `queries.ts` expõe
   `useXxx()` com `queryKey` vindo de `xxxKeys`. Componente nunca chama `http` nem `fetch`.
   Mutação: `useMutation` em `queries.ts`, invalidando as chaves afetadas (inclusive de outros
   módulos, ex.: entregar obrigação invalida `['dashboard']`).
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
6. **Tempo real** (atendimento): um único cliente Socket.IO em `shared/lib/realtime.ts`,
   conectado depois do login com o access token e reconectado após refresh. Evento recebido
   invalida a query correspondente ou faz `setQueryData` com a mensagem nova; componente nunca
   abre socket próprio.
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
  reimplementado: `@radix-ui/react-tooltip`, `@radix-ui/react-select` já estão; precisando de
  popover, dialog, combobox, tabs ou switch, adicione o primitivo Radix correspondente e embrulhe
  em `shared/ui` com as classes do tema. Nenhum componente fora de `shared/ui` importa Radix direto.
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
  com texto traduzido), erro (`ErrorFallback` ou toast), sucesso.
- Componente genérico recebe **dados prontos** (strings formatadas, callbacks); quem formata moeda
  e data é a página/feature com `shared/lib/format` e o `locale` atual.
- Componentes com `forwardRef` quando envolvem um elemento nativo (Input, Button, Select) para
  funcionarem com react-hook-form.
- Ícones: `lucide-react`, tamanho via classe (`size-4`), sempre `aria-hidden` quando decorativos.
- Formulários: react-hook-form + zod. O schema recebe `t.xxx.errors` para as mensagens saírem
  traduzidas (ver `LoginPage`). Campo = `Field` (label/erro/aria) envolvendo o controle.
- Arquivo exporta **um componente** com o nome do arquivo (`ClienteDrawer.tsx` → `ClienteDrawer`).
  Helpers privados pequenos podem ficar no fim do mesmo arquivo. Hooks e constantes em arquivo
  próprio (regra do HMR / `react-refresh/only-export-components`).

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
  em `useMemo` sem `t` nas dependências.
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
  `text-fg-muted`, `text-fg-subtle`, `border-line`, `border-line-strong`, `bg-accent`/`text-accent-fg`
  (botão primário: preto no claro, branco no escuro), `text-ok`/`bg-ok-soft`, `text-warn`/`bg-warn-soft`,
  `text-danger`/`bg-danger-soft`. Translucidez relativa ao texto: `bg-fg/[0.06]`, `hover:bg-fg/[0.08]`.
  Token novo: definir em `:root` **e** em `[data-theme='dark']` em `styles/index.css`, expor no
  `@theme inline`.
- Prefira classes que já funcionam nos dois temas a `dark:`. Use `dark:` só para exceção pontual.
- **Vidro:** utilities `glass` (painéis, cards, sidebar) e `glass-strong` (o que flutua por cima
  de outro vidro: drawer, menu, select, tooltip, toast; é mais opaco, com mais sombra e brilho
  interno, tokens `--glass-float*`). Os dois ganham a borda "metálica" em gradiente (`--rim`) por
  um `::before` mascarado; por isso o elemento com a classe precisa ser o próprio container
  arredondado (não ponha `glass` num wrapper sem `border-radius`).
  Os vidros são promovidos a camada própria (`translateZ(0)`) para o Chrome não reamostrar o
  backdrop em retângulos no hover; consequência: **nada com `position: fixed` dentro de um
  vidro** (vai ficar relativo ao card). Overlay, drawer, menu, select e tooltip usam portal. `Card` já aplica. Cada vidro é uma cópia desfocada do fundo
  recalculada a cada frame: **nunca em linha de lista, célula ou item repetido**; nesses casos
  `bg-fg/[0.04]` resolve. `prefers-reduced-transparency` desliga o blur sozinho.
- **Liquid glass de verdade** (refração nas bordas via `useLiquidGlass` + filtro SVG) é **um por
  tela**, só em pílula fixa: hoje é a `Topbar`. Não aplicar em card, modal ou lista. Sempre com
  fallback (`glass` quando o hook devolve `null`: Safari, Firefox, reduced-transparency).
- Cantos: `rounded-3xl` em painéis, `rounded-2xl` em inputs/itens, `rounded-full` em botões, pílulas
  e badges. Nada com canto reto.
- Movimento: `animate-rise` na entrada de página/painel; transições de 200–300 ms; respeita
  `prefers-reduced-motion`. Sem animação em loop fora do `SplashScreen`.
- Fundo: `.orbs` atrás de tudo para o vidro ter o que desfocar. Já está no `AppShell` e no login;
  não repetir dentro de página. **O vidro só parece vidro com variação de cor atrás**: por isso o
  fundo tem brilhos suaves (azul à esquerda, ciano, lavanda, branco), todos tokens `--orb-*` por
  tema. Componente nunca usa essas cores; são só ambiente.
- Intensidade do vidro é token por tema: `--glass` (opacidade do fundo), `--glass-blur`,
  `--glass-saturate`, `--glass-border`, `--glass-highlight`, `--sheen-opacity`. No claro o vidro é
  bem mais transparente, com blur e saturação altos e reflexo forte (estilo Apple); no escuro é
  mais discreto. Ajuste de "mais/menos vidro" é nesses tokens, nunca em classe de componente.

### Tamanho da fonte e densidade

O usuário escolhe em Configurações → Aparência (`shared/prefs`: `fontSize` sm/md/lg e `density`
confortável/compacta). Funciona assim, e todo componente novo precisa respeitar:

- **Fonte:** `useApplyPrefs` muda o `font-size` do `<html>` (14/16/18px). Como todo espaçamento do
  Tailwind é em `rem`, a interface inteira escala junto. Por isso **nunca use `px` fixo** para
  texto, padding ou largura de coluna; use as classes normais (`text-sm`, `p-4`, `w-44`).
- **Densidade:** `<html data-density>` troca os tokens `--card-p`, `--card-p-lg`, `--cell-y`,
  `--head-y`, `--nav-y`, `--tile-h`, `--list-y`, `--tile-value` (número grande dos indicadores) e
  `--page-title` em `styles/index.css`. Componentes usam
  `p-(--card-p)`, `py-(--cell-y)` etc. `Card`, `DataTable`, `StatTile`, `Sidebar` e as listas do
  dashboard já usam. **Padding vertical de item repetido (linha, célula, item de lista) vem de um
  token de densidade**, não de `py-3` fixo. Valor em JS (altura de gráfico): `useCompact()`.
- Token de densidade novo: definir nos dois blocos (`:root` e `[data-density='compact']`).

## Autenticação e sessão

- `useAuth()` (Zustand): `status` (`booting | anonymous | authenticated`), `user`, `login`,
  `logout`, `bootstrap`. `accessToken` fica **só em memória**; o `persist` guarda apenas `user`
  (render otimista + saber se vale tentar o refresh na carga).
- `shared/lib/http.ts` injeta o Bearer, faz refresh single-flight no 401 e desloga se o refresh
  falhar. Não criar outro cliente HTTP nem usar `fetch` direto.
- Rotas: `RequireAuth` (sessão) → `AppShell` → `RequirePermission` por módulo. `/login` dentro de
  `RedirectIfAuthenticated`. Nova página protegida segue exatamente esse aninhamento em `router.tsx`.
- Perfil `cliente` enxerga só o que é dele; isso é filtro do back, mas as telas desse perfil devem
  esconder colunas e filtros que não fazem sentido (ex.: coluna "Cliente").

## Acessibilidade e UX

- Foco visível (já global). Controles só com ícone usam `IconButton` com `label` traduzido.
- `DataTable`: linha clicável tem `tabIndex` e Enter; cabeçalho ordenável tem `aria-sort`.
- Drawer e menus fecham com Esc e clique fora; `Drawer` usa `<dialog>` (prende o foco).
- Tabela com muitas colunas: marque as secundárias com `hideOnMobile` e mostre o essencial dentro
  da primeira célula no mobile (ver `ObrigacoesPage`).
- Gráficos: uma série por gráfico, cor = `fill-fg`, grade recessiva, tooltip no hover/foco e
  **sempre** um modo tabela (`ReceitaChart`). Gráfico novo segue `shared/ui/BarChart` como modelo.
- Números em coluna ou lado a lado: classe `tabular`.

## Testes

- Vitest + Testing Library (`src/test/setup.ts`). Arquivo `xxx.test.ts(x)` ao lado do que testa.
- Obrigatório testar: funções puras de `shared/lib`, `fmt`/dicionários, lógica de permissão,
  hooks com regra (ex.: refresh no `http`). Componente de UI: teste só comportamento com regra
  (ordenação da tabela, fechar drawer no Esc), não snapshot.
- Nada de teste que dependa de rede ou de relógio real; mock `Date` quando a regra envolve "hoje".

## Atendimento (WhatsApp)

`features/atendimento` é o inbox em três colunas: `ConversaList` (setores como abas com contagem
de abertas, filtro de estado, busca) · `ConversaView` (cabeçalho com estado e janela de 24 h,
mensagens com separador de dia, `Composer`) · `ContatoPanel` (contato, cliente vinculado via
`useCliente` de clientes, setor, atendente, etiquetas). Regras:

- Abaixo de `lg` mostra uma coluna por vez (lista ou conversa, com botão voltar); abaixo de `xl`
  o painel do contato vira `Drawer`.
- Nomes de setor são **dado** (o admin configura), não tradução; estados, ações e rótulos são.
- `Composer` bloqueia texto livre quando a janela fechou (`lib/janela.ts`) e oferece template;
  nota interna continua liberada e nunca vai para o WhatsApp (bolha tracejada âmbar).
- Mutações invalidam o módulo inteiro (`atendimentoKeys.all`): lista, contadores e mensagens
  mudam juntos. Quando o WebSocket existir, o evento faz a mesma invalidação.
- Abrir uma conversa zera as não lidas (`useMarcarLida`); a chave hoje/ontem dos separadores é
  calculada uma vez por abertura (render puro, sem `Date.now()` no corpo do componente).

## Módulos previstos (ainda sem tela)

- `features/bancos`: contas vinculadas por cliente com saldo, extrato paginado com filtros e
  exportação, botão "Vincular conta" (widget do agregador), consentimento com validade,
  conciliação com lançamentos. Perfil `cliente` vê só as próprias contas.

Permissões já estão em `shared/auth/permissions.ts`; rotas e itens de menu entram quando a
tela existir.

## Antes de entregar

- [ ] `npm run check` passa (tsc, eslint, vitest).
- [ ] Texto novo existe em pt-BR, en e es; conferido trocando o idioma na Topbar.
- [ ] Conferido nos dois temas e em largura de celular (menu, tabela, drawer).
- [ ] Nenhum hex solto, nenhum texto fixo, nenhum `fetch` fora de `http.ts`, nenhum vidro em lista.
- [ ] Estado vazio, skeleton e erro cobertos na tela nova.
- [ ] Rota nova registrada em `router.tsx` com `RequirePermission`; item de menu em `nav.ts`.
- [ ] Se tocou em contrato (tipo, rota, permissão): `../DOMINIO.md` atualizado.
