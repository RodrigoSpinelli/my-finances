<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const authorSite = "https://www.rodrigospinelli.dev";
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
    <footer class="border-border border-t py-6 sm:py-8">
      <div
        class="text-muted-foreground mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center text-sm sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:text-left"
      >
        <p
          class="flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:justify-start"
        >
          <PiggyBankIcon class="text-primary size-5 shrink-0" aria-hidden="true" />
          <span class="text-foreground font-medium">Porquinho Financeiro</span>
          <span class="hidden sm:inline" aria-hidden="true">·</span>
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </p>
        <div
          class="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:w-auto lg:max-w-none lg:flex-col lg:items-end lg:gap-2"
        >
          <p
            class="flex flex-wrap items-center justify-center gap-x-1 text-xs sm:text-sm lg:justify-end"
          >
            <span>Desenvolvido por</span>
            <a
              :href="authorSite"
              target="_blank"
              rel="noopener noreferrer"
              class="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Rodrigo Spinelli
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
