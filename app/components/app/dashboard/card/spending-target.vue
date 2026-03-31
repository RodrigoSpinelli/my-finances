<script setup lang="ts">
import { CrosshairIcon, SquarePenIcon } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import type { GoalPayload } from "~/interfaces/goal";

const { money } = useCurrencyFormat();

const props = defineProps<{
  month: string;
}>();

const emit = defineEmits<{
  (e: "saved"): void;
}>();

const isOpen = ref(false);

const { data, pending, refresh } = await useFetch<GoalPayload>(
  "/api/monthly-spending-goal",
  {
    query: computed(() => ({ month: props.month })),
    watch: [() => props.month],
  },
);

const hasGoal = computed(() => {
  if (!data.value) return false;
  return (data.value.goal?.amount ?? 0) > 0;
});

const progressPercent = computed(() => {
  const target = data.value?.goal?.amount ?? 0;
  if (target <= 0) return 0;
  const spent = data.value?.spent ?? 0;
  return Math.min(100, (spent / target) * 100);
});
</script>

<template>
  <Card>
    <CardHeader
      class="gap-4 flex flex-wrap items-center justify-between border-b"
    >
      <CardTitle>Meta de gastos do mês</CardTitle>
      <CrosshairIcon />
    </CardHeader>
    <CardContent>
      <div v-if="pending" class="text-muted-foreground text-sm">
        Carregando…
      </div>
      <div
        v-else-if="!hasGoal"
        class="text-muted-foreground text-sm flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        Nenhuma meta definida para este mês.
        <button
          type="button"
          class="text-foreground font-semibold underline-offset-4 hover:underline cursor-pointer inline p-0 border-0 bg-transparent text-sm"
          @click="isOpen = true"
        >
          Definir agora
        </button>
      </div>
      <div v-else class="grid space-y-2">
        <div class="flex flex-wrap items-center justify-between mb-1 gap-2">
          <span class="text-sm text-muted-foreground">Gasto no mês</span>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="text-base font-semibold tabular-nums">
              {{ money.format(data?.spent ?? 0) }} /
              {{ money.format(data?.goal?.amount ?? 0) }}
            </span>
            <Button variant="ghost" size="icon" @click="isOpen = true">
              <SquarePenIcon class="size-4" />
            </Button>
          </div>
        </div>
        <Progress :model-value="progressPercent" />
      </div>
    </CardContent>
    <shared-drawer
      v-model="isOpen"
      title="Meta de gastos"
      description="Defina quanto deseja gastar no mês selecionado no painel. O progresso usa apenas despesas registradas naquele mês."
      form="setGoals"
      :form-props="{ month }"
      @submit="refresh"
    />
  </Card>
</template>
