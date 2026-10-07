# Stalo Sistema — guia do agente de back

API do sistema de gestão da Stalo. Ainda **não há código** nesta pasta: este guia define a
arquitetura para o scaffold e vale para tudo que vier depois. O front já existe em `../web` e
consome mocks com exatamente o contrato de `../DOMINIO.md`; o trabalho do back é cumprir esse
contrato.

**Stack decidida:** Node 22 LTS, NestJS 11, TypeScript strict, Prisma 6 + PostgreSQL 16,
class-validator/class-transformer nos DTOs, Passport JWT, argon2, `@nestjs/throttler`, helmet,
`nestjs-pino` (logs JSON), `@nestjs/swagger` (OpenAPI em `/docs`, só fora de produção),
BullMQ + Redis para jobs (e-mail, geração de PDF, lembretes de vencimento), S3 compatível para
documentos. Testes com Jest (unitário) e Supertest (e2e contra Postgres em Docker).

Por que Prisma e não TypeORM: schema declarativo versionado, migrations geradas e revisáveis no PR,
tipos gerados a partir do schema. Por que Postgres: `numeric` para dinheiro, `jsonb` na auditoria,
RLS disponível se o multi-escritório virar real.

```bash
docker compose up -d           # postgres + redis locais
npm run prisma:migrate         # aplica migrations + gera client
npm run prisma:seed            # usuários e clientes de demonstração (mesmos do mock do front)
npm run start:dev              # http://localhost:3000/v1  (Swagger em /docs)
npm run check                  # tsc + eslint + jest — obrigatório antes de entregar
npm run test:e2e
```

## Mapa do código (alvo)

```
prisma/
  schema.prisma             fonte da verdade do banco
  migrations/               geradas por `prisma migrate dev`, nunca editadas à mão depois de aplicadas
  seed.ts                   dados de demonstração (idempotente)
src/
  main.ts                   bootstrap: helmet, cors, cookie-parser, ValidationPipe global, prefixo /v1, swagger
  app.module.ts             importa os módulos de domínio + infra
  config/                   schema zod das variáveis de ambiente (falha no boot se faltar algo)
  common/
    decorators/             @CurrentUser(), @Permissions('clientes:editar'), @Public()
    guards/                 JwtAuthGuard (global), PermissionsGuard
    filters/                HttpExceptionFilter → formato de erro do DOMINIO.md
    interceptors/           AuditInterceptor (escritas), LoggingInterceptor
    pipes/                  ParseUuidPipe etc.
    dto/                    PageQueryDto, PaginatedDto<T>
    utils/                  money (centavos ↔ decimal), dates
  infra/
    prisma/                 PrismaService (+ middleware de soft delete e tenant)
    mail/                   MailService (templates em português)
    storage/                StorageService (S3: upload, URL assinada)
    queue/                  BullMQ: filas e processadores
    whatsapp/               cliente da Meta Cloud API (enviar texto/mídia/template, baixar mídia)
    bancos/                 interface ProvedorBancario + implementação Pluggy (trocável)
    realtime/               gateway Socket.IO autenticado por access token
  modules/
    auth/                   login, refresh (rotação), logout, esqueci/redefinir senha, sessões
      auth.controller.ts
      auth.service.ts
      strategies/jwt.strategy.ts
      dto/
      permissions.ts        espelho da tabela do DOMINIO.md (mesmo nome do arquivo do front)
    usuarios/
    clientes/
    obrigacoes/
    financeiro/
    documentos/
    dashboard/
    auditoria/
    atendimento/            canais, conversas, mensagens, templates, respostas rápidas
    bancos/                 vínculos, consentimentos, contas, transações, conciliação
    webhooks/               controllers públicos dos webhooks (validam assinatura e enfileiram)
test/
  e2e/                      um arquivo por módulo, sobe o app contra o Postgres do docker
```

## Regras de arquitetura

1. **Módulo por domínio**, sempre com `controller` (HTTP), `service` (regra), `repository`
   (acesso ao Prisma) e `dto/`. Controller não toca no Prisma; service não sabe de HTTP (não
   lança `HttpException`: lança exceções de domínio que o filter traduz).
2. **DTO em toda entrada.** `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true,
   transform: true })` global. Nada entra sem validação, mesmo que o front valide.
