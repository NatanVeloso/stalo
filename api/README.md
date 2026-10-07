# Stalo API

Backend do site Stalo em **NestJS 12 + SQLite (Drizzle)**. Faz uma coisa: sincroniza as publicações do Instagram da Stalo e as serve como blog para o site (`src/` na raiz do repositório).

```bash
cp .env.example .env   # preencha (ver comentários no arquivo)
npm install
npm run start:dev      # http://localhost:3000/api
npm test               # unitários (vitest)
npm run build && npm run start:prod
```

Sem `INSTAGRAM_ACCESS_TOKEN` a API sobe normalmente, só não sincroniza. Para ter conteúdo em desenvolvimento: `npm run build && npm run seed` grava a publicação de exemplo de `seed/sample-post.json` (aceita outro arquivo como argumento, no formato da Graph API).

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | estado, total de posts, última sync |
| GET | `/api/posts?limit=12&before=<ISO>` | lista paginada por cursor de data (`nextCursor`) |
| GET | `/api/posts/:slug` | publicação completa, com as mídias do carrossel |
| POST | `/api/sync` | força uma sincronização; exige header `x-api-key` = `ADMIN_API_KEY` |
| GET | `/media/<postId>/<mediaId>.<ext>` | imagens baixadas (cache de 30 dias) |

Tudo em `/api` tem limite de 60 requisições/minuto por IP; `/api/sync`, 5/minuto.

## Como a sincronização funciona

1. Roda no cron (`SYNC_CRON`, padrão a cada hora), uma vez ao subir (`SYNC_ON_BOOT`) e sob demanda (`POST /api/sync` ou `npm run sync`). Nunca duas ao mesmo tempo.
2. Renova o token se faltar menos de 10 dias para vencer (tokens de longa duração valem 60 dias). O token renovado é guardado no banco cifrado com `TOKEN_ENCRYPTION_KEY` e passa a valer no lugar do `.env`.
3. Busca as `SYNC_MAX_POSTS` publicações mais recentes (`/me/media`), baixa as mídias para `MEDIA_DIR` (as URLs da Meta expiram em poucos dias) e grava/atualiza cada post. Vídeos: a thumbnail vira a capa e, com `SYNC_DOWNLOAD_VIDEOS=true` (desligado por padrão), o mp4 é baixado em streaming até `SYNC_VIDEO_MAX_MB` e toca no próprio site. Por padrão só a thumbnail é baixada e o vídeo abre no Instagram.
4. Publicações apagadas no Instagram dentro dessa janela são marcadas como removidas (somem do site, ficam no banco). Se alguma publicação falhou na leitura, nada é marcado como removido naquela rodada.

A legenda vira post assim (`src/common/utils/caption.ts`): primeira linha = título; o resto = corpo; linhas finais só de hashtags saem do corpo e viram etiquetas. O slug é `titulo-em-minusculas-<fim do id>`.

## Segurança

- Variáveis de ambiente validadas na subida (`src/config/env.ts`); segredos nunca vão para o git nem para os logs (`redact`).
- `helmet`, CORS por lista de origens (desligado em produção, onde o nginx serve site e API na mesma origem), `ValidationPipe` com `whitelist` + `forbidNonWhitelisted`, limite de requisições por IP.
- Endpoint administrativo protegido por chave comparada em tempo constante; sem `ADMIN_API_KEY` ele nem existe (403).
- Downloads só de `https://*.cdninstagram.com` e `https://*.fbcdn.net`, só imagens, até 25 MB, gravados com nome derivado do id do Instagram (nunca da entrada do usuário) e escrita atômica.
- Slugs validados por regex antes de chegar ao banco; consultas via Drizzle (parametrizadas).

## Obter o token do Instagram

Uma vez, por quem administra a conta @staloconsulting (conta profissional, já é):

1. Em <https://developers.facebook.com/apps> criar um app do tipo **Empresa** e adicionar o produto **Instagram** → *API setup with Instagram login*.
2. Em **Gerar tokens de acesso**, adicionar a conta @staloconsulting e fazer login para autorizar (permissão `instagram_business_basic`, só leitura).
3. Copiar o token gerado (já é de longa duração, 60 dias) para `INSTAGRAM_ACCESS_TOKEN` no `.env` do servidor e reiniciar a API. A partir daí a renovação é automática.

Se a senha da conta mudar ou o app for desconectado, o token morre: a sync passa a logar erro de autenticação e o site continua mostrando o último conteúdo. Repetir o passo 2.

## Estrutura

```
src/
  main.ts                      bootstrap: helmet, CORS, prefixo /api, validação
  app.module.ts                módulos + throttler + arquivos estáticos de /media
  config/env.ts                schema (zod) das variáveis de ambiente
  common/                      guard de API key, pipe de slug, utils (caption, slug, crypto, redact)
  database/                    SQLite + Drizzle: schema, migrações (drizzle/), settings
  modules/
    instagram/                 cliente da Graph API e guarda/renovação do token
    media/                     download e armazenamento das imagens
    posts/                     leitura pública: repository, service, controller, DTOs
    sync/                      a sincronização em si (cron + endpoint)
    health/
  cli/                         `npm run sync` e `npm run seed`
```

Mudou o schema? `npm run db:generate` cria a migração em `drizzle/`; ela roda sozinha na próxima subida.
