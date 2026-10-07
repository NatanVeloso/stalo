# Stalo — guia para agentes

Site institucional da Stalo Consulting (contabilidade). Página única com animações de scroll, mais duas páginas de texto legal, em três idiomas.

**Stack:** React 19, Vite 8, TypeScript, Tailwind v4 (config no CSS, sem `tailwind.config`), GSAP 3 (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG). Sem router, sem biblioteca de i18n, sem gerenciador de estado.

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  (o tsc é a única checagem automática; não há testes nem lint)
```

Comentários e nomes de arquivos seguem em português, como o resto do código. Comente o porquê (restrição, armadilha), não o que a linha faz.

## Mapa do código

```
src/
  main.tsx            decide modo de performance, idioma e página, depois renderiza
  App.tsx             site de página única: ScrollSmoother + sections empilhadas
  i18n/               idiomas e textos (ver "Tradução")
    index.ts          idioma pela URL, `t`, `legal`, hrefs, <html lang>/hreflang
    locales/          pt-BR.ts (fonte da verdade), en.ts, es.ts
    legal/            Política de Privacidade e Termos, um arquivo por idioma
  data/
    company.ts        dados fixos da empresa (nome, e-mail, telefone, CNPJ)
    content.ts        junta dados não traduzíveis (links, imagens, tons) com `t`
    tracking.ts       ID do Meta Pixel (vazio = rastreamento desligado)
  lib/
    gsap.ts           registro dos plugins, easings, `heavy()`
    perf.ts           modo full/lite
    reveal.ts         `revealLines()`: título que sobe linha a linha
    consent.ts        consentimento de cookies; pixel.ts só carrega com aceite
    posts.ts          cliente da API do blog (tipos + fetch)
  hooks/useLiquidGlass.ts
  components/         uma section ou peça de UI por arquivo
    Blog*.tsx, Post*  blog: section da home, /blog e /blog/:slug
    PageHeader/Footer cabeçalho e rodapé das páginas estáticas
  index.css           tokens (@theme), utilities de vidro, overrides do modo lite
