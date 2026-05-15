<div align="center">

# my-finances

**Seu controle financeiro pessoal, do jeito simples — saldo, metas e categorias num dashboard que cabe na sua semana.**

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/vue](https://img.shields.io/badge/shadcn--vue-UI-000000)](https://www.shadcn-vue.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)

</div>

---

## Sobre

O **my-finances** nasceu pra responder uma pergunta que todo mundo já fez no fim do mês: _"para onde foi o meu dinheiro?"_.

É um app web pensado para ser **rápido, bonito e sem fricção**. Você cria categorias, registra suas despesas e o dashboard mostra o resto: saldo do mês, evolução do gasto diário, comparação com o mês anterior, distribuição por categoria e quanto falta pra estourar (ou bater) sua meta de gastos.

Sem planilha. Sem login pesado. Sem 30 abas pra preencher uma despesa.

## Funcionalidades

- **Dashboard mensal** com seleção de mês e atualização reativa de todos os widgets.
- **Saldo atual e saldo anterior** lado a lado, com posição consolidada do mês.
- **Total gasto no mês** + **gráfico diário** de despesas para identificar picos.
- **Distribuição por categoria** em gráfico, mostrando onde o dinheiro está indo.
- **Meta de gastos mensal** editável, com acompanhamento de quanto já foi consumido.
- **Fluxo do mês** (entradas vs. saídas) num gráfico comparativo.
- **CRUD completo de transações e categorias** via API própria.
- **Onboarding suave**: na primeira vez, o app sugere categorias iniciais antes de te deixar perdido numa tela em branco.
- **Autenticação** com login, registro, recuperação e reset de senha (Supabase Auth).
- **Dark mode**, transições de página com blur e UI 100% acessível (`@nuxt/a11y`).
- **PWA-ready** rodando em SSR no edge (Cloudflare Pages / Workers).

## Stack

| Camada              | Tecnologias                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| **Framework**       | [Nuxt 4](https://nuxt.com), [Vue 3](https://vuejs.org), [TypeScript](https://www.typescriptlang.org) |
| **UI**              | [shadcn-vue](https://www.shadcn-vue.com) + [Reka UI](https://reka-ui.com), [Tailwind CSS 4](https://tailwindcss.com), [Lucide Icons](https://lucide.dev) |
| **Estado / dados**  | [Pinia](https://pinia.vuejs.org), [Pinia Colada](https://pinia-colada.esm.dev), `useFetch` do Nuxt |
| **Gráficos**        | [Unovis](https://unovis.dev) (`@unovis/vue`)                                                      |
| **Backend**         | API routes do Nuxt (Nitro) + [Supabase](https://supabase.com) (Postgres + Auth + RLS)             |
| **Notificações**    | [vue-sonner](https://vue-sonner.com)                                                              |
| **Tabelas**         | [TanStack Table](https://tanstack.com/table)                                                      |
| **Qualidade**       | [ESLint](https://eslint.org), [Vitest](https://vitest.dev), [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) |
| **Deploy**          | [Cloudflare Pages](https://pages.cloudflare.com) (preset `cloudflare_pages` do Nitro)              |

## Estrutura do projeto

```
my-finances/
├── app/
│   ├── app.vue                # Entry: layout, toaster, transições
│   ├── assets/                # CSS (Tailwind) e estáticos
│   ├── components/
│   │   ├── app/dashboard/     # Cards, charts, widgets do dashboard
│   │   ├── form/              # Formulários (transação, categorias, etc.)
│   │   ├── shared/            # Drawer, dialog e blocos reutilizáveis
│   │   └── ui/                # Componentes shadcn-vue
│   ├── composables/           # Lógica reativa compartilhada
│   ├── interfaces/            # Tipos de domínio (balance, goal, dashboard…)
│   ├── layouts/               # auth, landing, default
│   ├── pages/                 # dashboard, transactions, categories, profile, auth…
│   ├── stores/                # Pinia (user, categories)
│   └── types/                 # Tipos gerados do Supabase
├── server/
│   └── api/                   # Endpoints Nitro (REST)
│       ├── auth/
│       ├── balance.get.ts
│       ├── categories/        # CRUD + batch + top
│       ├── monthly-spending-goal.{get,put}.ts
│       └── transactions/      # CRUD + expense-daily + month-flow
├── supabase/                  # Configuração / migrations do Supabase
├── shared/                    # Utilitários compartilhados client/server
├── test/                      # Testes Vitest
├── nuxt.config.ts
└── package.json
```

## Começando

### Pré-requisitos

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (recomendado — há `pnpm-lock.yaml` versionado)
- Um projeto **Supabase** (URL pública + anon/publishable key)

### 1. Clone e instale

```bash
git clone https://github.com/RodrigoSpinelli/my-finances.git
cd my-finances
pnpm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
SUPABASE_URL=https://<seu-projeto>.supabase.co
SUPABASE_KEY=<sua-publishable-or-anon-key>
```

Essas variáveis são expostas via `runtimeConfig.public` em `nuxt.config.ts` e consumidas pelo módulo `@nuxtjs/supabase`.

### 3. Rode em desenvolvimento

```bash
pnpm dev
```

A aplicação sobe em [`http://localhost:3000`](http://localhost:3000) com HMR e devtools do Nuxt habilitados.

## Scripts

| Script                        | O que faz                                                                |
| ----------------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`                    | Servidor de desenvolvimento (Nuxt + Nitro).                              |
| `pnpm build`                  | Build de produção (Cloudflare Pages preset, com `--max-old-space-size=6144`). |
| `pnpm preview`                | Preview local do build de produção.                                       |
| `pnpm generate`               | Geração estática (quando aplicável).                                     |
| `pnpm test`                   | Executa toda a suíte com Vitest.                                         |
| `pnpm test:watch`             | Vitest em modo watch.                                                    |
| `pnpm test:coverage`          | Vitest com relatório de cobertura (V8).                                  |
| `pnpm test:unit`              | Apenas o projeto `unit` do Vitest.                                       |
| `pnpm test:nuxt`              | Projeto `nuxt` do Vitest (testes integrados ao runtime).                 |
| `pnpm gen:supabase`           | Gera os tipos TypeScript do Supabase em `app/types/database.types.ts`.   |

## Testes

Os testes vivem em [`test/`](./test) e usam [Vitest](https://vitest.dev) + [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing). Há dois projetos configurados (`unit` e `nuxt`) — separando testes puros de testes que precisam do runtime do Nuxt.

```bash
pnpm test           # roda tudo
pnpm test:watch     # modo TDD
pnpm test:coverage  # gera relatório de cobertura
```

## Deploy

Configurado para [**Cloudflare Pages**](https://pages.cloudflare.com) via o preset `cloudflare_pages` do Nitro. O build é otimizado para rodar SSR no edge (Workers).

```bash
pnpm build
# saída: dist/ (pronta pra publicar no Cloudflare Pages)
```

A rota `/reset-password` é renderizada em CSR de propósito (vide `nuxt.config.ts`) para acessar o token na query string sem hydration mismatch.

## Contribuindo

Este projeto segue um fluxo Git enxuto: `feature/*` → `develop` → `staging` → `main`, commits no padrão **Conventional Commits** e PRs com template.

Antes de abrir o primeiro PR, dá uma olhada no [**CONTRIBUTING.md**](./CONTRIBUTING.md) — ele explica branches, padrão de commits, templates de issue e o ciclo de release.

> Sugestões, bugs e ideias são bem-vindas via [Issues](https://github.com/RodrigoSpinelli/my-finances/issues).

## Roadmap (curtinho)

- [ ] Importação de extrato (CSV / OFX)
- [ ] Transações recorrentes
- [ ] Multi-conta / multi-carteira
- [ ] Notificações de meta no navegador
- [ ] App mobile (PWA instalável + tema nativo)

## Licença

Distribuído sob os termos da licença do repositório. Consulte o arquivo `LICENSE` quando disponível.

---

<div align="center">

Feito com Nuxt, Supabase e bastante café por [**@RodrigoSpinelli**](https://github.com/RodrigoSpinelli).

</div>
