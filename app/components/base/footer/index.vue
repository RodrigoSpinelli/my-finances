<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";

const authorSite = "https://www.rodrigospinelli.dev";
</script>

<template>
  <footer
    class="bg-background border-border fixed bottom-0 left-0 right-0 z-10 border-t"
  >
    <div class="container mx-auto px-4 py-4 sm:py-5">
      <div
        class="flex flex-col gap-3 text-center text-sm leading-relaxed text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left"
      >
        <p
          class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start"
        >
          <span>&copy; {{ new Date().getFullYear() }}</span>
          <PiggyBankIcon
            class="text-primary size-5 shrink-0 sm:size-6"
            aria-hidden="true"
          />
          <span class="text-foreground font-semibold">Porquinho Financeiro</span>
          <span class="hidden sm:inline" aria-hidden="true">·</span>
          <span class="w-full sm:w-auto">Todos os direitos reservados.</span>
        </p>
        <p
          class="flex flex-wrap items-center justify-center gap-x-1 sm:justify-end"
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
</template>
