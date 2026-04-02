<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart"
import { CurveType } from "@unovis/ts"
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue"
import { TrendingDown } from "lucide-vue-next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartCrosshair,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart"

const SLICE_KEY = "expense"

interface ExpenseDailyRow {
  date: string;
  amount: number;
}

interface ExpenseDailyResponse {
  month: string;
  daily: ExpenseDailyRow[];
  month_total: number;
}

const { pending, data } = defineProps<{
  pending: boolean
  data: ExpenseDailyResponse | null
}>()

const { formatMoney } = useCurrencyFormat()

const chartConfig = {
  [SLICE_KEY]: {
    label: "Gastos no dia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type ChartPoint = { date: Date; expense: number }

const chartData = computed<ChartPoint[]>(() => {
  const rows = data?.daily ?? []
  return rows.map(r => ({
    date: new Date(`${r.date}T12:00:00`),
    expense: r.amount,
  }))
})

const monthTotalLabel = computed(() =>
  formatMoney(data?.month_total ?? 0),
)

const hasExpenses = computed(() => (data?.month_total ?? 0) > 0)

const crosshairTemplate = componentToString(
  chartConfig,
  ChartTooltipContent,
  {
    hideLabel: false,
    labelFormatter: (d: number | Date) =>
      (d instanceof Date ? d : new Date(d)).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
  },
)
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader class="gap-1 border-b">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <CardTitle>Análise de gastos</CardTitle>
        <TrendingDown class="text-muted-foreground size-5 shrink-0" />
      </div>
      <CardDescription>
        Evolução dos gastos por dia no mês · Total: {{ monthTotalLabel }}
      </CardDescription>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col pt-4">
      <div
        v-if="pending"
        class="text-muted-foreground flex min-h-[220px] items-center justify-center text-sm"
      >
        Carregando…
      </div>
      <div
        v-else-if="!hasExpenses"
        class="text-muted-foreground flex min-h-[220px] flex-col items-center justify-center gap-1 px-4 text-center text-sm"
      >
        <p>Nenhum gasto registrado neste mês.</p>
        <p class="text-xs">
          Registre despesas em
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
        :config="chartConfig"
        class="min-h-[220px] w-full"
      >
        <VisXYContainer
          :data="chartData"
          :margin="{ left: -24 }"
          :y-domain="[0, undefined]"
        >
          <VisLine
            :x="(d: ChartPoint) => d.date"
            :y="(d: ChartPoint) => d.expense"
            :color="chartConfig.expense.color"
            :curve-type="CurveType.Linear"
          />
          <VisAxis
            type="x"
            :x="(d: ChartPoint) => d.date"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-format="(d: number) =>
              new Date(d).toLocaleDateString('pt-BR', { day: 'numeric' })"
            :tick-values="chartData.map(d => d.date)"
          />
          <VisAxis
            type="y"
            :num-ticks="3"
            :tick-line="false"
            :domain-line="false"
          />
          <ChartTooltip />
          <ChartCrosshair
            v-if="crosshairTemplate"
            :template="crosshairTemplate"
            :color="chartConfig.expense.color"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
  </Card>
</template>
