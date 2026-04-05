<script setup lang="ts">
import { WalletIcon, WalletMinimalIcon } from "lucide-vue-next";
import type { DashboardBalance } from "~/interfaces/balance";
import type { GoalPayload } from "~/interfaces/goal";
import type {
  ExpenseDailyResponse,
  MonthFlowResponse,
  CategoryData,
} from "~/interfaces/dashboard";

definePageMeta({
  name: "dashboard",
});

useHead({
  title: "Dashboard",
});

const { categories } = storeToRefs(useCategoriesStore());
const { getCategories } = useCategoriesStore();

const isOpen = ref(categories.value.length === 0);

const user = useSupabaseUser();

const { month, monthOptions } = await useDashboardMonthSelect();

const {
  data: balanceData,
  pending: balancePending,
  refresh: balanceRefresh,
} = await useFetch<DashboardBalance>("/api/balance", {
  query: computed(() => ({ month: month.value })),
  watch: [month],
});

const {
  data: expenseDailyData,
  pending: expenseDailyPending,
  refresh: expenseDailyRefresh,
} = await useFetch<ExpenseDailyResponse>("/api/transactions/expense-daily", {
  query: computed(() => ({ month: month.value })),
  watch: [month],
});

const {
  data: goalData,
  pending: goalPending,
  refresh: goalRefresh,
} = await useFetch<GoalPayload>("/api/monthly-spending-goal", {
  query: computed(() => ({ month: month.value })),
  watch: [month],
});

const {
  data: monthFlowData,
  pending: monthFlowPending,
  refresh: monthFlowRefresh,
} = await useFetch<MonthFlowResponse>("/api/transactions/month-flow", {
  query: computed(() => ({ month: month.value })),
  watch: [month],
});

const {
  data: categoriesData,
  pending: categoriesPending,
  refresh: categoriesRefresh,
} = await useFetch<CategoryData>("/api/categories/top", {
  query: computed(() => ({ month: month.value })),
  watch: [month],
});

const monthExpenseTotal = computed(
  () => expenseDailyData.value?.month_total ?? 0,
)

const getAll = async () => {
  await Promise.all([
    balanceRefresh(),
    expenseDailyRefresh(),
    goalRefresh(),
    monthFlowRefresh(),
    categoriesRefresh(),
  ]);
};

onMounted(() => {
  getCategories();
});
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-4 p-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
    >
      <div class="grid gap-4">
        <h1 class="text-2xl font-semibold tracking-tight">
          Bem-vindo(a), {{ user?.user_metadata?.display_name }}!
        </h1>
      </div>
      <div class="flex items-center space-x-2">
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
          class="flex-1 sm:w-[min(100%,220px)] shrink-0"
          aria-label="Mês de referência"
        >
          <NativeSelectOption
            v-for="opt in monthOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
    <div class="grid lg:grid-cols-9 sm:grid-cols-4 grid-cols-1 gap-6">
      <app-dashboard-card-balance-stat
        :data="balanceData ?? null"
        :pending="balancePending"
        variant="current"
        title="Saldo atual"
        description="Posição consolidada no mês"
        accent="emerald"
        :icon="WalletIcon"
        class="sm:col-span-3"
      />
      <app-dashboard-card-balance-stat
        :data="balanceData ?? null"
        :pending="balancePending"
        variant="previous"
        title="Saldo anterior"
        description="Referência do mês passado"
        accent="sky"
        :icon="WalletMinimalIcon"
        class="sm:col-span-3"
      />
      <app-dashboard-card-month-total-expense
        :pending="expenseDailyPending"
        :total="monthExpenseTotal"
        class="sm:col-span-3"
      />
      <app-dashboard-chart-categories
        :pending="categoriesPending"
        :data="categoriesData ?? null"
        class="lg:col-span-4 sm:col-span-4"
      />

      <app-dashboard-chart-analysis
        :pending="expenseDailyPending"
        :data="expenseDailyData ?? null"
        class="sm:col-span-5"
      />
      <app-dashboard-chart-transactions
        :pending="monthFlowPending"
        :data="monthFlowData ?? null"
        class="lg:col-span-3 sm:col-span-3"
      />
      <app-dashboard-card-spending-target
        :month="month"
        :pending="goalPending"
        :data="goalData ?? null"
        @refresh="getAll"
        class="lg:col-span-6 sm:col-span-6"
      />
    </div>
    <shared-dialog
      v-model="isOpen"
      title="Escolha suas primeiras categorias"
      description="Selecione as categorias iniciais que você irá utilizar no seu controle financeiro. Isso ajudará a personalizar sua experiência. Você poderá adicionar ou editar categorias depois, se quiser."
      form="firstCategories"
      @submit="getCategories"
    />
  </div>
</template>