api/                  backend NestJS do blog (ver "Blog e API"), com README próprio
```

## Componentes

- **Uma section = um componente** em `src/components`, montado em `App.tsx` dentro de um `StackSection`. Peças reutilizadas viram componente próprio (`CursorGlow`, `Logo`, `Marquee`, `LanguageSwitcher`); não copie JSX entre sections.
- **Componente não guarda conteúdo.** Texto vem de `t` (src/i18n); listas, links e imagens vêm de `data/content.ts`. O componente cuida de layout e animação.
- **Animação fica no próprio componente**, num `useGSAP(() => {...}, { scope: root })`, selecionando por classe dentro do escopo (`gsap.utils.selector(root)`). Não use `useEffect` para GSAP nem seletores globais.
- **Estilo é Tailwind inline.** Só vai para `index.css` o que não cabe em classe: tokens de cor, utilities compartilhadas (`glass`, `container-site`, `serif-italic`) e regras que dependem de `data-perf` ou de pseudo-elementos.
- **Cores:** use os tokens (`bg-ink`, `text-fog`, `bg-navy`, `text-mint`...). Hex solto só quando a cor é específica de uma peça, como os tons da foto no card do "Sobre".
- **Acessibilidade:** `aria-label` em link/botão só com ícone (traduzido), `alt=""` em imagem decorativa, `aria-hidden` em SVG decorativo, foco visível em controles.
- **Fundos em vídeo:** `videos` em `data/content.ts` + `BackgroundVideo` dentro do elemento que tem a imagem de fundo (hero e "Resultados"). Vazio = só a imagem. O componente não renderiza no modo `lite` nem com "reduzir movimento"; a imagem é o fallback e o poster.
- **Depoimentos:** carrossel nativo (scroll-snap + setas + arraste pelo mouse via `hooks/useDragScroll.ts`, reutilizável em qualquer scroller horizontal) em `Testimonials.tsx`, dados em `results.testimonials`. Oito dos dez são PLACEHOLDERS (`t.results.placeholders`) e precisam virar depoimentos reais antes de publicar.

### Sections empilhadas (`StackSection`)

`App.tsx` fixa cada section quando o fundo dela encosta no fundo do viewport e a próxima desliza por cima como um cartão. Regras:

- cada `StackSection` recebe um `z` maior que o da anterior;
- precisa ter pelo menos 100vh (o `min-h-screen` interno garante); mais baixa que isso, duas sections ficam presas ao mesmo tempo;
- a última não é fixada. Blocos que não precisam do efeito entram dentro de um `StackSection` existente (FAQ, Depoimentos e Rodapé dividem o último; o carrossel de logos de clientes, `ClientLogos.tsx`, fica na base da hero e lê a lista `clients` de `data/content.ts`);
- a transição só funciona bem entre cores diferentes: um cartão claro deslizando sobre outro claro fica sujo. Por isso Serviços e Sobre dividem um cartão, separados pelo corte diagonal do `SectionDivider` (o tom `paper-2` do Sobre é o que desenha o corte).

## Tradução (pt-BR, en, es)

**Todo texto visível ou lido por leitor de tela é traduzido.** Nenhuma string de interface fica fixa em componente: nem rótulo de botão, nem `aria-label`, nem `placeholder`, nem `alt`.

- **O idioma vem só da URL:** `/` pt-BR, `/en` inglês, `/es` espanhol. Páginas legais: `/privacidade`, `/en/privacy`, `/es/privacidad` (o slug é o campo `slug` de cada texto legal).
- **Trocar de idioma é uma navegação comum** (o `LanguageSwitcher` é só `<a href>`). Por isso `t` é uma constante de módulo, resolvida uma vez na carga: `import { t } from '../i18n'` e pronto, sem hook, contexto ou re-render. Não tente trocar idioma sem recarregar: SplitText e ScrollTrigger já mediram o texto.
- **`pt-BR.ts` é a fonte da verdade.** O tipo `Dictionary` sai dele; `en.ts` e `es.ts` são anotados com esse tipo, então chave faltando ou sobrando quebra o `tsc`.

Para adicionar ou mudar texto:

1. crie a chave em `src/i18n/locales/pt-BR.ts`, no bloco da section;
2. traduza em `en.ts` e `es.ts` (o build cobra);
3. use `t.bloco.chave` no componente. Se o texto acompanha dado não traduzível (imagem, link, tom), junte os dois em `data/content.ts` por chave, como `services` e `steps` fazem.

Convenções:

- **Título com destaque em itálico:** par `title` + `accent`; o componente renderiza `{title} <span className="serif-italic">{accent}</span>`. O destaque fica no fim da frase nos três idiomas.
- **Listas pareadas com dados usam chave, não posição** (`services.items.accounting`), para o TypeScript garantir que todo idioma tem todos os itens.
- **Números do "Sobre" (`stats`) vivem no dicionário inteiros**, porque a escala muda na tradução (1 BI, 1 B, 1000 M).
- **Não traduza** ids de âncora (`#servicos`, `#sobre`...), nomes de clientes, nem dados de `company.ts`.
- **Textos legais:** o português é a versão que vale; `en.ts` e `es.ts` são traduções e levam o campo `notice` dizendo isso. Mudou o texto em português, atualize os outros dois.
- **Links internos:** use `homeHref()` e `legalHref('privacy' | 'terms')`, nunca caminho fixo, para o prefixo do idioma ir junto.
- `applyDocumentMeta()` ajusta `<html lang>`, título, descrição, hreflang e canonical em runtime; o `index.html` sai em português.

Idioma novo: adicione em `locales`, `prefixes`, `dictionaries`, `legalDocs` e `labels` de `src/i18n/index.ts` e crie os dois arquivos. O servidor precisa devolver `index.html` para qualquer caminho (fallback de SPA).

## Blog e API

