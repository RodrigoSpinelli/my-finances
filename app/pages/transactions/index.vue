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

const { data, refresh, status, pending } = await useFetch<{
  transactions: TransactionRow[];
}>("/api/transactions");

const headers: TableHeaders[] = [
  { label: "Data" },
  { label: "Tipo" },
  { label: "Valor", align: "right" },
  { label: "Categoria" },
  { label: "Descrição" },
  { label: "Ações", align: "right" },
];

const search = ref("");
const isOpen = ref(false);
const isOpenAlert = ref(false);
const dialogId = ref<string | undefined>(undefined);
const transactionSelected = ref<TransactionRow | null>(null);

const { money } = useCurrencyFormat();

const transactions = computed(() => data.value?.transactions ?? []);

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

const filteredTransactions = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return transactions.value;
  return transactions.value.filter((t) => {
    const parts = [
      formatDate(t.date),
      typeLabel(t.type),
      money.value.format(t.amount),
      t.description ?? "",
      t.categories?.name ?? "",
    ];
    return parts.join(" ").toLowerCase().includes(q);
  });
});

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
  if (!transactionSelected.value)
    useToast({
      type: "error",
      title: "Erro",
      description: "Categoria não selecionada.",
    });
  try {
    start();
    await $fetch("/api/transactions/" + transactionSelected.value?.id, {
      method: "DELETE",
    });
    useToast({
      type: "success",
      title: "Sucesso",
      description: "Categoria excluída com sucesso.",
    });
    transactionSelected.value = null;
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
        <Button type="button" variant="outline" size="sm" @click="refresh">
          <Icon
            name="lucide:refresh-cw"
            :class="{ 'animate-spin': status === 'pending' }"
          />
          {{ status === "pending" ? "Carregando..." : "Atualizar" }}
        </Button>
        <Button type="button" variant="default" size="sm" @click="openDialog()">
          <Icon name="lucide:plus" />
          Nova transação
        </Button>
      </div>
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">Lista</h2>

      <shared-table
        :headers="headers"
        :is-loading="pending"
        :length="filteredTransactions.length"
      >
        <TableRow v-for="t in filteredTransactions" :key="t.id">
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
            {{ t.description || "—" }}
          </TableCell>
          <TableCell class="text-right">
            <div class="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="openDialog(t.id)"
              >
                <Icon name="lucide:edit" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                @click="askDelete(t.id)"
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
