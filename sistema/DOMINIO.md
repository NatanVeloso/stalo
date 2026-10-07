# Stalo Sistema — domínio e contrato (front + back)

Sistema de gestão de um escritório de contabilidade (a Stalo Consulting). Este arquivo é a
**fonte única** do que front e back precisam concordar: perfis, permissões, formato da API,
autenticação e vocabulário. Mudou algo aqui, muda nos dois lados no mesmo PR.

Guias específicos: `web/AGENTE-FRONT.md` e `api/AGENTE-BACK.md`.

## Vocabulário (nomes em português, iguais no código dos dois lados)

| Termo | O que é |
|---|---|
| **Escritório** | A Stalo. Tenant raiz: todo dado pertence a um escritório (preparado para multi-escritório, mas hoje só um). |
| **Usuário** | Quem faz login. Tem um `role` (perfil). Usuário com perfil `cliente` está ligado a um ou mais **Clientes**. |
| **Cliente** | Empresa atendida pelo escritório (razão social, CNPJ, regime tributário, responsável, honorário). |
| **Obrigação** | Entrega fiscal/contábil/trabalhista de um cliente numa competência (DAS, DCTF, eSocial, folha...). Tem vencimento e status. |
| **Competência** | Mês de referência da obrigação, `YYYY-MM`. |
| **Lançamento** | Movimento financeiro do escritório: receita (honorário, consultoria...) ou despesa. |
| **Documento** | Arquivo anexado a um cliente/obrigação (guia, extrato, contrato). Vai para S3 (ou compatível). |
| **Auditoria** | Registro imutável de quem fez o quê, quando, em qual registro. |
| **Conversa** | Atendimento via WhatsApp com um contato (telefone). Pertence a um **Canal** e pode ter um atendente. Liga-se a um Cliente quando o telefone é reconhecido. |
| **Canal** | Fila de atendimento (Fiscal, Departamento Pessoal, Financeiro, Comercial...). Define quem recebe as conversas e o horário de atendimento. |
| **Mensagem** | Item de uma conversa: texto, mídia, template ou nota interna (nota não vai para o WhatsApp). |
| **Template** | Mensagem pré-aprovada pela Meta, única forma de iniciar contato fora da janela de 24 h. |
| **Conta bancária** | Conta de um Cliente vinculada via Open Finance (agregador). Guarda saldo e **Transações** sincronizadas. Nunca guarda credencial do banco. |
| **Transação** | Linha do extrato de uma conta bancária. Pode ser **conciliada** com um Lançamento. |
| **Consentimento** | Autorização LGPD/Open Finance dada pelo cliente para ler a conta; tem validade (12 meses) e pode ser revogada. |

Valores monetários são **sempre BRL**, armazenados como inteiro em centavos no banco e
trafegados como número decimal (`2400.5`) no JSON. Datas só-dia são `YYYY-MM-DD`; instantes
são ISO 8601 em UTC (`2026-10-07T14:03:00Z`). O front formata conforme o idioma.

## Perfis e permissões

Quatro perfis fixos. Permissão é `recurso:acao`. A tabela abaixo é espelhada em
`web/src/shared/auth/permissions.ts` e em `api/src/auth/permissions.ts`; **o front só esconde,
quem garante é a API.**

| Permissão | admin | contador | assistente | cliente |
|---|:-:|:-:|:-:|:-:|
| `dashboard:ver` | ✓ | ✓ | ✓ | ✓ (só os próprios dados) |
| `clientes:ver` | ✓ | ✓ | ✓ | – |
| `clientes:editar` | ✓ | ✓ | – | – |
| `obrigacoes:ver` | ✓ | ✓ | ✓ | ✓ (só as próprias) |
| `obrigacoes:editar` | ✓ | ✓ | ✓ | – |
| `financeiro:ver` | ✓ | ✓ | – | – |
| `financeiro:editar` | ✓ | – | – | – |
| `usuarios:gerenciar` | ✓ | – | – | – |
| `configuracoes:ver` | ✓ | ✓ | ✓ | ✓ |
| `atendimento:ver` | ✓ | ✓ | ✓ | – |
| `atendimento:responder` | ✓ | ✓ | ✓ | – |
| `atendimento:gerenciar` (canais, templates, horários) | ✓ | – | – | – |
| `bancos:ver` (saldo, extrato) | ✓ | ✓ | – | ✓ (só as próprias contas) |
| `bancos:vincular` (conectar/revogar conta) | ✓ | – | – | ✓ (só as próprias) |
| `bancos:conciliar` | ✓ | ✓ | – | – |