3. **Resposta tipada.** Toda rota devolve um DTO de saída (classe com `@ApiProperty`), nunca a
   entidade do Prisma direto (vaza campo: hash de senha, `excluidoEm`...).
4. **Lista = paginada**, com `PageQueryDto` (`page`, `pageSize` ≤ 100, `search`, `sort`, `order`)
   e resposta `{ items, page, pageSize, total }`. Filtro extra é query param com o nome do campo.
5. **Soft delete** por padrão (`excluidoEm`), com middleware do Prisma filtrando automaticamente.
   Delete físico só em `sessoes` e tokens expirados (job).
6. **Transação** em toda operação que escreve em mais de uma tabela (`prisma.$transaction`).
7. **Dinheiro:** coluna `BigInt`/`Integer` em centavos no banco; DTO de saída converte para número
   decimal; DTO de entrada aceita decimal e converte para centavos. Nunca `float`.
8. **Escopo por perfil `cliente`:** todo repository de recurso que pertence a cliente recebe o
   usuário atual e aplica `where: { clienteId: { in: usuario.clienteIds } }` quando o perfil é
   `cliente`. É regra do repository, não do controller, para não esquecer em rota nova.
9. **Tenant:** toda tabela de domínio tem `escritorioId`. Hoje só existe um escritório; o filtro já
   entra no middleware para o multi-escritório não exigir reescrita.
10. **Jobs** (e-mail, PDF, lembrete) nunca rodam dentro da request: vão para a fila.
11. **Webhook** (Meta, agregador bancário): controller público valida a assinatura, grava o evento
    bruto em `webhook_eventos` (dedupe pelo id externo) e enfileira; responde 200 em menos de 1 s.
    O processamento de verdade é um processador BullMQ. Webhook nunca chama API externa de volta
    dentro da request.
12. **Integração externa atrás de interface** (`ProvedorBancario`, `ProvedorMensagens`), com
    implementação real e uma fake para testes. Service de domínio nunca importa o SDK direto.
13. **Tempo real** só para o que muda enquanto a tela está aberta (atendimento). O gateway emite
    para a sala do escritório/canal; o front refaz a query, não confia só no payload do evento.

## Autenticação (implementa o DOMINIO.md)

- `POST /auth/login`: valida e-mail/senha (argon2id), verifica bloqueio (5 falhas/15 min),
  cria `sessao` (família nova), devolve `{ user, accessToken }` e seta cookie
  `refresh_token` (`httpOnly; Secure; SameSite=Strict; Path=/v1/auth`). `remember` muda a validade
  do refresh (7 → 30 dias).
- `POST /auth/refresh`: lê o cookie, acha a sessão pelo **hash** (sha256) do token, confere
  validade e revogação. Rotaciona: marca a atual como usada e cria outra na mesma família.
  Token já usado = reuso → revoga a família inteira e responde 401 `auth/no-session`.
- `POST /auth/logout`: revoga a sessão do cookie e limpa o cookie.
- `GET /auth/me`, `GET /auth/sessoes`, `DELETE /auth/sessoes/:id`, `DELETE /auth/sessoes` (as
  outras).
- Access token: JWT 15 min com `sub`, `role`, `escritorioId`, `clienteIds` (só perfil cliente),
  `sid` (id da sessão, para revogação imediata quando necessário).
- `JwtAuthGuard` global; rotas públicas marcadas com `@Public()`. `PermissionsGuard` lê
  `@Permissions(...)` e consulta `permissions.ts`. Rota sem `@Permissions` em controller de domínio
  é erro: o lint customizado (ou o code review) barra.
- Senha: argon2id (memória 64 MB, 3 iterações). Troca de senha revoga as outras sessões.
- Reset: token aleatório, hash no banco, 30 min, uso único, e-mail pela fila. A resposta de
  "esqueci a senha" é sempre 204, exista o e-mail ou não.

## Banco (Prisma)

- Nomes de tabela e coluna em **português, snake_case** no banco (`@@map`/`@map`), campos do
  model em camelCase (`razaoSocial` → `razao_social`).
- Todo model: `id String @id @default(uuid(7))`, `criadoEm`, `atualizadoEm @updatedAt`,
  `excluidoEm?`, `escritorioId`. Enums do Prisma com os mesmos valores do contrato (minúsculos).
