<script setup lang="ts">
import type { Component } from "vue"
import type { DashboardBalance } from "~/interfaces/balance"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-vue-next"
import { cn } from "@/lib/utils"

const ACCENT = {
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
} as const

type AccentKey = keyof typeof ACCENT

const props = defineProps<{
  data: DashboardBalance | null
  pending: boolean
  title: string
  description: string
  /** Cor do degradê superior e do bloco do ícone */
  accent: AccentKey
  icon: Component
  /** Qual par de campos de `data` exibir */
  variant: "current" | "previous"
}>()

const { money } = useCurrencyFormat()

const pct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
})

function formatPct(value: number | null): string {
  if (value === null) return "—"
  return pct.format(value / 100)
}

const amount = computed(() => {
  if (props.variant === "current") return props.data?.current_balance ?? 0
  return props.data?.previous_balance ?? 0
})

const changePercent = computed(() => {
  if (props.variant === "current") return props.data?.current_change_percent
  return props.data?.previous_change_percent
})
</script>

<template>
  <Card
    class="group relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl opacity-95"
      :class="ACCENT[accent].bar"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {{ title }}
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          {{ description }}
        </p>
      </div>
      <div :class="cn('shrink-0', ACCENT[accent].iconBox)">
        <component :is="icon" class="size-5" :stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="pb-6 pt-0">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <template v-if="pending">
          <div class="flex w-full flex-col gap-2">
            <Skeleton class="h-9 w-[min(100%,11rem)] rounded-lg" />
            <Skeleton class="h-4 w-20 rounded-md" />
          </div>
        </template>
        <template v-else>
          <p
            class="text-3xl font-bold tracking-tight text-foreground tabular-nums"
          >
            {{ money.format(amount) }}
          </p>
          <Badge
            v-if="changePercent != null"
            size="sm"
            class="shrink-0 font-medium tabular-nums"
            :variant="changePercent < 0 ? 'red-light' : 'green-light'"
          >
            <ArrowUpIcon v-if="changePercent >= 0" class="size-3" />
            <ArrowDownIcon v-else class="size-3" />
            {{ formatPct(changePercent) }}
          </Badge>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