Regras:

- Perfil `cliente` enxerga **apenas** registros dos clientes aos quais está vinculado. Isso é um
  filtro obrigatório na API (escopo), não uma permissão.
- Permissão nova: adicionar nesta tabela, nos dois arquivos de permissões e no guard da rota.
- Não existe "super admin" fora do perfil `admin`. Operações de infraestrutura ficam fora do app.

## Autenticação

- **Access token**: JWT assinado (RS256 ou HS256 com segredo forte), validade **15 min**, enviado
  em `Authorization: Bearer`. O front guarda **só em memória**.
- **Refresh token**: opaco (random 256 bits), validade **7 dias** (30 com "manter conectado"),
  guardado **hasheado** no banco (tabela `sessoes`) e enviado ao navegador em cookie
  `httpOnly; Secure; SameSite=Strict; Path=/auth`. Nunca aparece em JSON.
- **Rotação**: todo `POST /auth/refresh` invalida o refresh usado e emite outro. Reuso de um
  refresh já rotacionado = roubo provável → revoga **toda a família** de sessões daquele login.
- **Senha**: argon2id. Mínimo 8 caracteres. Reset por e-mail com token de uso único (30 min).
- **Sessões**: o usuário vê e encerra as próprias sessões em Configurações → Segurança.
- **Bloqueio**: 5 falhas de login em 15 min bloqueia por 15 min (por e-mail + IP).
- Todas as rotas são autenticadas, exceto `POST /auth/login`, `POST /auth/refresh`,
  `POST /auth/esqueci-senha`, `POST /auth/redefinir-senha` e `GET /health`.

Fluxo no front (`web/src/shared/lib/http.ts`): 401 → tenta um refresh (single-flight) → repete a
chamada → se falhar, desloga.

## Contrato da API

Base: `VITE_API_URL` no front, ex.: `https://api.stalo.com.br/v1`. Prefixo `/v1` desde o início.

**Recursos em português, plural, kebab-case:** `/clientes`, `/obrigacoes`, `/lancamentos`,
`/usuarios`, `/documentos`, `/dashboard/resumo`.

**Verbos:** `GET` lista/detalhe, `POST` cria, `PATCH` edita parcialmente, `DELETE` remove
(soft delete por padrão). Ações que não são CRUD viram sub-recurso com verbo no nome:
`PATCH /obrigacoes/:id/entregar`, `POST /usuarios/:id/reenviar-convite`.

**Lista paginada** (toda lista, sem exceção):

```
GET /clientes?page=1&pageSize=20&search=supri&sort=razaoSocial&order=asc&regime=simples
→ { "items": [...], "page": 1, "pageSize": 20, "total": 137 }
```

`pageSize` máximo 100. Filtros são query params com o nome do campo.

**Erros** sempre neste formato, com `code` estável (o front traduz pelo `code`, não pela
`message`):

```json
{ "status": 422, "code": "validation/invalid-body", "message": "CNPJ inválido", "details": { "cnpj": ["invalid"] } }
```

Códigos: `auth/invalid-credentials`, `auth/locked`, `auth/no-session`, `auth/forbidden`,
`validation/invalid-body`, `resource/not-found`, `resource/conflict`, `rate-limit/exceeded`,
`internal/error`.

**Status HTTP:** 200 ok, 201 criado, 204 sem corpo, 400 malformado, 401 sem sessão, 403 sem
permissão, 404, 409 conflito (CNPJ duplicado), 422 validação, 429 rate limit, 500.

**Convenções de campo:** `id` (uuid v7), `criadoEm`, `atualizadoEm`, `excluidoEm` (soft delete)
em todo recurso. Enums em minúsculas (`simples`, `presumido`, `real`, `mei`; `pendente`,
`entregue`, `atrasada`; `pago`, `emAberto`, `vencido`). CNPJ trafega só dígitos (14).

**Idioma:** a API não traduz. Mensagens de erro são em português para log; o front mostra
texto do próprio dicionário a partir do `code`.

## Atendimento via WhatsApp

Decisões:

- **Provedor: Meta WhatsApp Business Platform (Cloud API)**, direto, com o número da empresa.
  Sem intermediário (Z-API, Twilio, 360dialog) para não pagar duas vezes nem depender de terceiro
  no dado do cliente. Exige conta Meta Business verificada e o número migrado para a API (ele deixa
  de funcionar no app WhatsApp Business do celular).
