<script setup lang="ts">
import type { Component } from "vue";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const ACCENT = {
  default: {
    bar: "bg-linear-to-r from-gray-500 via-gray-600 to-gray-700",
    iconBox:
      "rounded-xl bg-gray-500/10 p-2.5 text-gray-600 shadow-inner ring-1 ring-gray-500/15 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
    sparkline: "text-muted-foreground",
  },
  emerald: {
    bar: "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500",
    iconBox:
      "rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 shadow-inner ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    sparkline: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    bar: "bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500",
    iconBox:
      "rounded-xl bg-sky-500/10 p-2.5 text-sky-600 shadow-inner ring-1 ring-sky-500/15 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20",
    sparkline: "text-sky-600 dark:text-sky-400",
  },
  teal: {
    bar: "bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600",
    iconBox:
      "rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 shadow-inner ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    sparkline: "text-teal-600 dark:text-teal-400",
  },
  rose: {
    bar: "bg-linear-to-r from-rose-600 via-red-500 to-red-700",
    iconBox:
      "rounded-xl bg-red-500/10 p-2.5 text-red-600 shadow-inner ring-1 ring-red-500/15 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
    sparkline: "text-rose-600 dark:text-rose-400",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

const props = defineProps<{
  pending: boolean;
  title: string;
  description: string;
  accent: AccentKey;
  icon: Component;
  /** Valor exibido (moeda) */
  amount: number;
  /** Quando não for `null`, exibe o distintivo de variação percentual */
  changePercent?: number | null;
  /** Legenda curta no rodapé (ex.: “Mês anterior”) */
  footerLabel?: string;
  /** Valor no rodapé em moeda; omitir o label para ocultar o rodapé */
  footerAmount?: number;
  /** Série para mini gráfico (ex.: acumulado dia a dia no mês) */
  trend?: number[] | null;
}>();

function buildSparkline(
  values: number[],
  w = 100,
  h = 38,
): { d: string; lastX: number; lastY: number } | null {
  if (values.length === 0) return null;
  const padX = 2;
  const padY = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max !== min ? max - min : 1;
  const n = values.length;
  let d = "";
  let lastX = w / 2;
  let lastY = h / 2;
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? w / 2 : padX + (i / (n - 1)) * (w - 2 * padX);
    const y = padY + (1 - (values[i]! - min) / range) * (h - 2 * padY);
    d += `${i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`}`;
    lastX = x;
    lastY = y;
  }
  return { d, lastX, lastY };
}

const spark = computed(() => {
  const s = props.trend;
  if (!s?.length) return null;
  return buildSparkline(s);
});

const { money } = useCurrencyFormat();

const pct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

function formatPct(value: number | null): string {
  if (value === null) return "—";
  return pct.format(value / 100);
}

const showFooter = computed(() => Boolean(props.footerLabel?.trim()));
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
    <CardContent class="pt-0" :class="showFooter ? 'pb-4' : 'pb-6'">
      <template v-if="pending">
        <div class="flex items-end justify-between gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton class="h-9 w-[min(100%,11rem)] rounded-lg" />
            <Skeleton class="h-4 w-20 rounded-md" />
          </div>
          <Skeleton
            class="h-10 w-[4.85rem] shrink-0 rounded-md sm:w-22"
            aria-hidden="true"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex items-end justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-end gap-2">
              <span
                class="text-3xl tabular-nums font-bold tracking-tight text-foreground"
                >{{ money.format(amount) }}</span
              >
              <Badge
                v-if="changePercent != null"
                size="sm"
                class="font-medium tabular-nums mb-2"
                :variant="changePercent < 0 ? 'red-light' : 'green-light'"
              >
                <ArrowUpIcon v-if="changePercent >= 0" class="size-3" />
                <ArrowDownIcon v-else class="size-3" />
                {{ formatPct(changePercent) }}
              </Badge>
            </div>
          </div>
          <div
            v-if="spark"
            class="w-[4.85rem] shrink-0 opacity-95 sm:w-22"
            :title="`${title}: tendência diária no mês`"
          >
            <svg
              class="aspect-50/19 block h-9.5 w-full overflow-visible sm:h-10"
              :class="ACCENT[accent].sparkline"
              viewBox="0 0 100 38"
              role="img"
              :aria-label="`${title}: tendência ao longo dos dias do mês`"
            >
              <path
                :d="spark.d"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                :cx="spark.lastX"
                :cy="spark.lastY"
                r="3"
                class="opacity-95"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </template>
    </CardContent>
    <CardFooter
      v-if="showFooter"
      class="flex flex-col items-stretch gap-1 border-t border-border/50 bg-muted/25 px-6 py-3.5 dark:bg-muted/15"
    >
      <template v-if="pending">
        <Skeleton class="h-3 w-24 rounded" />
        <Skeleton class="h-5 w-[min(100%,10rem)] rounded-md" />
      </template>
      <template v-else>
        <p
          class="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/90"
        >
          {{ footerLabel }}
        </p>
        <p
          class="text-sm font-semibold tabular-nums tracking-tight text-foreground/90"
        >
          {{ money.format(footerAmount ?? 0) }}
        </p>
      </template>
    </CardFooter>
  </Card>
</template>
