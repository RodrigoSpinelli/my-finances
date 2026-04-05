<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart"
import { CurveType } from "@unovis/ts"
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue"
import { ChartLineIcon } from "lucide-vue-next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { ExpenseDailyResponse } from "~/interfaces/dashboard"

const SLICE_KEY = "expense"

const { pending, data } = defineProps<{
  pending: boolean
  data: ExpenseDailyResponse | null
}>()

const { formatMoney } = useCurrencyFormat()

const chartConfig = {
  [SLICE_KEY]: {
    label: "Gastos no dia ",
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
    valueFormatter: (n: number) => formatMoney(n),
  },
)
</script>

<template>
  <Card
    class="relative flex flex-col overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Análise de gastos
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Evolução diária no mês selecionado
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-amber-500/10 p-2.5 text-amber-600 shadow-inner ring-1 ring-amber-500/15 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20"
      >
        <ChartLineIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col px-6 pb-2 pt-0">
      <div
        v-if="pending"
        class="flex min-h-[220px] flex-col justify-center gap-3 py-2"
      >
        <Skeleton class="h-32 w-full rounded-xl" />
        <div class="flex justify-between gap-2">
          <Skeleton class="h-3 w-16 rounded-md" />
          <Skeleton class="h-3 w-12 rounded-md" />
          <Skeleton class="h-3 w-14 rounded-md" />
        </div>
      </div>
      <div
        v-else-if="!hasExpenses"
        class="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-8 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhum gasto registrado neste mês.
        </p>
        <p class="mt-2 text-xs text-muted-foreground">
          Registre despesas em
          <NuxtLink
            to="/transactions"
            class="font-medium text-foreground underline-offset-4 hover:underline"
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
    <CardFooter
      class="border-t border-border/50 px-6 pb-6 pt-4 [.border-t]:pt-4"
    >
      <CardDescription class="w-full text-center sm:text-left">
        <span class="text-muted-foreground">Total no mês</span>
        <span class="mt-0.5 block font-semibold text-foreground tabular-nums">
          {{ monthTotalLabel }}
        </span>
      </CardDescription>
    </CardFooter>
  </Card>
</template>