- **Um número, vários canais.** A Meta entrega tudo num webhook; o sistema roteia por canal
  (menu inicial automático "1 Fiscal, 2 DP, 3 Financeiro", ou pelo cliente reconhecido e seu
  responsável). Canal tem horário de atendimento e mensagem fora do horário.
- **Janela de 24 h.** Depois da última mensagem do contato, só dá para responder livremente por
  24 h; fora disso só **template** aprovado. O back valida isso antes de enviar e o front mostra
  o tempo restante na conversa.
- **Tempo real:** eventos (mensagem nova, status entregue/lido, atribuição) chegam ao front por
  WebSocket (Socket.IO, namespace `/atendimento`, autenticado pelo access token). O front **não**
  faz polling.
- **Mídia:** o webhook traz só o id; o back baixa da Meta, guarda no S3 e serve por URL assinada.
  Áudio, imagem, documento e vídeo até 20 MB.
- **Estados da conversa:** `aberta` → `em_atendimento` (tem atendente) → `aguardando_cliente` →
  `resolvida`. Resolvida reabre sozinha se o contato mandar mensagem. Histórico nunca é apagado.
- **Fluxo de inbox:** lista por canal/estado/atendente, busca, atribuir, transferir de canal,
  nota interna, respostas rápidas (`/assinatura`), tags, vincular contato a cliente.
- **Webhook:** `POST /webhooks/whatsapp` público, verificado pela assinatura `X-Hub-Signature-256`
  (segredo do app) e pelo `verify_token` no handshake GET. Idempotente: a Meta reenvia; dedupe pelo
  `wamid`. Responde 200 em < 1 s e processa na fila.
- **Fase 1 do atendimento:** receber e responder texto/mídia, canais, atribuição, tempo real.
  Depois: templates com envio em massa (lembrete de vencimento, cobrança), chatbot de triagem.

## Contas bancárias (Open Finance)

Decisões:

- **Agregador, não integração direta.** Ler conta via Open Finance Brasil exige ser instituição
  autorizada pelo BCB. O sistema usa um **agregador regulado** (primeira opção: **Pluggy**;
  alternativa: Belvo). Ele faz o consentimento com o banco e expõe contas, saldos e transações
  numa API única. O código fica atrás de uma interface `ProvedorBancario` para trocar de agregador
  sem reescrever o módulo.
- **O sistema nunca vê credencial bancária.** O cliente vincula a conta pelo widget do agregador
  (Pluggy Connect) aberto no front; o back só recebe o `itemId` do vínculo.
- **Quem vincula:** o perfil `cliente` vincula contas da própria empresa; `admin` pode vincular em
  nome do cliente numa reunião. Contador só lê e concilia.
- **Sincronização:** webhook do agregador (`item/updated`, `transactions/created`) + job diário de
  segurança. Transações são imutáveis depois de gravadas (correção vem como nova transação do banco).
  Saldo é snapshot com data/hora.
- **Consentimento:** registrado em `consentimentos` (quem, quando, finalidade, validade, IP).
  Open Finance expira em 12 meses: o sistema avisa 30 dias antes e pede renovação. Revogar apaga o
  vínculo no agregador e marca a conta como `desvinculada` (transações já importadas ficam, por
  obrigação contábil, mas não entram mais).
- **Conciliação:** sugestão automática (valor + data ± 3 dias + CNPJ/descrição) entre transação e
  lançamento; confirmação manual; transação sem par vira lançamento com um clique. Tudo auditado.
- **LGPD:** dado bancário é dado pessoal sensível na prática: acesso restrito às permissões
  `bancos:*`, log de todo acesso a extrato, retenção definida (5 anos, prazo fiscal), exportação e
  exclusão a pedido do titular (exceto o que a lei obriga a guardar).
- **Fase 1 dos bancos:** vincular conta, ver saldo e extrato com filtros, exportar CSV/OFX. Depois:
  conciliação com lançamentos, categorização automática, alertas (saldo baixo, débito desconhecido).

## Endpoints da fase 2 (atendimento e bancos)

