<script setup lang="ts">
import { Progress } from "@/components/ui/progress";
import { TagIcon } from "lucide-vue-next";
import type { CategoryData } from "~/interfaces/dashboard";

const { pending, data } = defineProps<{
  pending: boolean;
  data: CategoryData | null;
}>();

const { preferences } = storeToRefs(useUserStore());

const items = computed(() => data?.items ?? []);
const hasItems = computed(() => items.value.length > 0);
</script>

<template>
  <Card
    class="relative flex flex-col overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Gastos por categoria
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Participação de cada categoria no mês
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-fuchsia-500/10 p-2.5 text-fuchsia-600 shadow-inner ring-1 ring-fuchsia-500/15 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:ring-fuchsia-400/20"
      >
        <TagIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="space-y-3 px-6 pb-6 pt-0">
      <div v-if="pending" class="space-y-4 py-1">
        <div
          v-for="n in 5"
          :key="n"
          class="space-y-2 rounded-xl border border-border/40 bg-muted/15 p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Skeleton class="size-8 rounded-lg" />
              <Skeleton class="h-4 w-28 rounded-md" />
            </div>
            <Skeleton class="h-4 w-10 rounded-md" />
          </div>
          <Skeleton class="h-2.5 w-full rounded-full" />
        </div>
      </div>
      <div
        v-else-if="hasItems"
        class="scrollbar-dashboard-categories max-h-[min(400px,50vh)] space-y-3 overflow-y-auto scroll-smooth pr-1"
      >
        <shared-tooltip
          v-for="category in items"
          :key="category.category_id"
          :title="
            category.total_amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: preferences?.preferred_currency ?? 'BRL',
            })
          "
        >
          <div
            class="space-y-2 rounded-xl border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/30"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2.5">
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/60"
                >
                  <Icon :name="category.icon" class="size-4 shrink-0" />
                </span>
                <span class="truncate text-sm font-medium">{{
                  category.name
                }}</span>
              </div>
              <span
                class="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground"
              >
                {{ category.percentage }}%
              </span>
            </div>
            <Progress :model-value="category.percentage" class="h-2.5" />
          </div>
        </shared-tooltip>
      </div>
      <div
        v-else
        class="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-10 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhum gasto por categoria encontrado.
        </p>
        <p class="mt-2 text-xs text-muted-foreground">
          Registre gastos em
          <NuxtLink
            to="/transactions"
            class="font-medium text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          .
        </p>
      </div>
    </CardContent>
  </Card>
</template>
