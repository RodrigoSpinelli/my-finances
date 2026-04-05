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
import { Badge } from "@/components/ui/badge";
import { BanknoteArrowUp, BanknoteArrowDown, LandmarkIcon } from "lucide-vue-next";
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

/** Opções fixas do seletor (temporário). */
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
  <Card class="flex flex-col">
    <CardHeader class="gap-4 flex flex-wrap items-center justify-between border-b">
      <CardTitle>Transações</CardTitle>
      <LandmarkIcon />
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
          '--vis-donut-central-label-font-size': 'var(--text-2xl)',
          '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
          '--vis-donut-central-label-text-color': 'var(--foreground)',
          '--vis-donut-central-sub-label-text-color': 'var(--muted-foreground)',
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
