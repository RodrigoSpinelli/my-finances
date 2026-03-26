<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table";
import type { Tables } from "~/types/database.types";
import type { TableHeaders } from "~/interfaces/table";

useHead({
  title: "Categorias",
});

useSeoMeta({
  title: "Categorias",
  description: "Organize receitas e despesas por categoria.",
});

definePageMeta({
  name: "categories",
});

type Category = Tables<"categories">;
type CategoryType = Category["type"];

const { data, refresh, status, pending } = await useFetch<{
  categories: Category[];
}>("/api/categories");

const headers: TableHeaders[] = [
  { label: "Nome" },
  { label: "Tipo" },
  { label: "Ícone" },
  { label: "Cor" },
  { label: "Ações", align: "right" },
];

const search = ref("");
const isOpen = ref(false);
const dialogId = ref<string | undefined>(undefined);

const categories = computed(() => data.value?.categories ?? []);

function typeLabel(t: CategoryType) {
  return t === "income" ? "Receita" : "Despesa";
}

const filteredCategories = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return categories.value;
  return categories.value.filter((c) => {
    const haystack = [
      c.name,
      typeLabel(c.type),
      c.icon,
      c.color,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const openDialog = (id?: string) => {
  dialogId.value = id;
  isOpen.value = true;
};
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Categorias</h1>
      <p class="text-muted-foreground text-sm">
        Agrupe transações por tipo (receita ou despesa), ícone e cor.
      </p>
    </header>

    <div class="flex items-center justify-between">
      <shared-input
        v-model="search"
        placeholder="Pesquisar categoria"
        type="search"
        icon="lucide:search"
        class="w-full max-w-xs"
      />
      <div class="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" @click="refresh">
          <Icon
            name="lucide:refresh-cw"
            :class="{ 'animate-spin': status === 'pending' }"
          />
          {{ status === "pending" ? "Carregando..." : "Atualizar" }}
        </Button>
        <Button type="button" variant="default" size="sm" @click="openDialog()">
          <Icon name="lucide:plus" />
          Nova categoria
        </Button>
      </div>
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">Lista</h2>

      <shared-table :headers="headers" :is-loading="pending" :length="filteredCategories.length">
        <TableRow v-for="c in filteredCategories" :key="c.id">
          <TableCell class="font-medium">{{ c.name }}</TableCell>
          <TableCell>
            <span
              :class="
                c.type === 'income'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              "
            >
              {{ typeLabel(c.type) }}
            </span>
          </TableCell>
          <TableCell>
            <span
              class="text-muted-foreground inline-flex items-center gap-2 font-mono text-xs"
            >
              <Icon :name="c.icon" class="size-4 shrink-0" />
              {{ c.icon }}
            </span>
          </TableCell>
          <TableCell>
            <shared-color-swatch :color="c.color" />
          </TableCell>
          <TableCell class="text-right">
            <div class="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="openDialog(c.id)"
              >
                <Icon name="lucide:edit" />
              </Button>
              <Button type="button" variant="destructive" size="sm">
                <Icon name="lucide:trash" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </shared-table>
    </section>

    <shared-dialog
      v-model="isOpen"
      title="Nova categoria"
      form="category"
      :id="dialogId"
      @submit="refresh"
    />
  </div>
</template>
