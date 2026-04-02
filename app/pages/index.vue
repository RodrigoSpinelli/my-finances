<script setup lang="ts">
import type { DashboardBalance } from "~/interfaces/balance";
import type { Category } from "~/interfaces/category";
import type { GoalPayload } from "~/interfaces/goal";

const { data, refresh } = await useFetch<{ categories: Category[] }>(
  "/api/categories",
);

definePageMeta({
  name: "dashboard",
});

useHead({
  title: "Dashboard",
});

interface ExpenseDailyRow {
  date: string;
  amount: number;
}

interface ExpenseDailyResponse {
  month: string;
  daily: ExpenseDailyRow[];
  month_total: number;
}

interface MonthFlowResponse {
  month: string;
  income_total: number;
  expense_total: number;
}

interface ItemsData {
  category_id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string;
  color_hex: string;
  transaction_count: number;
  total_amount: number;
  percentage: number;
}

interface CategoryData {
  month: string;
  type: TransactionType | "all";
  items: ItemsData[];
}

const isOpen = computed(() => (data.value?.categories?.length ?? 0) === 0);

const user = useSupabaseUser();

const MONTH_OPTIONS = [
  { value: "2026-03", label: "Março de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
] as const;

const month = ref<string>(MONTH_OPTIONS[1]!.value);

const { data: balanceData, pending: balancePending, refresh: balanceRefresh } =  
  await useFetch<DashboardBalance>("/api/balance", {
    query: computed(() => ({ month: month.value })),
    watch: [month],
  });



const { data: expenseDailyData, pending: expenseDailyPending, refresh: expenseDailyRefresh } =
  await useFetch<ExpenseDailyResponse>("/api/transactions/expense-daily", {
    query: computed(() => ({ month: month.value })),
    watch: [month],
  });

const { data: goalData, pending: goalPending, refresh: goalRefresh } = await useFetch<GoalPayload>(
  "/api/monthly-spending-goal",
  {
    query: computed(() => ({ month: month.value })),
    watch: [month],
  },
);

const { data: monthFlowData, pending: monthFlowPending, refresh: monthFlowRefresh } =
  await useFetch<MonthFlowResponse>("/api/transactions/month-flow", {
    query: computed(() => ({ month: month.value })),
    watch: [month],
  });



const {
  data: categoriesData,
  pending: categoriesPending,
  refresh: categoriesRefresh,
} = await useFetch<CategoryData>("/api/categories/top");

const getAll = async () => {
  await Promise.all([
    balanceRefresh(),
    expenseDailyRefresh(),
    goalRefresh(),
    monthFlowRefresh(),
    categoriesRefresh(),
  ]);
};
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-4 p-6">
    <div class="flex items-center justify-between">
      <div class="grid gap-4">
        <h1 class="text-2xl font-semibold tracking-tight">
          Bem-vindo(a), {{ user?.user_metadata?.display_name }}!
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <shared-drawer
          form="transaction"
          title="Nova despesa"
          description="Registre uma nova despesa"
          @submit="getAll"
        >
          <template #trigger>
            <Button size="sm" class="group">
              <Icon name="lucide:plus" />
              Nova transação
            </Button>
          </template>
        </shared-drawer>
        <NativeSelect
          v-model="month"
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
    </div>

    <div class="grid lg:grid-cols-8 sm:grid-cols-4 grid-cols-1 gap-6">
      <app-dashboard-card-balance
        :data="balanceData ?? null"
        :pending="balancePending"
        class="sm:col-span-2"
      />
      <app-dashboard-card-previous-balance
        :data="balanceData ?? null"
        :pending="balancePending"
        class="sm:col-span-2"
      />

      <app-dashboard-card-spending-target
        :month="month"
        :pending="goalPending"
        :data="goalData ?? null"
        @refresh="refresh"
        class="lg:col-span-4 sm:col-span-4"
      />

      <app-dashboard-chart-analysis
        :pending="expenseDailyPending"
        :data="expenseDailyData ?? null"
        class="sm:col-span-4"
      />
      <app-dashboard-chart-transactions
        :pending="monthFlowPending"
        :data="monthFlowData ?? null"
        class="lg:col-span-2 sm:col-span-2"
      />
      <app-dashboard-chart-categories
        :pending="categoriesPending"
        :data="categoriesData ?? null"
        class="lg:col-span-2 sm:col-span-2"
      />
    </div>
    <shared-dialog
      v-model="isOpen"
      title="Escolha suas primeiras categorias"
      description="Selecione as categorias iniciais que você irá utilizar no seu controle financeiro. Isso ajudará a personalizar sua experiência. Você poderá adicionar ou editar categorias depois, se quiser."
      form="firstCategories"
      @submit="refresh"
    />
  </div>
</template>
