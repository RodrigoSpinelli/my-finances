<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownUpIcon } from "lucide-vue-next";
import type { MonthFlowResponse } from "~/interfaces/dashboard";

const { pending, data } = defineProps<{
  pending: boolean;
  data: MonthFlowResponse | null;
}>();

const entradaTotal = computed(() => Math.max(0, data?.income_total ?? 0));
const saidaTotal = computed(() => Math.max(0, data?.expense_total ?? 0));

const chartMaxValue = computed(() => {
  const peak = Math.max(entradaTotal.value, saidaTotal.value, 1);
  return peak * 1.08;
});

const hasMovement = computed(
  () => entradaTotal.value > 0 || saidaTotal.value > 0,
);

function barWidthPct(amount: number) {
  const m = chartMaxValue.value;
  if (m <= 0)
    return 0;
  return Math.min(100, (amount / m) * 100);
}

const entradaWidth = computed(() => barWidthPct(entradaTotal.value));
const saidaWidth = computed(() => barWidthPct(saidaTotal.value));
</script>

<template>
  <Card
    class="group relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-emerald-500 via-muted to-rose-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Entrada e saída
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Proporção de entradas e saídas no mês
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-linear-to-br from-emerald-500/15 to-rose-500/15 p-2.5 text-muted-foreground shadow-inner ring-1 ring-border/50 dark:from-emerald-400/10 dark:to-rose-400/10"
      >
        <ArrowDownUpIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="flex flex-col px-6 pb-6 pt-0">
      <div
        v-if="pending"
        class="flex min-h-[120px] flex-col justify-center gap-3 py-2"
      >
        <div class="flex items-center gap-3">
          <Skeleton class="h-8 w-7 shrink-0 rounded-md sm:w-9" />
          <Skeleton class="h-9 flex-1 rounded-lg" />
        </div>
        <div class="flex items-center gap-3">
          <Skeleton class="h-8 w-7 shrink-0 rounded-md sm:w-9" />
          <Skeleton class="h-9 flex-1 rounded-lg" />
        </div>
      </div>
      <div
        v-else-if="!hasMovement"
        class="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/25 px-4 py-8 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhuma entrada ou saída neste mês.
        </p>
        <p class="mt-2 text-xs text-muted-foreground">
          Registre em
          <NuxtLink
            to="/transactions"
            class="font-medium text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          .
        </p>
      </div>
      <div
        v-else
        class="flex min-h-[120px] flex-col justify-center gap-4 py-2"
        role="group"
        aria-label="Comparativo de entradas (sinal de mais) e saídas (sinal de menos)"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <span
            class="w-7 shrink-0 text-center text-lg font-semibold leading-none tabular-nums text-emerald-600 sm:w-9 sm:text-xl dark:text-emerald-400"
          >
            +
          </span>
          <div
            class="h-9 min-w-0 flex-1 overflow-hidden rounded-lg bg-muted/50 ring-1 ring-border/50 dark:bg-muted/30"
          >
            <div
              class="h-full rounded-lg bg-emerald-500 shadow-inner ring-1 ring-black/10 transition-[width] duration-500 ease-out dark:bg-emerald-400 dark:ring-white/10"
              :style="{ width: `${entradaWidth}%`, minWidth: entradaTotal > 0 ? '3px' : '0' }"
            />
          </div>
        </div>
        <div class="flex items-center gap-3 sm:gap-4">
          <span
            class="w-7 shrink-0 text-center text-lg font-semibold leading-none tabular-nums text-rose-600 sm:w-9 sm:text-xl dark:text-rose-400"
          >
            -
          </span>
          <div
            class="h-9 min-w-0 flex-1 overflow-hidden rounded-lg bg-muted/50 ring-1 ring-border/50 dark:bg-muted/30"
          >
            <div
              class="h-full rounded-lg bg-rose-500 shadow-inner ring-1 ring-black/10 transition-[width] duration-500 ease-out dark:bg-rose-400 dark:ring-white/10"
              :style="{ width: `${saidaWidth}%`, minWidth: saidaTotal > 0 ? '3px' : '0' }"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
