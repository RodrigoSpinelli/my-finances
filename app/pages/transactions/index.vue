<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table";
import type { Category } from "~/interfaces/category";
import type { Tables } from "~/types/database.types";
import type { TableHeaders } from "~/interfaces/table";

useHead({
  title: "Transações",
});

useSeoMeta({
  title: "Transações",
  description: "Registre receitas e despesas com data e categoria opcional.",
});

definePageMeta({
  name: "transactions",
});

type CategoryBrief = Pick<Category, "id" | "name" | "icon" | "type" | "color">;

type TransactionRow = Tables<"transactions"> & {
  categories: CategoryBrief | null;
};

const { start, finish } = useLoadingIndicator();

const PAGE_SIZE = 5;
const page = ref(1);
const search = ref("");
const searchDebounced = ref("");
let searchDebounce: ReturnType<typeof setTimeout> | undefined;

watch(search, (v) => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchDebounced.value = v.trim();
  }, 300);
});

watch(searchDebounced, () => {
  page.value = 1;
});

const { data, refresh, status, pending } = await useFetch<{
  transactions: TransactionRow[];
  total: number;
  page: number;
  pageSize: number;
}>("/api/transactions", {
  query: computed(() => ({
    page: page.value,
    pageSize: PAGE_SIZE,
    ...(searchDebounced.value ? { q: searchDebounced.value } : {}),
  })),
  watch: [page, searchDebounced],
});

const headers: TableHeaders[] = [
  { label: "Data" },
  { label: "Tipo" },
  { label: "Valor", align: "right" },
  { label: "Categoria" },
  { label: "Descrição" },
  { label: "Ações", align: "right" },
];

const isOpen = ref(false);
const isOpenAlert = ref(false);
const dialogId = ref<string | undefined>(undefined);
const transactionSelected = ref<TransactionRow | null>(null);

const { money } = useCurrencyFormat();

const transactions = computed(() => data.value?.transactions ?? []);

const tablePagination = computed(() => ({
  total: data.value?.total ?? 0,
  pageSize: PAGE_SIZE,
}));

watch(
  () => [data.value?.total, page.value] as const,
  ([total, currentPage]) => {
    if (total == null) return;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pageCount) page.value = pageCount;
  },
);

function typeLabel(t: Tables<"transactions">["type"]) {
  if (t === "income") return "Receita";
  if (t === "expense") return "Despesa";
  return "—";
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function openDialog(id?: string) {
  dialogId.value = id;
  isOpen.value = true;
}

function askDelete(id: string) {
  transactionSelected.value =
    transactions.value.find((t) => t.id === id) ?? null;
  if (transactionSelected.value) {
    isOpenAlert.value = true;
  }
}

const deleteTransaction = async () => {
  if (!transactionSelected.value) {
    useToast({
      type: "error",
      title: "Erro",
      description: "Transação não selecionada.",
    });
    return;
  }
  try {
    start();
    await $fetch("/api/transactions/" + transactionSelected.value?.id, {
      method: "DELETE",
    });
    useToast({
      type: "success",
      title: "Sucesso",
      description: "Transação excluída com sucesso.",
    });
    transactionSelected.value = null;
    isOpenAlert.value = false;
    refresh();
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description:
        error instanceof Error ? error.message : "Erro ao excluir transação",
    });
  } finally {
    finish();
  }
};

const dialogTitle = computed(() =>
  dialogId.value ? "Editar transação" : "Nova transação",
);

async function afterTransactionSave() {
  await refresh();
}
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Transações</h1>
      <p class="text-muted-foreground text-sm">
        Registre receitas e despesas com data e categoria opcional.
      </p>
    </header>

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <shared-input
        v-model="search"
        placeholder="Pesquisar transações"
        type="search"
        icon="lucide:search"
        class="w-full max-w-xs"
      />
      <div class="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" @click="refresh">
          <Icon
            name="lucide:refresh-cw"
            :class="{ 'animate-spin': status === 'pending' }"
          />
          {{ status === "pending" ? "Carregando..." : "Atualizar" }}
        </Button>
        <Button type="button" variant="default" @click="openDialog()">
          <Icon name="lucide:plus" />
          Nova transação
        </Button>
      </div>
    </div>

    <shared-table
      v-model:page="page"
      :headers="headers"
      :is-loading="pending"
      :length="transactions.length"
      :pagination="tablePagination"
    >
      <TableRow v-for="t in transactions" :key="t.id">
        <TableCell class="whitespace-nowrap tabular-nums">
          {{ formatDate(t.date) }}
        </TableCell>
        <TableCell>
          <span
            :class="
              t.type === 'income'
                ? 'text-emerald-600 dark:text-emerald-400'
                : t.type === 'expense'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-muted-foreground'
            "
          >
            {{ typeLabel(t.type) }}
          </span>
        </TableCell>
        <TableCell
          class="text-right font-medium tabular-nums"
          :class="
            t.type === 'income'
              ? 'text-emerald-600 dark:text-emerald-400'
              : t.type === 'expense'
                ? 'text-rose-600 dark:text-rose-400'
                : ''
          "
        >
          {{ t.type === "expense" ? "−" : t.type === "income" ? "+" : "" }}
          {{ money.format(t.amount) }}
        </TableCell>
        <TableCell>
          <span v-if="t.categories" class="inline-flex items-center gap-2">
            <Icon
              :name="t.categories.icon"
              class="text-muted-foreground size-4 shrink-0"
            />
            {{ t.categories.name }}
          </span>
          <span v-else class="text-muted-foreground">—</span>
        </TableCell>
        <TableCell class="max-w-48 truncate text-muted-foreground text-sm">
          {{ t.description || "Não informado" }}
        </TableCell>
        <TableCell class="text-right">
          <div class="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              @click="openDialog(t.id)"
            >
              <Icon name="lucide:edit" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              @click="askDelete(t.id)"
            >
              <Icon name="lucide:trash" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </shared-table>

    <shared-dialog
      v-model="isOpen"
      :title="dialogTitle"
      description="Preencha os dados da movimentação financeira."
      form="transaction"
      :form-props="{ id: dialogId }"
      @submit="afterTransactionSave"
    />

    <shared-dialog-alert
      v-model="isOpenAlert"
      :title="`Tem certeza que deseja excluir a transação ${transactionSelected?.description?.toUpperCase()}?`"
      description="Esta ação não pode ser desfeita. A transação será removida permanentemente."
      @confirm="deleteTransaction"
    />
  </div>
</template>