| Método | Rota | Permissão |
|---|---|---|
| GET/POST | `/webhooks/whatsapp` | pública (assinatura Meta) |
| POST | `/webhooks/bancos` | pública (assinatura do agregador) |
| GET | `/atendimento/canais` · POST/PATCH/DELETE `/atendimento/canais[/:id]` | `atendimento:ver` · `atendimento:gerenciar` |
| GET | `/atendimento/conversas?canal=&estado=&atendente=&search=` | `atendimento:ver` |
| GET | `/atendimento/conversas/:id/mensagens` (paginada, mais recentes primeiro) | `atendimento:ver` |
| POST | `/atendimento/conversas/:id/mensagens` `{ tipo: texto|midia|template|nota, ... }` | `atendimento:responder` |
| PATCH | `/atendimento/conversas/:id/atribuir`, `/transferir`, `/resolver`, `/vincular-cliente` | `atendimento:responder` |
| GET | `/atendimento/templates`, `/atendimento/respostas-rapidas` | `atendimento:ver` |
| WS | `/atendimento` (eventos `mensagem`, `status`, `conversa`) | `atendimento:ver` |
| POST | `/bancos/vinculos/token` → token do widget do agregador | `bancos:vincular` |
| POST | `/bancos/vinculos` `{ clienteId, itemId }` | `bancos:vincular` |
| DELETE | `/bancos/vinculos/:id` (revoga consentimento) | `bancos:vincular` |
| GET | `/bancos/contas?clienteId=` (saldo atual por conta) | `bancos:ver` |
| GET | `/bancos/contas/:id/transacoes?de=&ate=&tipo=&search=` (paginada) | `bancos:ver` |
| GET | `/bancos/contas/:id/transacoes/exportar?formato=csv|ofx` | `bancos:ver` |
| POST | `/bancos/transacoes/:id/conciliar` `{ lancamentoId }` · DELETE idem | `bancos:conciliar` |

Variáveis de ambiente novas no back: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
`WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `PLUGGY_CLIENT_ID`, `PLUGGY_CLIENT_SECRET`,
`PLUGGY_WEBHOOK_SECRET`.

## Endpoints da fase 1 (os que o protótipo já consome)

| Método | Rota | Permissão |
|---|---|---|
| POST | `/auth/login` `{ email, password, remember }` → `{ user, accessToken }` + cookie | pública |
| POST | `/auth/refresh` → `{ user, accessToken }` + cookie novo | cookie |
| POST | `/auth/logout` | autenticada |
| GET | `/auth/me` | autenticada |
| GET | `/dashboard/resumo` | `dashboard:ver` |
| GET | `/dashboard/receita-mensal` | `financeiro:ver` |
| GET | `/dashboard/vencimentos` | `obrigacoes:ver` |
| GET | `/dashboard/atividades` | `dashboard:ver` |
| GET | `/clientes`, `/clientes/:id` | `clientes:ver` |
| POST/PATCH/DELETE | `/clientes[/:id]` | `clientes:editar` |
| GET | `/obrigacoes` | `obrigacoes:ver` |
| PATCH | `/obrigacoes/:id/entregar` | `obrigacoes:editar` |
| GET | `/financeiro/resumo`, `/financeiro/lancamentos` | `financeiro:ver` |
| GET | `/usuarios` | `usuarios:gerenciar` |

Os tipos TypeScript de cada recurso estão em `web/src/features/<modulo>/types.ts`. Enquanto o
back não gera OpenAPI, esses arquivos são o contrato; depois o back publica `/docs` (Swagger) e o
front valida os tipos contra ele.

## Segurança (checklist dos dois lados)

- Nada sensível em URL (query string vai para log). Token só em header/cookie.
- Toda entrada validada no back (DTO) mesmo que o front já valide.
- Upload: tipo verificado pelo conteúdo (magic bytes), tamanho máximo 20 MB, nome gerado pelo
  servidor, URL assinada com expiração para download.
- Auditoria em toda escrita (quem, quando, o quê, antes/depois).
- Rate limit global (100 req/min por IP) e mais restrito em `/auth/*` (10/min).
- CORS só para as origens do front. Helmet. Sem `x-powered-by`.
- Segredos só em variáveis de ambiente; `.env` nunca commitado; `.env.example` sempre atualizado.
- Dependência nova: justificar no PR. Rodar `npm audit` antes de release.

## Convenções de repositório

- Monorepo simples: `sistema/web` e `sistema/api`, cada um com seu `package.json`.
- Commits em português, imperativo, escopo no início: `web: drawer de cliente`,
  `api: rotação de refresh token`, `dominio: permissão financeiro:editar`.
- Branch por feature a partir de `main`; PR com descrição do que muda no contrato, se mudar.
- Comentários no código em português, explicando o **porquê** (restrição, armadilha), não o quê.