O blog é o Instagram da Stalo republicado: o backend em `api/` (NestJS 12 + SQLite via Drizzle) sincroniza as publicações pela Graph API, baixa as imagens e serve tudo em `/api/posts`; o site só lê. Detalhes de endpoints, variáveis e token em `api/README.md`.

- **Páginas:** section `Blog` na home (últimas 3), `/blog` (lista com "carregar mais") e `/blog/:slug`, nos três idiomas (`/en/blog`, `/es/blog/...`). As rotas e os hrefs (`blogHref`, `postHref`, `pageHref`) ficam em `src/i18n/index.ts`, como as páginas legais.
- **Home carrega os posts antes de renderizar** (`fetchHomePosts` em `main.tsx`, teto de 1,5 s). Motivo: os pins das sections são medidos na montagem; uma section que aparecesse depois quebraria o scroll. Sem API ou sem posts, a home sobe sem a section e os `z` das demais continuam válidos.
- **Páginas estáticas novas** (`BlogPage`, `PostPage`) seguem o padrão da `LegalPage`: sem GSAP, `PageHeader` + `PageFooter`, `hideBoot()` ao montar (senão o logo de carregamento do `index.html` cobre a tela), `<CookieConsent />` montado, `document.title` próprio.
- **Links de página no menu:** `nav` em `data/content.ts` aceita hrefs que não são âncora (ex.: `/blog`); `Header.tsx` só cria ScrollTrigger e intercepta o clique para hrefs que começam com `#`.
- **Caminhos relativos:** o site chama `/api` e `/media` na própria origem. Em dev o `vite.config.ts` faz proxy para a API na porta 3000; em produção o nginx precisa fazer o mesmo (`location /api` e `location /media` para o Nest).
- **Conteúdo é em português:** as legendas vêm do Instagram como estão. Em `/en` e `/es` a página do post avisa isso (`t.blog.originalLanguage`); a interface em volta é traduzida normalmente.
- **Convenção da legenda** (em `api/src/common/utils/caption.ts`): primeira linha vira título, o resto é o corpo, linhas finais só de hashtags viram etiquetas. Quem escreve o post no Instagram controla como ele aparece no site.
- **Vídeos:** a thumbnail é a capa e o botão de play abre o Instagram. Só com `SYNC_DOWNLOAD_VIDEOS=true` na API (desligado por padrão) o mp4 é baixado e toca no site (`<video>` em `PostPage`, quando `videoUrl` vem preenchido). Cards sem imagem mostram um fundo de marca, não uma caixa vazia.
- **Sem token** a API sobe e serve o que está no banco. Para desenvolver: `cd api && npm run build && npm run seed` grava a publicação de exemplo de `api/seed/`.

## Performance: modo `full` e modo `lite`

O site tem dois modos, decididos em `lib/perf.ts` antes do primeiro render e gravados em `<html data-perf="full|lite">`.

- **`full`:** tudo ligado (liquid glass, vidros com blur, ScrollSmoother, pin, parallax).
- **`lite`:** mesma aparência com versões baratas (sem `backdrop-filter`, scroll nativo, sem pin nem parallax). Entra em máquina fraca.

Como o modo é escolhido: `?perf=lite|full|auto` na URL força ou limpa; depois vale o que estiver guardado no localStorage (só `lite`, por 7 dias); depois a heurística de hardware e `prefers-reduced-motion`; por fim, medição real de fps no carregamento e no primeiro scroll, que pode rebaixar para `lite` com a página aberta. No console: `staloPerf.set('lite' | 'full' | 'auto')`.

Regras ao escrever efeito novo:

- **Efeito preso ao scroll (scrub, parallax, pin, ScrollSmoother) vai dentro de `heavy()`**, chamado dentro do `useGSAP`:
  ```ts
  heavy(() => { gsap.to(q('.bg'), { yPercent: 8, scrollTrigger: { scrub: true, ... } }) })
  ```
  No `lite` ele não roda; se a máquina for rebaixada com a página aberta, o contexto é revertido na hora. Se a section depende do efeito para fazer sentido, passe a versão barata em `heavy(full, { lite, scope })` (ver `Process.tsx`).
