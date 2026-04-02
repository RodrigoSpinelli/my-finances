<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
</script>

<template>
  <div class="bg-background text-foreground flex min-h-dvh flex-col">
    <header
      class="border-border/80 bg-background/80 supports-backdrop-filter:bg-background/70 sticky top-0 z-40 border-b backdrop-blur-md"
    >
      <div
        class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <NuxtLink
          to="/"
          class="text-primary flex items-center gap-2 rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Porquinho Financeiro — início"
        >
          <PiggyBankIcon class="size-7 shrink-0 sm:size-8" aria-hidden="true" />
          <span class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
            Porquinho Financeiro
          </span>
        </NuxtLink>
        <div class="flex items-center gap-2 sm:gap-3">
          <ClientOnly>
            <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
          </ClientOnly>
          <Button variant="ghost" size="sm" as-child>
            <NuxtLink to="/login">
              Entrar
            </NuxtLink>
          </Button>
          <Button size="sm" class="shrink-0" as-child>
            <NuxtLink to="/register">
              Criar conta
            </NuxtLink>
          </Button>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-border border-t py-8">
      <div
        class="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center text-sm sm:px-6 sm:flex-row sm:justify-between sm:text-left"
      >
        <p class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <PiggyBankIcon class="text-primary size-5 shrink-0" aria-hidden="true" />
          <span class="text-foreground font-medium">Porquinho Financeiro</span>
          <span class="hidden sm:inline">·</span>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </p>
        <div class="flex gap-4">
          <NuxtLink
            to="/login"
            class="text-foreground/80 hover:text-foreground font-medium underline-offset-4 hover:underline"
          >
            Entrar
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="text-foreground/80 hover:text-foreground font-medium underline-offset-4 hover:underline"
          >
            Registrar
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
