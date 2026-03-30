<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart"
import type { Tables } from "~/types/database.types"
import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer } from "@unovis/vue"
import { computed, ref } from "vue"
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
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from "@/components/ui/chart"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

const UNCATEGORIZED_KEY = "_sem_categoria"

const PALETTE_TAILWIND: Record<string, string> = {
  red: "#dc2626",
  yellow: "#ca8a04",
  green: "#16a34a",
  cyan: "#0891b2",
  purple: "#9333ea",
  pink: "#db2777",
}

const CHART_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

type CategoryBrief = Pick<
  Tables<"categories">,
  "id" | "name" | "icon" | "type" | "color"
>

type TransactionRow = Tables<"transactions"> & {
  categories: CategoryBrief | null
}

type SliceRow = Record<string, string | number>

/** Opções fixas do seletor (temporário). */
const MONTH_OPTIONS = [
  { value: "2026-03", label: "Março de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
] as const

function segmentKey(row: SliceRow): string {
  for (const k of Object.keys(row)) {
    if (k !== "fill")
      return k
  }
  return UNCATEGORIZED_KEY
}

function sliceValue(row: SliceRow): number {
  const k = segmentKey(row)
  const v = row[k]
  return typeof v === "number" ? v : Number(v)
}

function expenseInMonth(
  t: TransactionRow,
  monthYm: string,
): boolean {
  if (t.type !== "expense")
    return false
  const d = (t.date ?? "").slice(0, 7)
  return d === monthYm
}

function resolveSegmentColor(
  colorName: string | null | undefined,
  index: number,
): string {
  const hex = colorName && PALETTE_TAILWIND[colorName]
  if (hex)
    return hex
  return CHART_VARS[index % CHART_VARS.length] ?? CHART_VARS[0]
}

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const selectedMonth = ref<string>(MONTH_OPTIONS[0]!.value)

const { data, pending, status } = await useFetch<{
  transactions: TransactionRow[]
}>("/api/transactions")

const transactions = computed(() => data.value?.transactions ?? [])

const chartModel = computed(() => {
  const ym = selectedMonth.value
  const totals = new Map<string, { label: string, color: string | null, amount: number }>()

  for (const t of transactions.value) {
    if (!expenseInMonth(t, ym))
      continue
    const key = t.category_id && t.categories
      ? t.category_id
      : UNCATEGORIZED_KEY
    const label = t.categories?.name ?? "Sem categoria"
    const color = t.categories?.color ?? null
    const prev = totals.get(key)
    const amt = Number(t.amount) || 0
    if (prev)
      prev.amount += amt
    else
      totals.set(key, { label, color, amount: amt })
  }

  const chartConfig: ChartConfig = {}
  const chartData: SliceRow[] = []
  let i = 0
  for (const [id, agg] of totals) {
    if (agg.amount <= 0)
      continue
    const color = resolveSegmentColor(agg.color, i)
    chartConfig[id] = { label: agg.label, color }
    chartData.push({
      [id]: agg.amount,
      fill: `var(--color-${id})`,
    })
    i++
  }

  chartData.sort((a, b) => sliceValue(b) - sliceValue(a))

  const total = chartData.reduce((s, row) => s + sliceValue(row), 0)
  return { chartData, chartConfig, total }
})

const monthLabel = computed(() => {
  return MONTH_OPTIONS.find(o => o.value === selectedMonth.value)?.label ?? ""
})
</script>

<template>
  <Card class="flex flex-col">
    <CardHeader class="gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <CardTitle>Despesas por categoria</CardTitle>
        <CardDescription>
          Total de despesas no mês selecionado.
        </CardDescription>
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
        v-else-if="chartModel.chartData.length === 0"
        class="text-muted-foreground flex aspect-square max-h-[250px] flex-col items-center justify-center gap-1 px-4 text-center text-sm"
      >
        <p>Nenhuma despesa neste mês.</p>
        <p class="text-xs">
          Escolha outro mês ou registre transações em
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
          '--vis-donut-central-label-font-size': 'var(--text-3xl)',
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
            :color="(d: SliceRow) => chartModel.chartConfig[segmentKey(d)]?.color"
            :arc-width="30"
            :central-label-offset-y="10"
            :central-label="money.format(chartModel.total)"
            :central-sub-label="monthLabel"
          />
          <ChartTooltip
            :triggers="{
              [Donut.selectors.segment]: componentToString(chartModel.chartConfig, ChartTooltipContent, { hideLabel: true })!,
            }"
          />
        </VisSingleContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter class="text-muted-foreground text-sm leading-relaxed">
      <p>
        Mostrando só despesas com data em
        <span class="text-foreground font-medium">{{ monthLabel }}</span>.
      </p>
    </CardFooter>
  </Card>
</template>