- Índice em toda FK e em todo campo que entra em filtro ou ordenação de lista (`cnpj` único por
  escritório, `vencimento`, `status`, `competencia`).
- `auditoria`: `usuarioId`, `acao` (`criar|editar|excluir|login|...`), `recurso`, `recursoId`,
  `antes jsonb`, `depois jsonb`, `ip`, `userAgent`, `criadoEm`. Só insert; sem update/delete.
- Migration: `prisma migrate dev --name <o-que-muda>` em português kebab-case
  (`adiciona-sessoes`, `indice-obrigacoes-vencimento`). Migration destrutiva (drop de coluna com
  dado) é em duas etapas: primeiro parar de usar, depois remover.
- Seed idempotente (`upsert`), com os **mesmos** usuários/clientes de `../web/src/mocks` para o
  front funcionar igual com e sem mock. Senha dos usuários de seed: `123456` (só fora de produção;
  o seed se recusa a rodar com `NODE_ENV=production`).

## Segurança

- `helmet()`, CORS com lista explícita de origens (`CORS_ORIGINS`), `credentials: true`.
- `ThrottlerGuard` global: 100 req/min por IP; `/auth/*` com 10/min via `@Throttle`.
- Logs JSON (pino) com `requestId`; **nunca** logar senha, token, cookie, corpo de `/auth/*`.
- Erros 500 não vazam stack para o cliente (o filter devolve `internal/error` e loga o detalhe).
- Upload: `multer` em memória com limite 20 MB, tipo real por `file-type`, nome gerado (uuid),
  salvo no S3 com `ContentDisposition: attachment`; download por URL assinada de 5 min.
- Headers de resposta sem versão do framework. `GET /health` público e sem dado sensível.
- Variáveis obrigatórias validadas no boot (`config/env.ts` com zod): `DATABASE_URL`, `REDIS_URL`,
  `JWT_SECRET` (≥ 32 chars) ou par de chaves, `COOKIE_DOMAIN`, `CORS_ORIGINS`, `S3_*`, `MAIL_*`.
  Faltou → o processo não sobe.
- `.env` no `.gitignore`; `.env.example` com todas as chaves e valores de exemplo.

## Convenções de código

- Arquivos: `clientes.controller.ts`, `clientes.service.ts`, `clientes.repository.ts`,
  `dto/criar-cliente.dto.ts`, `dto/cliente.dto.ts` (saída). Classes em PascalCase com sufixo.
- Comentários e mensagens em português; explicam o porquê. Nomes de domínio em português;
  termos técnicos em inglês onde é o padrão do ecossistema (`service`, `guard`, `dto`).
- Função de service: um verbo claro (`criar`, `listar`, `buscarPorId`, `entregar`). Sem `handle`,
  `process`, `manage`.
- Exceções de domínio em `common/exceptions`: `NaoEncontrado`, `Conflito`, `SemPermissao`,
  `Validacao` → mapeadas para 404/409/403/422 com os `code`s do contrato.
- Sem lógica em controller além de: ler DTO, chamar service, devolver DTO.
- Sem `any`. Sem `// eslint-disable` sem justificativa na linha.

## Testes

- Unitário (Jest) para service com repository mockado: regras de negócio (rotação de refresh,
  bloqueio de login, escopo do perfil cliente, cálculo de status "atrasada").
- e2e (Supertest) por módulo contra Postgres real (docker): autenticação, permissões (um caso de
  403 por rota protegida), paginação, formato de erro.
- Fixture de auth nos e2e: helper que loga como cada perfil e devolve o cookie + bearer.
- Cobertura mínima: 80% em `modules/auth` e `common/guards`.

## Antes de entregar

- [ ] `npm run check` e `npm run test:e2e` passam.
- [ ] Rota nova tem `@Permissions`, DTO de entrada e DTO de saída, está no Swagger e na tabela
      de endpoints de `../DOMINIO.md`.
- [ ] Escrita nova gera auditoria e está em transação se toca mais de uma tabela.
- [ ] Recurso que pertence a cliente respeita o escopo do perfil `cliente` (teste e2e cobrindo).
- [ ] Migration revisada (sem drop implícito); seed continua rodando.
- [ ] `.env.example` atualizado se entrou variável nova.
- [ ] Nada sensível em log, URL ou resposta de erro.
