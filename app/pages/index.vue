<script setup lang="ts">
import type { Category } from "~/interfaces/category";

const isOpen = ref(false);
const { data } = await useFetch<{
  categories: Category[];
}>("/api/categories", {
  onResponse: (response) => {
    if (response.response._data?.categories.length === 0) {
      isOpen.value = true;
    }
  },
});
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold tracking-tight">Minhas finanças</h1>
    <p class="text-muted-foreground text-sm">
      Use o menu para gerenciar
      <NuxtLink
        to="/categories"
        class="text-foreground underline-offset-4 hover:underline"
      >
        categorias
      </NuxtLink>
      e
      <NuxtLink
        to="/transactions"
        class="text-foreground underline-offset-4 hover:underline"
      >
        transações
      </NuxtLink>
      ou abra o
      <NuxtLink
        to="/profile"
        class="text-foreground underline-offset-4 hover:underline"
      >
        perfil
      </NuxtLink>
      .
    </p>
    <app-dashboard-chart-categories />
    <shared-dialog
      v-model="isOpen"
      title="Selecione categorias"
      description="Selecione as categorias que serão usadas como principais para o seu dashboard."
      form="firstCategories"
    >
      <Button>Nova categoria principal</Button>
    </shared-dialog>
    <pre>{{ data }}</pre>
  </div>
</template>
