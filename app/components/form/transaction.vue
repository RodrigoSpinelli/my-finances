<script setup lang="ts">
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionWithCategory } from "~/interfaces/transaction";
import type { Category } from "~/interfaces/category";
import { getFetchErrorMessage } from "~/utils/fetch-error";
import {
  formatMoneyInputBr,
  MONEY_INPUT_DEFAULT_DISPLAY,
  parseMoneyInputBr,
} from "~/utils/money-input";

interface Props {
  id?: string;
}

const { id } = defineProps<Props>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "cancel"): void;
}>();

interface Form {
  amount: string;
  categoryId: string | undefined;
  date: string | undefined;
  description: string;
  type: TransactionType;
}

const categories = ref<Category[]>([]);

const getCategories = async () => {
  const { categories: list, total } = await $fetch<{
    categories: Category[];
    total: number;
  }>("/api/categories", {
    query: {
      type: form.type,
    },
  });
  categories.value = list;
  if (total === 0) {
    emit("cancel");
    useToast({
      type: "error",
      title: "Nenhuma categoria encontrada!",
      description: "Cadastre uma categoria para continuar",
    });
  }
};

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const form = reactive<Form>({
  amount: MONEY_INPUT_DEFAULT_DISPLAY,
  categoryId: undefined,
  date: todayIso(),
  description: "",
  type: "expense",
});

const typeOptions = [
  { label: "Receita", value: "income" },
  { label: "Despesa", value: "expense" },
];

const categoryOptions = computed(() => {
  return categories.value.map((c) => ({ label: c.name, value: c.id }));
});

const submit = () => {
  id ? update() : create();
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
        category_id: form.categoryId,
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

    await $fetch("/api/transactions/" + id, {
      method: "patch",
      params: {
        id: id,
      },
      body: {
        amount,
        category_id: form.categoryId,
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
  if (!id) return;
  try {
    const { transaction: t } = await $fetch<{
      transaction: TransactionWithCategory;
    }>(`/api/transactions/${id}`);
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
    getCategories();
    form.categoryId = undefined;
  },
  { immediate: true },
);

onMounted(() => {
  id && getData();
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
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
    <shared-date-input id="tx_date" v-model="form.date" label="Data" required />
    <div class="grid gap-4 sm:grid-cols-2">
      <shared-select
        id="tx_type"
        v-model="form.type"
        placeholder="Tipo"
        label="Tipo"
        :options="typeOptions"
      />
      <shared-select
        id="tx_category"
        v-model="form.categoryId"
        placeholder="Categoria"
        :options="categoryOptions"
        label="Categoria"
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
