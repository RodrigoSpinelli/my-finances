# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                # Start local dev server (http://localhost:3000)
pnpm build              # Production build (NODE_OPTIONS=--max-old-space-size=6144)
pnpm test               # Run all tests
pnpm test:watch         # Run tests in watch mode
pnpm test:unit          # Unit tests only (node environment)
pnpm test:nuxt          # Nuxt component tests only
pnpm test:coverage      # Run tests with v8 coverage
pnpm gen:supabase       # Regenerate TypeScript types from Supabase schema
```

Linting is handled by `@nuxt/eslint` (auto-configured via Nuxt). Run via `pnpm nuxt lint` or let the IDE handle it.

## Architecture Overview

**poupapig** (Porquinho Financeiro) is a personal finance app — SSR full-stack with Nuxt 4, deployed to Cloudflare Pages/Workers.

### Stack
- **Frontend**: Nuxt 4 + Vue 3, Pinia + @pinia/colada, Tailwind CSS 4, shadcn-nuxt (New York style), Lucide icons
- **Backend**: Nitro/H3 (embedded in Nuxt), Supabase (PostgreSQL + Auth)
- **Testing**: Vitest with two projects: `unit` (node) and `nuxt` (component via happy-dom)

### Directory Layout
```
app/
  components/
    app/        # Feature components (dashboard, transaction forms, category forms)
    base/       # Layout chrome (header, footer)
    shared/     # Reusable UI wrappers
    ui/         # shadcn-nuxt auto-generated components (don't hand-edit)
  composables/  # Reusable logic (money input, currency format, toasts, etc.)
  interfaces/   # Domain TypeScript interfaces (Transaction, Category, Balance, etc.)
  layouts/      # default (authenticated), auth (login/register), landing (public)
  pages/        # File-based routing
  stores/       # Pinia stores (categories, user preferences)
  types/        # Generated Supabase DB types (database.types.ts — do not hand-edit)
server/
  api/          # REST endpoints (file-based: GET.ts, POST.ts, [id]/PATCH.ts, etc.)
  utils/        # Server-side helpers (auth guard, DB query helpers, date utils)
shared/         # Code shared between app and server (color palette)
test/unit/      # Unit test files
```

### Data Fetching Pattern
Two patterns coexist:
1. **`useFetch()`** — Used directly in dashboard/page components for reactive queries; supports `watch` for reactive re-fetching when month/filter changes.
2. **`$fetch()` inside Pinia stores** — Used for mutations and list operations where the store owns the state (e.g., `categories.ts`).

@pinia/colada is installed for caching/deduplication but is mostly transparent — configured in `colada.options.ts`.

### Server-Side Auth
Every protected API endpoint calls `requireAuthUserId(event)` from `server/utils/`. This helper calls `serverSupabaseUser(event)` and throws a 401 if no authenticated user is found. Never skip this in new endpoints.

### Supabase Types
Generated types live in `app/types/database.types.ts`. Use `Tables<"table_name">` for row types. Regenerate after any schema migration with `pnpm gen:supabase`.

### Shared Color System
`shared/colors.ts` is the single source of truth for both UI swatches and chart colors. Use `colorSwatchBgClass()` for Tailwind class names and `colorSwatchHex()` for hex values (e.g., in chart configs).

### Forms
Forms are lazy-loaded via `defineAsyncComponent` and resolved by key in `app/composables/use-form-components.ts`. Adding a new form type means registering it in that composable's `FormComponentKey` map.

### shadcn-nuxt Components
Components under `app/components/ui/` are managed by shadcn. Add new ones via `pnpm dlx shadcn-vue@latest add <component>` — do not hand-edit generated files.
