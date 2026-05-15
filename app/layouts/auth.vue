<script setup lang="ts">
import { PieChart, Target, Wallet } from "lucide-vue-next";

const highlights = [
  {
    icon: Wallet,
    title: "Lançamentos rápidos",
    description: "Registre despesas e receitas sem fricção.",
  },
  {
    icon: PieChart,
    title: "Por categoria",
    description: "Veja onde o dinheiro está indo de verdade.",
  },
  {
    icon: Target,
    title: "Meta mensal",
    description: "Acompanhe o ritmo contra seu teto de gastos.",
  },
] as const;
</script>

<template>
  <div
    class="bg-background text-foreground relative flex min-h-dvh flex-col overflow-hidden"
  >
    <!-- Base layers -->
    <div
      class="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/7 via-background to-violet-500/5 dark:from-primary/11 dark:to-fuchsia-500/10"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
      style="
        background-image:
          radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.07) 1px, transparent 0);
        background-size: 28px 28px;
      "
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -left-24 top-1/4 size-[380px] rounded-full bg-primary/15 blur-[100px] dark:bg-primary/20"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-purple-500/12 blur-[110px] dark:bg-fuchsia-500/14"
      aria-hidden="true"
    />

    <header
      class="relative z-20 flex shrink-0 items-center justify-between gap-4 px-4 py-5 sm:px-8 lg:justify-end"
    >
      <shared-logo-link variant="auth-nav" class="lg:hidden" />
      <ClientOnly>
        <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
      </ClientOnly>
    </header>

    <main
      class="relative z-10 flex flex-1 flex-col lg:min-h-0 lg:flex-row lg:items-stretch"
    >
      <!-- Painel de marca (desktop) -->
      <aside
        class="relative hidden overflow-hidden lg:flex lg:w-[min(46%,560px)] lg:flex-none lg:flex-col lg:justify-between lg:border-r lg:border-border/50 lg:px-10 lg:pb-12 lg:pt-4 xl:px-14"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent dark:from-primary/14"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute right-0 top-24 size-72 rounded-full bg-violet-500/22 blur-3xl dark:bg-purple-400/28"
          aria-hidden="true"
        />

        <div class="relative space-y-6">
          <div class="space-y-3">
            <p
              class="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 uppercase ring-1 ring-violet-500/15 dark:bg-violet-400/12 dark:text-violet-300 dark:ring-violet-400/22"
            >
              Porquinho Financeiro
            </p>
            <h1
              class="text-foreground text-balance text-3xl font-semibold tracking-tight xl:text-4xl xl:leading-tight"
            >
              Clareza no que entra e no que sai
            </h1>
            <p class="text-muted-foreground max-w-md text-pretty text-base leading-relaxed">
              Um painel pensado para quem quer organizar sem planilhas
              intermináveis — categorias, saldo e metas no mesmo lugar.
            </p>
          </div>

          <ul class="flex flex-col gap-4">
            <li
              v-for="item in highlights"
              :key="item.title"
              class="border-border/60 bg-card/40 flex gap-4 rounded-2xl border p-4 backdrop-blur-md dark:bg-card/25"
            >
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/15 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20"
              >
                <component :is="item.icon" class="size-5" aria-hidden="true" />
              </div>
              <div class="min-w-0 space-y-1">
                <p class="text-foreground text-sm font-semibold">
                  {{ item.title }}
                </p>
                <p class="text-muted-foreground text-sm leading-snug">
                  {{ item.description }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Decoração tipo “cartões” -->
        <div
          class="relative mt-10 hidden flex-col gap-3 xl:flex"
          aria-hidden="true"
        >
          <div
            class="border-border/50 bg-card/50 flex items-center justify-between rounded-xl border px-4 py-3 backdrop-blur-sm"
          >
            <span class="text-muted-foreground text-xs font-medium">
              Este mês
            </span>
            <span class="text-foreground text-sm font-semibold tabular-nums">
              Saldo em foco
            </span>
          </div>
          <div class="flex gap-3">
            <div
              class="border-border/40 h-24 flex-1 rounded-xl border bg-violet-500/18 dark:bg-violet-400/16"
            />
            <div
              class="border-border/40 bg-purple-500/20 h-24 flex-[1.15] rounded-xl border dark:bg-fuchsia-500/22"
            />
            <div
              class="border-border/40 bg-muted/80 h-24 flex-1 rounded-xl border dark:bg-muted/40"
            />
          </div>
        </div>
      </aside>

      <!-- Área do formulário -->
      <div
        class="flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-2 sm:px-8 sm:pb-16 lg:overflow-y-auto lg:px-12 lg:py-10 xl:px-16"
      >
        <slot />
      </div>
    </main>
  </div>
</template>
