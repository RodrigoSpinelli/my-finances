<script setup lang="ts">
import { parseDate } from "@internationalized/date";
import { CalendarDaysIcon } from "lucide-vue-next";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExpenseDailyRow } from "~/interfaces/dashboard";

const props = defineProps<{
  month: string;
  daily: ExpenseDailyRow[];
  pending?: boolean;
}>();

const { formatMoney } = useCurrencyFormat();

const ym = computed(() => {
  const m = /^(\d{4})-(\d{2})$/.exec(props.month.trim());
  if (!m)
    return { y: new Date().getFullYear(), mo: new Date().getMonth() + 1 };
  return { y: Number(m[1]), mo: Number(m[2]) };
});

const monthStart = computed(() =>
  parseDate(
    `${ym.value.y}-${String(ym.value.mo).padStart(2, "0")}-01`,
  ),
);

const monthEnd = computed(() => {
  const { y, mo } = ym.value;
  const last = new Date(y, mo, 0).getDate();
  return parseDate(
    `${y}-${String(mo).padStart(2, "0")}-${String(last).padStart(2, "0")}`,
  );
});

const monthHeading = computed(() =>
  new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(ym.value.y, ym.value.mo - 1, 1)),
);

const amountByDay = computed(() => {
  const map = new Map<string, number>();
  for (const row of props.daily) {
    if (row.amount > 0)
      map.set(row.date, row.amount);
  }
  return map;
});

const hasExpInMonth = computed(() =>
  props.daily.some((r) => r.amount > 0),
);

function formatDayLabel(amount: number) {
  const full = formatMoney(amount);
  const endsWithCents = /,\d{2}$/.test(full);
  return endsWithCents ? full.slice(0, -3) : full;
}
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
          Gastos por dia
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Total de despesas em cada dia do mês selecionado
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-amber-500/10 p-2.5 text-amber-600 shadow-inner ring-1 ring-amber-500/15 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20"
      >
        <CalendarDaysIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="px-6 pb-6 pt-0">
      <div v-if="pending" class="flex min-h-[280px] flex-col justify-center gap-3 py-1">
        <Skeleton class="mx-auto h-7 w-40 rounded-lg" />
        <Skeleton class="h-[min(320px,45vh)] w-full rounded-xl" />
      </div>
      <div
        v-else-if="!hasExpInMonth"
        class="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-8 text-center"
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
      <div
        v-else
        class="rounded-xl border border-border/40 bg-muted/15 shadow-lg p-3"
      >
        <Calendar
          :key="month"
          :default-placeholder="monthStart"
          :min-value="monthStart"
          :max-value="monthEnd"
          readonly
          fixed-weeks
          locale="pt-BR"
          weekday-format="short"
          disable-days-outside-current-view
          class="border-0 p-0 shadow-none **:data-[slot=calendar-cell-trigger]:h-auto **:data-[slot=calendar-cell-trigger]:min-h-12 **:data-[slot=calendar-cell-trigger]:w-full **:data-[slot=calendar-cell-trigger]:flex-col **:data-[slot=calendar-cell-trigger]:gap-0.5 **:data-[slot=calendar-cell-trigger]:py-1 [&_nav]:hidden"
        >
          <template #calendar-heading>
            <div
              class="mx-auto w-full pt-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {{ monthHeading }}
            </div>
          </template>

          <template
            #cell="{ dateKey, dayValue, outsideView }"
          >
            <span
              class="text-sm font-medium tabular-nums leading-none"
              :class="outsideView ? 'text-muted-foreground' : ''"
            >
              {{
                dayValue
                ?? (dateKey.length >= 10 ? Number(dateKey.slice(8, 10)) : dateKey)
              }}
            </span>
            <span
              v-if="!outsideView && amountByDay.get(dateKey)"
              class="max-w-full truncate px-0.5 text-[10px] font-medium leading-tight text-rose-600 dark:text-rose-400"
            >
              {{ formatDayLabel(amountByDay.get(dateKey)!) }}
            </span>
          </template>
        </Calendar>
      </div>
    </CardContent>
  </Card>
</template>