- **Animação de entrada (`scrollTrigger: { once: true }`) fica fora do `heavy()`** e roda nos dois modos.
- **Todo `backdrop-filter` novo precisa de override no `lite`** em `index.css` (bloco `:root[data-perf='lite']`): remove o filtro e sobe a opacidade do fundo para o texto continuar legível.
- Em React, leia o modo com `usePerfLite()`; fora, com `perf.lite`.
- **Teste sempre nos dois:** `?perf=full` e `?perf=lite`.

O preloader roda inteiro só na primeira visita da sessão (`sessionStorage`); `?intro` na URL força de novo. Nas outras cargas (troca de idioma, "Voltar ao site") quem cobre a tela até o React montar é o logo de carregamento `#boot`, que está direto no `index.html` e é retirado por `hideBoot()` (`lib/boot.ts`); o desenho dele é uma cópia do `Logo.tsx`. Elementos com `data-intro` nascem com `visibility: hidden` e são revelados pelo GSAP depois do preloader.

O convite para o WhatsApp (`ConsultantInvite.tsx`) é um modal que abre depois de 2 min de aba visível, no máximo uma vez por sessão e nunca para quem já clicou num link do WhatsApp; `?invite` na URL abre em instantes, para testar.

## Vidro e liquid glass

**Vidro comum** são utilities de `index.css`, baseadas em `backdrop-filter: blur`:

| Utility | Onde usar |
|---|---|
| `glass` | sobre fundo escuro (rodapé, células dos depoimentos) |
| `glass-strong` | sobre foto, quando precisa de mais contraste (card da hero) |
| `glass-light` | sobre section clara (cards de números do "Sobre") |

Cada vidro é uma cópia desfocada do fundo recalculada a cada frame. Use em poucos elementos por tela e nunca em lista longa ou em algo que se move com scrub.

**Liquid glass** é outra coisa: além do blur, o fundo é refratado nas bordas, como uma lente. Funciona assim:

1. `useLiquidGlass(ref)` mede o elemento e gera num canvas um mapa de deslocamento (PNG em data URL): na faixa da borda, cada pixel puxa a amostra do fundo para dentro, seguindo a normal de uma cápsula, com força que cai a zero no centro. O mapa é refeito a cada resize.
2. O componente monta um `<filter>` SVG com `feImage` (o mapa) e três `feDisplacementMap`, um por canal de cor com escalas um pouco diferentes, o que dá a franja cromática na borda.
3. Uma camada absoluta atrás do conteúdo aplica `backdrop-filter: url(#id) blur(...)`. Um gradiente por cima faz o reflexo.

O hook devolve `null` quando não dá para usar, e o componente cai no vidro comum (`backdrop-blur`). Isso acontece fora do Chromium (Safari e Firefox não renderizam `backdrop-filter: url()`) e no modo `lite`. A referência é a pílula do `Header.tsx`.

Quando usar:

- **Só em elemento pequeno, fixo e em forma de pílula**, por cima de conteúdo que rola. O mapa assume uma cápsula (raio = metade da altura); num card retangular a distorção sai errada.
- **Um por tela.** É o efeito mais caro do site; hoje só o header usa. Não aplique em cards, seções ou listas.
- **Sempre com fallback:** o layout tem que funcionar com `glass === null`.
- Cada uso precisa de um `id` de filtro próprio.

## Antes de entregar

- `npm run build` passa (é o que pega chave de tradução faltando).
- Texto novo existe nos três idiomas; conferido em `/`, `/en` e `/es`.
- Efeito novo conferido com `?perf=full` e `?perf=lite`, e em largura de celular.
- Nada de texto fixo em componente, link interno com caminho fixo ou `backdrop-filter` sem override no `lite`.
- Mexeu em `api/`: `npm test` e `npm run build` lá dentro passam; segredo novo entrou em `.env.example` (sem valor) e no schema de `config/env.ts`.
