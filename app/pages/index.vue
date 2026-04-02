<script setup lang="ts">
import type { DashboardBalance } from "~/interfaces/balance";
import type { Category } from "~/interfaces/category";
const { data, refresh } = await useFetch<{ categories: Category[] }>(
  "/api/categories",
);

definePageMeta({
  name: "dashboard",
});

useHead({
  title: "Dashboard",
});

const isOpen = computed(() => (data.value?.categories?.length ?? 0) === 0);

const user = useSupabaseUser();

const MONTH_OPTIONS = [
  { value: "2026-03", label: "Março de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
] as const;

const selectedMonth = ref<string>(MONTH_OPTIONS[1]!.value);

const { data: balanceData, pending: balancePending } =
  await useFetch<DashboardBalance>("/api/balance", {
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
      </div>
      <div class="flex items-center gap-2">
        <shared-drawer
          form="transaction"
          title="Nova despesa"
          description="Registre uma nova despesa"
        >
          <template #trigger>
            <Button size="sm" class="group">
              <Icon name="lucide:plus" />
              Nova transação
            </Button>
          </template>
        </shared-drawer>
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
        :month="selectedMonth"
        class="lg:col-span-4 sm:col-span-4"
      />

      <app-dashboard-chart-analysis
        :month="selectedMonth"
        class="sm:col-span-4"
      />
      <app-dashboard-chart-transactions
        :month="selectedMonth"
        class="lg:col-span-2 sm:col-span-2"
      />
      <app-dashboard-chart-categories
        :month="selectedMonth"
        class="lg:col-span-2 sm:col-span-2"
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
