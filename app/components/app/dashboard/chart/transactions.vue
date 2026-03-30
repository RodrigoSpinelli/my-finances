<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart";
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { BanknoteArrowUp, BanknoteArrowDown } from "lucide-vue-next";

const SLICE_INCOME = "income";
const SLICE_EXPENSE = "expense";

type SliceRow = Record<string, string | number>;

interface MonthFlowResponse {
  month: string;
  income_total: number;
  expense_total: number;
}

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

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Opções fixas do seletor (temporário). */
const MONTH_OPTIONS = [
  { value: "2026-03", label: "Março de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
] as const;

const selectedMonth = ref<string>(MONTH_OPTIONS[0]!.value);

const { data, pending, status } = await useFetch<MonthFlowResponse>(
  "/api/transactions/month-flow",
  {
    query: computed(() => ({ month: selectedMonth.value })),
  },
);

const monthLabel = computed(() => {
  return (
    MONTH_OPTIONS.find((o) => o.value === selectedMonth.value)?.label ?? ""
  );
});

/** Apenas duas fatias: entradas e saídas no mês. */
const chartModel = computed(() => {
  const income = Math.abs(data.value?.income_total ?? 0);
  const expense = Math.abs(data.value?.expense_total ?? 0);

  const chartConfig: ChartConfig = {
    [SLICE_INCOME]: {
      label: "Entradas",
      color: "var(--primary)",
    },
    [SLICE_EXPENSE]: {
      label: "Saídas",
      color: "var(--secondary)",
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
  return { chartData, chartConfig, totalFlow };
});

const hasMovement = computed(() => chartModel.value.chartData.length > 0);
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader class="gap-4 flex flex-wrap items-center justify-between">
      <div class="space-y-1">
        <CardTitle>Transações</CardTitle>
      </div>
      <NativeSelect
        v-model="selectedMonth"
        class="w-[min(100%,220px)] shrink-0"
        aria-label="Mês de referência"
        :disabled="pending || status === 'error'"
      >
        <NativeSelectOption
          v-for="opt in MONTH_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </NativeSelectOption>
      </NativeSelect>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col pb-0">
      <div
        v-if="pending"
        class="text-muted-foreground flex aspect-square max-h-[250px] items-center justify-center text-sm"
      >
        Carregando…
      </div>
      <div
        v-else-if="!hasMovement"
        class="text-muted-foreground flex aspect-square max-h-[250px] flex-col items-center justify-center gap-1 px-4 text-center text-sm"
      >
        <p>Nenhuma entrada ou saída neste mês.</p>
        <p class="text-xs">
          Registre transações em
          <NuxtLink
            to="/transactions"
            class="text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          .
        </p>
      </div>
      <ChartContainer
        v-else
        :config="chartModel.chartConfig"
        class="mx-auto aspect-square max-h-[250px]"
        :style="{
          '--vis-donut-central-label-font-size': 'var(--text-xl)',
          '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
          '--vis-donut-central-label-text-color': 'var(--foreground)',
          '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
        }"
      >
        <VisSingleContainer
          :data="chartModel.chartData"
          :margin="{ top: 30, bottom: 30 }"
        >
          <VisDonut
            :value="(d: SliceRow) => sliceValue(d)"
            :color="
              (d: SliceRow) => chartModel.chartConfig[segmentKey(d)]?.color
            "
            :arc-width="30"
            :central-label-offset-y="10"
            :central-label="money.format(chartModel.totalFlow)"
            :central-sub-label="monthLabel"
          />
          <ChartTooltip
            :triggers="{
              [Donut.selectors.segment]: componentToString(
                chartModel.chartConfig,
                ChartTooltipContent,
                { hideLabel: true },
              )!,
            }"
          />
        </VisSingleContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter class="flex items-center justify-center gap-x-4 border-t">
      <Badge variant="outline">
        <BanknoteArrowUp />
        Entradas
      </Badge>
      <Badge variant="outline">
        <BanknoteArrowDown />
        Saídas
      </Badge>
    </CardFooter>
  </Card>
</template>
