<script setup lang="ts">
import type { DashboardBalance } from "~/interfaces/balance";
import type { Category } from "~/interfaces/category";
import type { MonthlySpendingGoalPayload } from "~/interfaces/monthly-spending-goal";

const { data, refresh } = await useFetch<{ categories: Category[] }>(
  "/api/categories",
);

const isOpen = computed(() => (data.value?.categories?.length ?? 0) === 0);

const user = useSupabaseUser();

const MONTH_OPTIONS = [
  { value: "2026-03", label: "Março de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
] as const;

const selectedMonth = ref<string>(MONTH_OPTIONS[0]!.value);

const { data: balanceData, pending: balancePending } =
  await useFetch<DashboardBalance>("/api/balance", {
    query: computed(() => ({ month: selectedMonth.value })),
    watch: [selectedMonth],
  });

const {
  data: spendingGoalData,
  pending: spendingGoalPending,
  refresh: refreshSpendingGoal,
} = await useFetch<MonthlySpendingGoalPayload>("/api/monthly-spending-goal", {
  query: computed(() => ({ month: selectedMonth.value })),
  watch: [selectedMonth],
});
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-4 p-6">
    <div class="flex items-center justify-between">
      <div class="grid gap-4">
        <h1 class="text-2xl font-semibold tracking-tight">
          Bem-vindo(a), {{ user?.user_metadata?.display_name }}!
        </h1>
        <p class="text-muted-foreground text-sm">
          Use o menu para gerenciar
          <NuxtLink
            to="/categories"
            class="text-foreground underline-offset-4 hover:underline"
          >
            categorias
          </NuxtLink>
          e
          <NuxtLink
            to="/transactions"
            class="text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          ou abra o
          <NuxtLink
            to="/profile"
            class="text-foreground underline-offset-4 hover:underline"
          >
            perfil
          </NuxtLink>
          .
        </p>
      </div>
      <NativeSelect
        v-model="selectedMonth"
        class="w-[min(100%,220px)] shrink-0"
        aria-label="Mês de referência"
      >
        <NativeSelectOption
          v-for="opt in MONTH_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </NativeSelectOption>
      </NativeSelect>
    </div>

    <div class="grid grid-cols-8 gap-6">
      <app-dashboard-card-balance
        :data="balanceData ?? null"
        :pending="balancePending"
        class="col-span-2"
      />
      <app-dashboard-card-previous-balance
        :data="balanceData ?? null"
        :pending="balancePending"
        class="col-span-2"
      />

      <app-dashboard-card-spending-target
        :month="selectedMonth"
        :data="spendingGoalData ?? null"
        :pending="spendingGoalPending"
        class="col-span-4"
        @saved="refreshSpendingGoal"
      />

      <app-dashboard-chart-analysis
        :data="balanceData"
        :pending="balancePending"
        class="col-span-4"
      />
      <app-dashboard-chart-transactions
        :month="selectedMonth"
        class="col-span-2"
      />
      <app-dashboard-chart-categories
        :month="selectedMonth"
        class="col-span-2"
      />
    </div>
    <shared-dialog
      v-model="isOpen"
      title="Escolha suas primeiras categorias"
      description="Selecione as categorias iniciais que você irá utilizar no seu controle financeiro. Isso ajudará a personalizar sua experiência. Você poderá adicionar ou editar categorias depois, se quiser."
      form="firstCategories"
      @submit="refresh"
    >
      <Button>Nova categoria principal</Button>
    </shared-dialog>
  </div>
</template>
