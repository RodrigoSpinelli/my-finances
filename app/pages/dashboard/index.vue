<script setup lang="ts">
import { CalendarArrowDownIcon, WalletIcon } from "lucide-vue-next";
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

const route = useRoute();
const router = useRouter();

const { categories } = storeToRefs(useCategoriesStore());
const { getCategories } = useCategoriesStore();

/** Drawer "Nova transação" — pode ser aberto pela query `?newexpense=true`. */
const transactionDrawerOpen = ref(false);

/** Só abre após carregar a API: a store começa vazia e senão o modal ficaria aberto mesmo com categorias. */
const isOpen = ref(false);

function isNewExpenseQueryTrue(
  q: typeof route.query,
): boolean {
  const raw = q.newexpense;
  if (raw === undefined) return false;
  const s = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  return (
    s === "true" || s === "1" || s === ""
  );
}

function stripNewExpenseFromUrl() {
  if (!("newexpense" in route.query)) return;
  const rest = { ...route.query };
  delete rest.newexpense;
  router.replace({ path: route.path, query: rest });
}

/** Abre o drawer de despesa quando houver categorias e a query solicitar (`/dashboard?newexpense=true`). */
async function maybeOpenExpenseDrawerFromQuery() {
  await getCategories();
  if (!isNewExpenseQueryTrue(route.query)) return;
  if (categories.value.length === 0) return;
  transactionDrawerOpen.value = true;
  stripNewExpenseFromUrl();
}

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

onMounted(async () => {
  await getCategories();
  if (categories.value.length === 0) {
    isOpen.value = true;
  } else {
    await maybeOpenExpenseDrawerFromQuery();
  }
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
          v-model="transactionDrawerOpen"
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
        :icon="CalendarArrowDownIcon"
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
      @submit="maybeOpenExpenseDrawerFromQuery"
    />
  </div>
</template>
