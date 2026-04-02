<script setup lang="ts">
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "~/interfaces/category";
import type { Transaction } from "~/interfaces/transaction";
import type { Database } from "~/types/database.types";
import { getFetchErrorMessage } from "~/utils/fetch-error";
import {
  formatMoneyInputBr,
  MONEY_INPUT_DEFAULT_DISPLAY,
  parseMoneyInputBr,
} from "~/utils/money-input";

type TransactionType = Database["public"]["Enums"]["transaction_type"];

type TransactionApi = Transaction & {
  categories: Category | null;
};

const props = defineProps<{
  id?: string;
  type?: TransactionType;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

interface Form {
  amount: string;
  categoryId: string | undefined;
  date: string | undefined;
  description: string;
  type: TransactionType;
}

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function categoryIdForApi(id: string | undefined | null): string | null {
  if (id === undefined || id === null) return null;
  const t = String(id).trim();
  return t.length ? t : null;
}

const form = reactive<Form>({
  amount: MONEY_INPUT_DEFAULT_DISPLAY,
  categoryId: undefined,
  date: todayIso(),
  description: "",
  type: props.type ?? "expense",
});

const categories = ref<Category[]>([]);

const typeOptions = [
  { label: "Receita", value: "income" },
  { label: "Despesa", value: "expense" },
];

const categoryOptions = computed(() => {
  return categories.value.map((c) => ({ label: c.name, value: c.id }));
});

async function loadLookups() {
  try {
    const [c] = await Promise.all([
      $fetch<{ categories: Category[] }>("/api/categories", {
        params: {
          type: form.type,
        },
      }),
    ]);
    categories.value = c.categories;
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao carregar listas",
    });
  }
}

const submit = () => {
  props.id ? update() : create();
};

const create = async () => {
  try {
    const amount = parseMoneyInputBr(form.amount);
    if (amount == null || amount <= 0) {
      useToast({
        type: "error",
        title: "Valor inválido",
        description: "Informe um valor maior que zero.",
      });
      return;
    }
    if (!form.date) {
      useToast({
        type: "error",
        title: "Data obrigatória",
        description: "Selecione ou informe a data da transação.",
      });
      return;
    }

    await $fetch("/api/transactions", {
      method: "post",
      body: {
        amount,
        category_id: categoryIdForApi(form.categoryId),
        date: form.date,
        description: form.description.trim() || null,
        type: form.type,
      },
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Transação registrada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description: getFetchErrorMessage(error, "Erro ao salvar transação"),
    });
  }
};

const update = async () => {
  try {
    const amount = parseMoneyInputBr(form.amount);
    if (amount == null || amount <= 0) {
      useToast({
        type: "error",
        title: "Valor inválido",
        description: "Informe um valor maior que zero.",
      });
      return;
    }
    if (!form.date) {
      useToast({
        type: "error",
        title: "Data obrigatória",
        description: "Selecione ou informe a data da transação.",
      });
      return;
    }

    await $fetch("/api/transactions/" + props.id, {
      method: "patch",
      params: {
        id: props.id,
      },
      body: {
        amount,
        category_id: categoryIdForApi(form.categoryId),
        date: form.date,
        description: form.description.trim() || null,
        type: form.type,
      },
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Transação atualizada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description: getFetchErrorMessage(error, "Erro ao atualizar transação"),
    });
  }
};

const getData = async () => {
  if (!props.id) return;
  try {
    const { transaction: t } = await $fetch<{ transaction: TransactionApi }>(
      `/api/transactions/${props.id}`,
    );
    form.amount = formatMoneyInputBr(t.amount);
    form.categoryId = t.category_id ?? undefined;
    form.date = t.date;
    form.description = t.description ?? "";
    form.type = (t.type ?? "expense") as TransactionType;
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description: getFetchErrorMessage(error, "Erro ao buscar transação"),
    });
  }
};

function resetForm() {
  form.amount = MONEY_INPUT_DEFAULT_DISPLAY;
  form.categoryId = undefined;
  form.date = todayIso();
  form.description = "";
  form.type = "expense";
}

watch(
  () => form.type,
  () => {
    loadLookups();
    form.categoryId = undefined;
  },
  { immediate: true },
);

onMounted(() => {
  props.id && getData();
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="grid gap-4 sm:grid-cols-2">
      <shared-select
        v-if="!props.type"
        id="tx_type"
        v-model="form.type"
        placeholder="Tipo"
        label="Tipo"
        :options="typeOptions"
      />
      <shared-date-input
        id="tx_date"
        v-model="form.date"
        label="Data"
        :class="{ 'col-span-2': !!type }"
        required
      />
    </div>
    <shared-input
      id="tx_amount"
      v-model="form.amount"
      money-br
      icon="lucide:banknote"
      label="Valor"
      placeholder="00,00"
      type="text"
      required
    />
    <div class="space-y-2">
      <Label for="tx_category">Categoria *</Label>
      <shared-select
        id="tx_category"
        v-model="form.categoryId"
        placeholder="Categoria"
        :options="categoryOptions"
        required
      />
    </div>
    <div class="space-y-2">
      <Label for="tx_description">Descrição (opcional)</Label>
      <Textarea
        id="tx_description"
        v-model="form.description"
        placeholder="Ex.: Supermercado semanal"
        rows="3"
      />
    </div>
    <DialogFooter>
      <DialogClose as-child>
        <Button variant="outline"> Cancelar </Button>
      </DialogClose>
      <Button type="submit"> Salvar </Button>
    </DialogFooter>
  </form>
</template>
