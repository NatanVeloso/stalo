# Stalo Sistema

Sistema de gestão para o escritório de contabilidade Stalo. Duas aplicações:

- `web/` — front (React 19 + Vite + TypeScript + Tailwind v4). Guia: `web/AGENTE-FRONT.md`.
- `api/` — back (NestJS + Prisma + PostgreSQL). Guia: `api/AGENTE-BACK.md`.

Antes de mexer em qualquer um, leia o contrato compartilhado:

@DOMINIO.md

Regras que valem para os dois lados:

- Nomes de domínio em português (cliente, obrigação, lançamento), iguais no front, no back e no banco.
- Mudança de contrato (rota, campo, permissão, enum) atualiza `DOMINIO.md` e os dois projetos no mesmo PR.
- Nunca entregar sem rodar o `npm run check` do projeto tocado (typecheck + lint + testes).
- O site institucional na raiz do repositório (`../`) é outro projeto, com guia próprio (`../sistema.md`). Não misturar código entre eles.
