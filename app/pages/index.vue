<script setup lang="ts">
import type { Category } from "~/interfaces/category";

const { data, refresh } = await useFetch<{ categories: Category[] }>(
  "/api/categories",
);

const isOpen = computed(() => (data.value?.categories?.length ?? 0) === 0);

const user = useSupabaseUser();
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold tracking-tight">
      Bem-vindo(a), {{ user?.user_metadata?.display_name }}!
    </h1>
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
    <div class="grid grid-cols-6 gap-6">
      <app-dashboard-chart-analysis class="col-span-2" />
      <app-dashboard-chart-transactions class="col-span-2" />
      <app-dashboard-chart-categories class="col-span-2" />
    </div>
    <div class="p-6 bg-primary"></div>
    <div class="p-6 bg-secondary"></div>
    <shared-dialog
      v-model="isOpen"
      title="Escolha suas primeiras categorias"
      description="Selecione as categorias iniciais que você irá utilizar no seu controle financeiro. Isso ajudará a personalizar sua experiência. Você poderá adicionar ou editar categorias depois, se quiser."
      form="firstCategories"
      @submit="refresh"
    >
      <Button>Nova categoria principal</Button>
    </shared-dialog>
  </div>
</template>
