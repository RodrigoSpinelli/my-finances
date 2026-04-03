<script setup lang="ts">
import type { Tables } from "~/types/database.types";

useHead({
  title: "Ícones",
});

definePageMeta({
  name: "icons",
});

const { data, refresh, pending } = await useFetch<{ icons: Tables<"icons">[] }>(
  "/api/icons",
);
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8 p-6">
    <header class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">Ícones</h1>
        <p class="text-muted-foreground text-sm">
          Ícones para categorias e transações.
        </p>
      </div>
      <Button type="button" variant="default" size="sm" :disabled="pending" @click="refresh()">
        <Icon name="lucide:refresh-cw" :class="{ 'animate-spin': pending }" />
      </Button>
    </header>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button v-if="data" v-for="icon in data.icons" :key="icon.id">
        <Icon :name="icon.name" />
        {{ icon.name }}
      </Button>
    </div>
  </div>
</template>
