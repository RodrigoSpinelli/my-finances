<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table";
import type { Category } from "~/interfaces/category";
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

const isOpenNew = computed(() => useRoute().query.open === 'true');

type CategoryType = Category["type"];

const { start, finish } = useLoadingIndicator();

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
const isOpen = ref(isOpenNew.value);
const isOpenAlert = ref(false);
const categorySelected = ref<Category | null>(null);
const dialogId = ref<string | undefined>(undefined);

const categories = computed(() => data.value?.categories ?? []);

function typeLabel(t: CategoryType) {
  return t === "income" ? "Receita" : "Despesa";
}

const filteredCategories = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return categories.value;
  return categories.value.filter((c) => {
    const haystack = [c.name, typeLabel(c.type), c.icon, c.color]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const deleteCategory = async () => {
  if (!categorySelected.value)
    useToast({
      type: "error",
      title: "Erro",
      description: "Categoria não selecionada.",
    });
  try {
    start();
    await $fetch("/api/categories/" + categorySelected.value?.id, {
      method: "DELETE",
    });
    useToast({
      type: "success",
      title: "Sucesso",
      description: "Categoria excluída com sucesso.",
    });
    categorySelected.value = null;
    isOpenAlert.value = false;
    refresh();
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description:
        error instanceof Error ? error.message : "Erro ao deletar categoria",
    });
  } finally {
    finish();
  }
};

const openDialog = (id?: string) => {
  dialogId.value = id;
  isOpen.value = true;
};

const openAlert = (id: string) => {
  categorySelected.value = categories.value.find((c) => c.id === id) ?? null;
  if (categorySelected.value) {
    isOpenAlert.value = true;
  }
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

    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
    >
      <shared-input
        v-model="search"
        placeholder="Pesquisar categoria"
        type="search"
        icon="lucide:search"
        class="w-full sm:max-w-xs"
      />
      <div class="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          @click="refresh"
          class="flex-1 sm:flex-none"
        >
          <Icon
            name="lucide:refresh-cw"
            :class="{ 'animate-spin': status === 'pending' }"
          />
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          @click="openDialog()"
          class="flex-1 sm:flex-none"
        >
          <Icon name="lucide:plus" />
        </Button>
      </div>
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">Lista</h2>

      <shared-table
        :headers="headers"
        :is-loading="pending"
        :length="filteredCategories.length"
      >
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
            <div class="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                @click="openDialog(c.id)"
              >
                <Icon name="lucide:edit" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-label="Excluir categoria"
                size="icon"
                @click="openAlert(c.id)"
              >
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
      :form-props="{ id: dialogId }"
      @submit="refresh"
    />
    <shared-dialog-alert
      v-model="isOpenAlert"
      :title="`Tem certeza que deseja excluir a categoria ${categorySelected?.name.toUpperCase()}?`"
      description="Esta ação não pode ser desfeita. A categoria será removida permanentemente."
      @confirm="deleteCategory"
    />
  </div>
</template>
