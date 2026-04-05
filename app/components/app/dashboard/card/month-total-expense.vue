<script setup lang="ts">
import { ReceiptTextIcon } from "lucide-vue-next"

defineProps<{
  pending: boolean
  /** Soma das despesas do mês (valor absoluto) */
  total: number
}>()

const { money } = useCurrencyFormat()
</script>

<template>
  <Card
    class="group relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-rose-600 via-red-500 to-red-700 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Gasto total do mês
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Soma de todas as despesas no período
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-red-500/10 p-2.5 text-red-600 shadow-inner ring-1 ring-red-500/15 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20"
      >
        <ReceiptTextIcon class="size-5" :stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="pb-6 pt-0">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <template v-if="pending">
          <div class="flex w-full flex-col gap-2">
            <Skeleton class="h-9 w-[min(100%,11rem)] rounded-lg" />
            <Skeleton class="h-4 w-32 rounded-md" />
          </div>
        </template>
        <p
          v-else
          class="text-3xl font-bold tracking-tight text-foreground tabular-nums"
        >
          {{ money.format(total) }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
