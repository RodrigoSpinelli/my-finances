<script setup lang="ts">
import type {
  ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Orientation } from "@unovis/ts"
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue"
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
import { BarChartIcon } from "lucide-vue-next"

const chartData = [
  { date: new Date("2024-01-01"), desktop: 186 },
  { date: new Date("2024-02-01"), desktop: 305 }
]

type Data = typeof chartData[number]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const ACCENT = {
  default: {
    bar: "bg-linear-to-r from-gray-500 via-gray-600 to-gray-700",
    iconBox:
      "rounded-xl bg-gray-500/10 p-2.5 text-gray-600 shadow-inner ring-1 ring-gray-500/15 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
  },
  emerald: {
    bar: "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500",
    iconBox:
      "rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 shadow-inner ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
  sky: {
    bar: "bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500",
    iconBox:
      "rounded-xl bg-sky-500/10 p-2.5 text-sky-600 shadow-inner ring-1 ring-sky-500/15 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20",
  },
  teal: {
    bar: "bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600",
    iconBox:
      "rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 shadow-inner ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
  rose: {
    bar: "bg-linear-to-r from-rose-600 via-red-500 to-red-700",
    iconBox:
      "rounded-xl bg-red-500/10 p-2.5 text-red-600 shadow-inner ring-1 ring-red-500/15 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
  },
} as const
</script>

<template>
  <Card class="group relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6">
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl opacity-95"
      :class="ACCENT.default.bar"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Categorias mais frequentes
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Proporção de transações por categoria
        </p>
      </div>
      <div :class="cn('shrink-0', ACCENT.default.iconBox)">
        <BarChartIcon class="size-5" :stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="px-6 pb-4 pt-0">
      <ChartContainer
        :config="chartConfig"
        class="aspect-auto h-[104px] w-full max-h-[104px]"
      >
        <VisXYContainer
          :data="chartData"
          :margin="{ top: 4, bottom: 4, left: -12, right: 8 }"
        >
          <VisGroupedBar
            :x="(d: Data) => d.date"
            :y="(d: Data) => d.desktop"
            :color="chartConfig.desktop.color"
            :group-max-width="32"
            :rounded-corners="6"
            :orientation="Orientation.Horizontal"
          />
          <VisAxis
            type="y"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-format="(d: number) => {
              const date = new Date(d)
              return date.toLocaleDateString('en-US', {
                month: 'short',
              })
            }"
            :tick-values="chartData.map(d => d.date)"
          />
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })"
            color="#0000"
          />
        </VisXYContainer>
      </ChartContainer>
    </CardContent>
  </Card>
</template>
