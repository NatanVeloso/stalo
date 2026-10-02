# Stalo — Landing page

Landing page da Stalo Consulting em **React 19 + Vite 8 + Tailwind v4 + GSAP 3.15** (todos os plugins do GSAP são gratuitos via npm desde a 3.13 — não precisa do zip).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Estrutura

```
src/
  App.tsx               ScrollSmoother + transição "cartões empilhados" entre sections
  lib/gsap.ts           registro dos plugins + easings customizados
  lib/reveal.ts         helper de título (SplitText com máscara por linha)
  data/content.ts       TEXTOS, links, telefone/e-mail e URLs das imagens — edite aqui
  components/
    Preloader.tsx       cortina de abertura (asterisco monta, barra carrega, cortina sobe)
    Header.tsx          nav pill fixa, link ativo por section, menu mobile, scrollTo suave
    Hero.tsx            intro com SplitText + parallax da foto
    Marquee.tsx         faixa infinita que acelera/inverte com a velocidade do scroll
    Services.tsx        cards com tilt 3D + holofote no hover, blobs/anéis em parallax
    About.tsx           foto com clip-path reveal, linha de crescimento (DrawSVG)
    Process.tsx         linha desenhada + ponto percorrendo o caminho (MotionPath) no scroll
    Contact.tsx         cartão que "assenta" no scroll, form com estado de sucesso
    Footer.tsx
    StackSection.tsx    wrapper das sections empilháveis
    Magnetic.tsx        botão magnético (segue o cursor)
    Logo.tsx            logo inline (SVG) para animar as partes
```

## Como funciona a transição entre sections

Cada `StackSection` recebe um `z` crescente. Em `App.tsx`, quando o **fundo** de uma section encosta no fundo do viewport ela é fixada (`pin`, sem `pinSpacing`) e a próxima desliza por cima como um cartão com cantos arredondados; enquanto isso a anterior encolhe (`scale .92`) e escurece (`data-stack-shade`).
Toda section precisa ter **pelo menos 100vh** (já garantido pelo `min-h-screen` no `StackSection`) — se for mais baixa, duas sections ficam presas ao mesmo tempo.

Com `prefers-reduced-motion: reduce` o smoother e os pins são desligados e a página vira um scroll normal.

## O que falta para produção

- **Form de contato**: hoje só troca para o painel "Mensagem enviada" (`Contact.tsx` → `submit`). Ligue em um backend/Formspree/EmailJS.
- **Fotos**: as três são placeholders do Unsplash em `data/content.ts` (`images`). A do "Sobre" está marcada como provisória.
- **Links**: Portal do Cliente, FAQ, redes sociais, Política e Termos estão com `href="#"` em `data/content.ts` e `Footer.tsx`.
