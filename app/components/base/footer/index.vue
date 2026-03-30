<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";
</script>

<template>
  <footer class="bg-background border-t fixed bottom-0 left-0 right-0">
    <div class="container mx-auto px-4 py-6">
      <p class="text-sm text-muted-foreground flex items-center gap-2">
        &copy; {{ new Date().getFullYear() }}
        <PiggyBankIcon class="size-6 text-primary" />
        <span class="font-bold">Porquinho Financeiro.</span>
        <span class="text-muted-foreground">Todos os direitos reservados.</span>
      </p>
    </div>
  </footer>
</template>
