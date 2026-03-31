<script setup lang="ts">
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
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const isLoading = ref(false);

function onGoalAmountKeydown(e: KeyboardEvent) {
  handleKeydown(e);
  if (e.key === "Enter") {
    e.preventDefault();
    void saveGoal();
  }
}

async function saveGoal() {
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
      body: { month: props.month, amount },
    });
    useToast({
      type: "success",
      title: "Meta salva",
      description: "Sua meta mensal foi atualizada.",
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
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="saveGoal">
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
    <Button type="submit" :disabled="isLoading" class="w-full">
      <Icon
        v-if="isLoading"
        name="lucide:loader-circle"
        class="size-4 animate-spin"
      />
      {{ isLoading ? "Salvando..." : "Salvar" }}
    </Button>
  </form>
</template>
