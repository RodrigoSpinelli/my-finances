<script setup lang="ts">
import type { GoalFormIntent } from "~/interfaces/goal";

const {
  display,
  setFromNumber,
  clear,
  numeric,
  handleKeydown,
  handlePaste,
  handleInput,
} = useMoneyInput();

const props = defineProps<{
  month: string;
  intent: GoalFormIntent;
  formNonce: number;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const { getCategories } = useCategoriesStore();
const { categories } = storeToRefs(useCategoriesStore());

const isLoading = ref(false);

const GENERAL = "__general__" as const;
const scope = ref<string>(GENERAL);

const expenseSelectable = computed(() => {
  if (props.intent.kind !== "create")
    return [];
  const taken = new Set(props.intent.takenCategoryIds);
  return [...categories.value]
    .filter(c => c.type === "expense" && !taken.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
});

function hydrateFromIntent() {
  if (props.intent.kind === "edit") {
    scope.value =
      props.intent.category_id !== null ? props.intent.category_id : GENERAL;
    setFromNumber(props.intent.amount);
    return;
  }

  clear();

  const list = expenseSelectable.value;
  if (props.intent.allowGeneral) {
    scope.value = GENERAL;
  } else {
    scope.value = list.length > 0 ? list[0]!.id : "";
  }
}

watch(
  () => [props.month, props.formNonce, props.intent] as const,
  () => hydrateFromIntent(),
  { deep: true },
);

watch(
  () => categories.value,
  () => {
    if (props.intent.kind !== "create") return;

    /** Após `/api/categories` carregar — escolha padrão que antes era lista vazia. */
    if (props.intent.allowGeneral) {
      if (scope.value === "" || scope.value == null)
        scope.value = GENERAL;
    }
    else if ((!scope.value || scope.value === GENERAL) && expenseSelectable.value.length > 0) {
      scope.value = expenseSelectable.value[0]!.id;
    }
  },
);

onMounted(() => void getCategories().then(() => hydrateFromIntent()));

function onGoalAmountKeydown(e: KeyboardEvent) {
  handleKeydown(e);
  if (e.key === "Enter") {
    e.preventDefault();
    void saveGoal();
  }
}

async function saveGoal() {
  if (props.intent.kind === "edit") {
    const amount = numeric.value;
    if (amount <= 0) {
      useToast({
        type: "error",
        title: "Valor inválido",
        description: "Informe um valor maior que zero.",
      });
      return;
    }
    try {
      isLoading.value = true;
      await $fetch("/api/monthly-spending-goal", {
        method: "PUT",
        body: {
          month: props.month,
          amount,
          id: props.intent.goalId,
        },
      });
      useToast({
        type: "success",
        title: "Meta salva",
        description: "O valor da meta foi atualizado.",
      });
      emit("submit");
    } catch (error) {
      useToast({
        type: "error",
        title: "Erro",
        description: getFetchErrorMessage(
          error,
          "Não foi possível salvar a meta.",
        ),
      });
    } finally {
      isLoading.value = false;
    }
    return;
  }

  /** create */
  if (!props.intent.allowGeneral && scope.value === GENERAL) {
    scope.value = expenseSelectable.value[0]?.id ?? "";
  }

  if (scope.value !== GENERAL && !scope.value) {
    useToast({
      type: "error",
      title: "Escolha uma categoria",
      description:
        "Não há despesa disponível para nova meta neste mês. Adicione uma categoria de despesa ou remova alguma meta existente.",
    });
    return;
  }

  if (props.intent.allowGeneral === false && expenseSelectable.value.length === 0) {
    useToast({
      type: "error",
      title: "Nada para salvar",
      description:
        "Não há categoria disponível ou a meta geral já está definida.",
    });
    return;
  }

  const amount = numeric.value;
  if (amount <= 0) {
    useToast({
      type: "error",
      title: "Valor inválido",
      description: "Informe um valor maior que zero.",
    });
    return;
  }

  const category_id = scope.value === GENERAL ? null : scope.value;

  try {
    isLoading.value = true;
    await $fetch("/api/monthly-spending-goal", {
      method: "PUT",
      body: { month: props.month, amount, category_id },
    });
    useToast({
      type: "success",
      title: "Meta salva",
      description: "Sua meta foi registrada.",
    });
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description: getFetchErrorMessage(error, "Não foi possível salvar a meta."),
    });
  } finally {
    isLoading.value = false;
  }
}

async function removeGoal() {
  if (props.intent.kind !== "edit")
    return;

  try {
    isLoading.value = true;
    await $fetch(`/api/monthly-spending-goal/${props.intent.goalId}`, {
      method: "DELETE",
    });
    useToast({
      type: "success",
      title: "Meta removida",
      description: "A meta foi excluída para este mês.",
    });
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description: getFetchErrorMessage(
        error,
        "Não foi possível remover a meta.",
      ),
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="saveGoal">
    <template v-if="intent.kind === 'create'">
      <Label for="goal-scope">Alcance da meta</Label>
      <NativeSelect
        id="goal-scope"
        v-model="scope"
        aria-label="Alcance da meta"
      >
        <NativeSelectOption
          v-if="intent.allowGeneral"
          :value="GENERAL"
        >
          Todas as despesas do mês
        </NativeSelectOption>
        <NativeSelectOption
          v-for="cat in expenseSelectable"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </NativeSelectOption>
      </NativeSelect>
      <p
        v-if="intent.allowGeneral === false && expenseSelectable.length === 0"
        class="text-xs text-muted-foreground"
      >
        Nenhuma categoria de despesa livre neste mês.
      </p>
    </template>
    <div v-else class="rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
      <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Meta em edição
      </p>
      <p class="mt-1 text-sm font-medium">
        {{ intent.categoryLabel }}
      </p>
    </div>
    <Label for="goal-amount">Valor da meta</Label>
    <Input
      id="goal-amount"
      :model-value="display"
      type="text"
      inputmode="decimal"
      placeholder="Como na maquininha: 150000 = 1.500,00"
      autocomplete="off"
      @update:model-value="() => {}"
      @keydown="onGoalAmountKeydown"
      @paste="handlePaste"
      @input="handleInput"
    />
    <div class="flex flex-col gap-2">
      <Button type="submit" :disabled="isLoading" class="w-full">
        <Icon
          v-if="isLoading"
          name="lucide:loader-circle"
          class="size-4 animate-spin"
        />
        {{ isLoading ? "Salvando..." : "Salvar" }}
      </Button>
      <Button
        v-if="intent.kind === 'edit'"
        type="button"
        variant="ghost"
        class="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
        :disabled="isLoading"
        @click="removeGoal"
      >
        Remover meta
      </Button>
    </div>
  </form>
</template>
