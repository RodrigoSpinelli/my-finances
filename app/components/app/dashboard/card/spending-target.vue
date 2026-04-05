<script setup lang="ts">
import { TargetIcon, SquarePenIcon } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import type { GoalPayload } from "~/interfaces/goal";

const { money } = useCurrencyFormat();

const { month, pending, data } = defineProps<{
  month: string;
  pending: boolean;
  data: GoalPayload | null;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const isOpen = ref(false);

const hasGoal = computed(() => {
  if (!data) return false;
  return (data.goal?.amount ?? 0) > 0;
});

const progressPercent = computed(() => {
  const target = data?.goal?.amount ?? 0;
  if (target <= 0) return 0;
  const spent = data?.spent ?? 0;
  return Math.min(100, (spent / target) * 100);
});

const progressLabel = computed(() => {
  const target = data?.goal?.amount ?? 0;
  if (target <= 0) return "0";
  const spent = data?.spent ?? 0;
  return Math.round((spent / target) * 100).toString();
});

const isOverTarget = computed(() => {
  const target = data?.goal?.amount ?? 0;
  if (target <= 0) return false;
  return (data?.spent ?? 0) > target;
});
</script>

<template>
  <Card
    class="relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Meta de gastos
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Limite planejado para o mês
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-violet-500/10 p-2.5 text-violet-600 shadow-inner ring-1 ring-violet-500/15 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20"
      >
        <TargetIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="space-y-4 pb-6 pt-0">
      <template v-if="pending">
        <div class="flex flex-col gap-3">
          <Skeleton class="h-4 w-full rounded-md" />
          <Skeleton class="h-3 w-full rounded-full" />
          <Skeleton class="h-4 w-32 rounded-md" />
        </div>
      </template>
      <div
        v-else-if="!hasGoal"
        class="rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-5 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhuma meta definida para este mês.
        </p>
        <button
          type="button"
          class="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          @click="isOpen = true"
        >
          Definir agora
        </button>
      </div>
      <div v-else class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-sm font-medium text-muted-foreground"
            >Gasto no mês</span
          >
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="text-lg font-bold tabular-nums tracking-tight sm:text-xl"
            >
              {{ money.format(data?.spent ?? 0) }}
              <span class="font-semibold text-muted-foreground"> / </span>
              {{ money.format(data?.goal?.amount ?? 0) }}
            </span>
            <Button
              variant="ghost"
              size="icon"
              class="size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="isOpen = true"
            >
              <SquarePenIcon class="size-4" />
            </Button>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2 text-xs">
            <span class="text-muted-foreground">Progresso</span>
            <span
              class="font-semibold tabular-nums"
              :class="
                isOverTarget ? 'text-destructive' : 'text-foreground'
              "
            >
              {{ progressLabel }}%
            </span>
          </div>
          <Progress
            :model-value="progressPercent"
            class="h-2.5"
            :class="
              isOverTarget
                ? 'bg-destructive/25! **:data-[slot=progress-indicator]:bg-destructive!'
                : ''
            "
          />
        </div>
      </div>
    </CardContent>
    <shared-drawer
      v-model="isOpen"
      title="Meta de gastos"
      description="Defina quanto deseja gastar no mês selecionado no painel. O progresso usa apenas despesas registradas naquele mês."
      form="setGoals"
      :form-props="{ month }"
      @submit="emit('refresh')"
    />
  </Card>
</template>
