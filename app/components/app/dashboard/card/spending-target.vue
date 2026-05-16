<script setup lang="ts">
import { LayoutGridIcon, SquarePenIcon, TargetIcon } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import type {
  GoalFormIntent,
  GoalPayload,
  MonthlyGoalItem,
} from "~/interfaces/goal";

defineOptions({
  inheritAttrs: false,
});

const { money } = useCurrencyFormat();

const props = defineProps<{
  month: string;
  pending: boolean;
  data: GoalPayload | null;
  class?: string;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();

const categoriesStore = useCategoriesStore();
const { getCategories } = categoriesStore;

const isOpen = ref(false);

const goalFormNonce = ref(0);
/** Estado repassado ao formulário sempre definido antes de `isOpen = true`. */
const goalFormIntent = shallowRef<GoalFormIntent>({
  kind: "create",
  allowGeneral: true,
  takenCategoryIds: [],
});

onMounted(() => void getCategories());

const sortedGoals = computed<MonthlyGoalItem[]>(() => {
  const gs = [...(props.data?.goals ?? [])];
  gs.sort((a, b) => {
    if (a.category_id === null && b.category_id !== null) return -1;
    if (a.category_id !== null && b.category_id === null) return 1;
    const an = a.category?.name ?? "";
    const bn = b.category?.name ?? "";
    return an.localeCompare(bn, "pt-BR");
  });
  return gs;
});

const hasGoals = computed(
  () =>
    !!props.data &&
    sortedGoals.value.length > 0 &&
    sortedGoals.value.some((g) => g.amount > 0),
);

const generalTaken = computed(() =>
  sortedGoals.value.some((g) => g.category_id === null),
);

const takenCategoryIds = computed(() =>
  sortedGoals.value
    .map((g) => g.category_id)
    .filter((cid): cid is string => cid != null),
);

const expenseCategoryIds = computed(() =>
  categoriesStore.categories
    .filter((c) => c.type === "expense")
    .map((c) => c.id),
);

const canAddGoal = computed(() => {
  const exp = expenseCategoryIds.value;
  if (exp.length === 0) return false;
  if (!generalTaken.value) return true;
  const taken = new Set(takenCategoryIds.value);
  return exp.some((id) => !taken.has(id));
});

function rowProgress(row: MonthlyGoalItem) {
  const t = row.amount;
  if (t <= 0) return 0;
  return Math.min(100, (row.spent / t) * 100);
}

function rowLabelPct(row: MonthlyGoalItem): string {
  const t = row.amount;
  if (t <= 0) return "0";
  return Math.round((row.spent / t) * 100).toString();
}

function rowOver(row: MonthlyGoalItem): boolean {
  const t = row.amount;
  if (t <= 0) return false;
  return row.spent > t;
}

function rowTitle(row: MonthlyGoalItem): string {
  if (row.category_id === null) return "Todas as despesas do mês";

  return row.category?.name ?? "Categoria";
}

function openDrawerCreate() {
  goalFormIntent.value = {
    kind: "create",
    allowGeneral: !generalTaken.value,
    takenCategoryIds: [...takenCategoryIds.value],
  };
  goalFormNonce.value++;
  isOpen.value = true;
}

function openDrawerEdit(row: MonthlyGoalItem) {
  goalFormIntent.value = {
    kind: "edit",
    goalId: row.id,
    amount: row.amount,
    category_id: row.category_id,
    categoryLabel: rowTitle(row),
  };
  goalFormNonce.value++;
  isOpen.value = true;
}

const drawerDescription = computed(() => {
  if (goalFormIntent.value.kind === "edit") {
    return "Ajuste o valor ou remova esta meta. O alcance não pode ser alterado.";
  }
  return goalFormIntent.value.allowGeneral
    ? "Escolha entre meta geral (todo o mês) ou uma única categoria de despesa. Cada combinação mês × categoria aceita apenas uma meta."
    : "Defina uma meta para uma categoria que ainda não tenha meta neste mês.";
});

const skeletonRows = computed(() =>
  sortedGoals.value.length > 3 ? sortedGoals.value.length : 4,
);
</script>

<template>
  <Card
    :class="[
      props.class,
      'relative min-h-[148px] overflow-hidden rounded-2xl border-border/50 bg-card/80 shadow-sm ring-1 ring-black/3 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md dark:bg-card/60 dark:ring-white/6',
    ]"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-95"
      aria-hidden="true"
    />
    <CardHeader
      class="flex flex-row flex-wrap items-start justify-between gap-3 border-0 pb-2 pt-6"
    >
      <div class="min-w-0 space-y-0.5">
        <CardTitle
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Metas de gastos
        </CardTitle>
        <p class="text-[13px] text-muted-foreground/80">
          Meta geral (mês inteiro) e metas por categoria de despesa
        </p>
      </div>
      <div
        class="shrink-0 rounded-xl bg-violet-500/10 p-2.5 text-violet-600 shadow-inner ring-1 ring-violet-500/15 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20"
      >
        <TargetIcon class="size-5" stroke-width="2" />
      </div>
    </CardHeader>
    <CardContent class="space-y-4 pb-6 pt-0">
      <template v-if="pending">
        <div
          class="scrollbar-dashboard-goals flex max-h-[min(440px,calc(100vh-10rem))] flex-col gap-3 overflow-y-auto pr-1"
        >
          <div
            v-for="n in skeletonRows"
            :key="n"
            class="rounded-xl border border-border/35 bg-muted/12 p-3"
          >
            <div class="flex items-start justify-between gap-2 pb-3">
              <div class="flex items-center gap-2">
                <Skeleton class="size-8 shrink-0 rounded-lg" />
                <Skeleton class="h-4 w-[min(140px,40vw)] rounded-md" />
              </div>
              <Skeleton class="size-8 shrink-0 rounded-lg" />
            </div>
            <Skeleton class="mb-3 h-3 w-[min(200px,60%)] rounded-md" />
            <Skeleton class="h-3 w-full rounded-full" />
          </div>
        </div>
      </template>

      <div
        v-else-if="!hasGoals"
        class="rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 py-5 text-center"
      >
        <p class="text-sm text-muted-foreground">
          Nenhuma meta definida para este mês.
        </p>
        <button
          type="button"
          class="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          @click="openDrawerCreate"
        >
          Definir agora
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          class="scrollbar-dashboard-goals flex max-h-[min(440px,calc(100vh-10rem))] flex-col gap-4 overflow-y-auto pr-1"
        >
          <div
            v-for="row in sortedGoals"
            :key="row.id"
            class="rounded-xl border border-border/40 bg-muted/15 p-3 shadow-md"
          >
            <div class="flex flex-wrap items-start justify-between gap-2 pb-3">
              <div class="flex min-w-0 flex-1 items-center gap-2.5">
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/85 ring-1 ring-border/55 dark:bg-muted/40"
                  :aria-hidden="row.category === null ? 'true' : undefined"
                >
                  <template v-if="row.category === null">
                    <LayoutGridIcon
                      class="size-4 text-violet-600/90 dark:text-violet-400/90"
                    />
                  </template>
                  <Icon
                    v-else-if="row.category"
                    :name="row.category.icon"
                    class="size-4 shrink-0 text-violet-600/90 dark:text-violet-400/90"
                  />
                </span>
                <div class="min-w-0">
                  <span
                    class="block truncate text-[13px] font-semibold text-foreground"
                  >
                    {{ rowTitle(row) }}
                  </span>
                  <span
                    class="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {{
                      row.category_id === null ? "Despesas do mês" : "Categoria"
                    }}
                  </span>
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-9 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                  :aria-label="
                    row.category_id === null
                      ? 'Editar meta geral'
                      : `Editar meta — ${rowTitle(row)}`
                  "
                  @click="openDrawerEdit(row)"
                >
                  <SquarePenIcon class="size-4" />
                </Button>
              </div>
            </div>
            <div
              class="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1"
            >
              <span class="text-sm font-medium text-muted-foreground"
                >Gasto no período</span
              >
              <span
                class="items-baseline text-base font-bold tabular-nums tracking-tight sm:text-lg"
              >
                {{ money.format(row.spent) }}
                <span class="font-semibold text-muted-foreground"> / </span>
                {{ money.format(row.amount) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="text-muted-foreground">Progresso</span>
              <span
                class="font-semibold tabular-nums"
                :class="rowOver(row) ? 'text-destructive' : 'text-foreground'"
              >
                {{ rowLabelPct(row) }}%
              </span>
            </div>
            <Progress
              class="mt-2 h-2.5"
              :model-value="rowProgress(row)"
              :class="
                rowOver(row)
                  ? 'bg-destructive/25! **:data-[slot=progress-indicator]:bg-destructive!'
                  : ''
              "
            />
          </div>
        </div>

        <div v-if="canAddGoal" class="pt-1">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-border/65 bg-muted/35 py-3 text-[13px] font-semibold text-foreground shadow-xs transition-colors hover:bg-muted/50"
            @click="openDrawerCreate"
          >
            <LayoutGridIcon class="size-4 opacity-85" aria-hidden />
            Adicionar outra meta
          </button>
          <p
            class="mx-auto mt-2 max-w-sm text-center text-[11px] text-muted-foreground"
          >
            Apenas uma meta geral por mês. Por categoria, uma única linha cada —
            sem repetir categorias.
          </p>
        </div>

        <p
          v-else-if="
            expenseCategoryIds.length > 0 ||
            generalTaken === true ||
            takenCategoryIds.length > 0
          "
          class="text-center text-[11px] text-muted-foreground"
        >
          Todas as opções já têm meta ou não há mais categorias de despesa
          disponíveis.
        </p>
      </div>
    </CardContent>

    <shared-drawer
      v-model="isOpen"
      title="Metas de gastos"
      :description="drawerDescription"
      form="setGoals"
      :form-props="{
        month: props.month,
        intent: goalFormIntent,
        formNonce: goalFormNonce,
      }"
      @submit="emit('refresh')"
    />
  </Card>
</template>
