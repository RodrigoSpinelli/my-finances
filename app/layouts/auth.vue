<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";
</script>

<template>
  <div
    class="bg-background text-foreground relative flex min-h-dvh flex-col overflow-hidden"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/6 via-muted/20 to-background dark:from-primary/9"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/7 blur-3xl dark:bg-primary/12"
      aria-hidden="true"
    />
    <header
      class="relative z-10 flex shrink-0 items-center justify-between gap-4 px-4 py-5 sm:px-8"
    >
      <NuxtLink
        to="/"
        class="text-primary flex min-w-0 items-center gap-2 rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Porquinho Financeiro — voltar ao início"
      >
        <PiggyBankIcon class="size-8 shrink-0 sm:size-9" aria-hidden="true" />
        <span
          class="text-foreground truncate text-sm font-semibold tracking-tight sm:text-base"
        >
          Porquinho Financeiro
        </span>
      </NuxtLink>
      <ClientOnly>
        <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
      </ClientOnly>
    </header>
    <main
      class="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-0 sm:px-6 sm:pb-14"
    >
      <slot />
    </main>
  </div>
</template>
