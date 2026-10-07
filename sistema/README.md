# Stalo Sistema

Sistema de gestão do escritório de contabilidade Stalo: clientes, obrigações fiscais,
financeiro, documentos e usuários com perfis.

| Pasta | O que é | Estado |
|---|---|---|
| `web/` | Front (React 19 + Vite + Tailwind v4), liquid glass, claro/escuro, pt-BR/en/es | Protótipo navegável com dados fake: dashboard, clientes, obrigações, atendimento (WhatsApp por setor), financeiro, usuários, configurações |
| `api/` | Back (NestJS + Prisma + PostgreSQL), JWT + refresh token com rotação, RBAC | Só o guia de arquitetura; scaffold é o próximo passo |

Documentos para pessoas e agentes:

- `DOMINIO.md` — contrato compartilhado: perfis e permissões, formato da API, autenticação, vocabulário.
- `web/AGENTE-FRONT.md` — padrões do front (estrutura, componentização, tradução, tema, auth).
- `api/AGENTE-BACK.md` — padrões do back (módulos, DTOs, Prisma, segurança, testes).

## Rodar o protótipo

```bash
cd web
npm install
npm run dev      # http://localhost:5174
```

Sem `VITE_API_URL` o app roda em modo demonstração (dados fake, sem rede). Na tela de login há
atalhos para entrar como Administrador, Contador, Assistente ou Cliente; a senha é `123456`.
Tema e idioma ficam na barra superior e em Configurações.

```bash
npm run check    # typecheck + lint + testes
npm run build
```
