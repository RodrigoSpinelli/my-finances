<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart";
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BanknoteArrowUp,
  BanknoteArrowDown,
  LandmarkIcon,
} from "lucide-vue-next";
import type { MonthFlowResponse } from "~/interfaces/dashboard";

const SLICE_INCOME = "income";
const SLICE_EXPENSE = "expense";

type SliceRow = Record<string, string | number>;

function segmentKey(row: SliceRow): string {
  for (const k of Object.keys(row)) {
    if (k !== "fill") return k;
  }
  return SLICE_INCOME;
}

function sliceValue(row: SliceRow): number {
  const k = segmentKey(row);
  const v = row[k];
  return typeof v === "number" ? v : Number(v);
}

/** Cores resolvidas no `[data-chart]` via ChartStyle; o SVG usa estas vars. */
function sliceFillCss(row: SliceRow): string {
  return `var(--color-${segmentKey(row)})`;
}

const percent = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const { pending, data } = defineProps<{
  pending: boolean;
  data: MonthFlowResponse | null;
}>();

const { formatMoney } = useCurrencyFormat();

/** Apenas duas fatias: entradas e saídas no mês. */
const chartModel = computed(() => {
  const income = Math.abs(data?.income_total ?? 0);
  const expense = Math.abs(data?.expense_total ?? 0);

  const chartConfig: ChartConfig = {
    [SLICE_INCOME]: {
      label: "Entradas",
      color: "var(--primary)",
    },
    [SLICE_EXPENSE]: {
      label: "Saídas",
      color: "var(--destructive)",
    },
  };

  const chartData: SliceRow[] = [];
  if (income > 0) {
    chartData.push({
      [SLICE_INCOME]: income,
      fill: `var(--color-${SLICE_INCOME})`,
    });
  }
  if (expense > 0) {
    chartData.push({
      [SLICE_EXPENSE]: expense,
      fill: `var(--color-${SLICE_EXPENSE})`,
    });
  }

  const totalFlow = income + expense;
  const incomeShare = totalFlow > 0 ? income / totalFlow : 0;
  return {
    chartData,
    chartConfig,
    centralLabel: percent.format(incomeShare),
  };
});

const hasMovement = computed(() => chartModel.value.chartData.length > 0);
</script>

<template>
  <Card
    class="relative flex flex-col overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-rose-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Transações
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Proporção de entradas e saídas no mês
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-teal-500/10 p-2.5 text-teal-600 shadow-inner ring-1 ring-teal-500/15 dark:bg-teal-400/10 dark:text-teal-400 dark:ring-teal-400/20"
      >
        <LandmarkIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col px-6 pb-2 pt-0">
      <div
        v-if="pending"
        class="mx-auto flex aspect-square max-h-[250px] w-full max-w-[250px] flex-col items-center justify-center gap-4 py-4"
      >
        <Skeleton class="aspect-square size-[min(100%,220px)] rounded-full" />
        <div class="flex w-full justify-center gap-3">
          <Skeleton class="h-8 w-24 rounded-full" />
          <Skeleton class="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div
        v-else-if="!hasMovement"
        class="mx-auto flex aspect-square max-h-[250px] w-full max-w-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-8 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhuma entrada ou saída neste mês.
        </p>
        <p class="mt-2 text-xs text-muted-foreground">
          Registre transações em
          <NuxtLink
            to="/transactions"
            class="font-medium text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          .
        </p>
      </div>
      <ClientOnly v-else>
        <ChartContainer
          :config="chartModel.chartConfig"
          class="mx-auto aspect-square max-h-[250px]"
          :style="{
            '--vis-donut-central-label-font-size': 'var(--text-2xl)',
            '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
            '--vis-donut-central-label-text-color': 'var(--foreground)',
            '--vis-donut-central-sub-label-text-color':
              'var(--muted-foreground)',
          }"
        >
          <VisSingleContainer
            :data="chartModel.chartData"
            :margin="{ top: 24, bottom: 24 }"
          >
            <VisDonut
              :value="(d: SliceRow) => sliceValue(d)"
              :color="(d: SliceRow) => sliceFillCss(d)"
              :arc-width="30"
              :central-label="chartModel.centralLabel"
            />
            <ChartTooltip
              :triggers="{
                [Donut.selectors.segment]: componentToString(
                  chartModel.chartConfig,
                  ChartTooltipContent,
                  {
                    hideLabel: true,
                    valueFormatter: (n: number) => formatMoney(n),
                  },
                )!,
              }"
            />
          </VisSingleContainer>
        </ChartContainer>
      </ClientOnly>
    </CardContent>
    <CardFooter
      class="flex flex-wrap items-center justify-center gap-2 border-t border-border/50 px-6 pb-6 pt-4 [.border-t]:pt-4"
    >
      <Badge> Entradas </Badge>
      <Badge variant="destructive"> Saídas </Badge>
    </CardFooter>
  </Card>
</template>
