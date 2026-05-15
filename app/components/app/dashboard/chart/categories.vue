<script setup lang="ts">
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagIcon } from "lucide-vue-next";
import type { CategoryData } from "~/interfaces/dashboard";
import type { TransactionWithCategory } from "~/interfaces/transaction";

const FETCH_LIMIT = 50;

const { pending, data } = defineProps<{
  pending: boolean;
  data: CategoryData | null;
}>();

const { preferences } = storeToRefs(useUserStore());

const items = computed(() => data?.items ?? []);
const hasItems = computed(() => items.value.length > 0);
const referenceMonth = computed(() => data?.month ?? null);

const currency = computed(
  () => preferences.value?.preferred_currency ?? "BRL",
);

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: currency.value,
  });
}

/** `${month}::${categoryId}` → lista já buscada. */
const listsCache = reactive<
  Record<string, { txs: TransactionWithCategory[]; total: number }>
>({});
/** idle | loading | done | error */
const fetchPhase = reactive<Record<string, string>>({});

watch(referenceMonth, () => {
  for (const k of Object.keys(listsCache))
    delete listsCache[k];
  for (const k of Object.keys(fetchPhase))
    delete fetchPhase[k];
});

function cacheKey(categoryId: string): string | null {
  const m = referenceMonth.value;
  return m ? `${m}::${categoryId}` : null;
}

async function fetchSpendings(categoryId: string) {
  const ck = cacheKey(categoryId);
  const m = referenceMonth.value;
  if (!ck || !m)
    return;
  const phase = fetchPhase[ck];
  if (phase === "loading" || phase === "done")
    return;

  fetchPhase[ck] = "loading";
  try {
    const res = await $fetch<{
      transactions: TransactionWithCategory[];
      total: number;
    }>("/api/transactions", {
      query: {
        categoryId,
        month: m,
        type: "expense",
        page: 1,
        pageSize: FETCH_LIMIT,
      },
    });
    listsCache[ck] = {
      txs: res.transactions ?? [],
      total: res.total ?? 0,
    };
    fetchPhase[ck] = "done";
  }
  catch {
    fetchPhase[ck] = "error";
  }
}

function onPopoverOpen(categoryId: string, open: boolean) {
  if (open)
    void fetchSpendings(categoryId);
}

function txLabel(t: TransactionWithCategory): string {
  const d = t.description?.trim();
  if (d)
    return d;
  const m = t.merchant?.trim();
  if (m)
    return m;
  return "Sem descrição";
}

/** Evita UTC deslocar o dia exibido. */
function txDateShort(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function categoryPhase(cid: string): string | undefined {
  const ck = cacheKey(cid);
  return ck ? fetchPhase[ck] : undefined;
}

function categoryList(cid: string) {
  const ck = cacheKey(cid);
  return ck ? listsCache[ck] : undefined;
}

/** Quando o total do servidor excede os itens já carregados. */
function spendingsOverflowNote(cid: string): { total: number } | null {
  if (categoryPhase(cid) !== "done")
    return null;
  const l = categoryList(cid);
  if (!l || l.total <= l.txs.length)
    return null;
  return { total: l.total };
}
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
          Clique numa categoria para ver os lançamentos do mês
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
        <Popover
          v-for="category in items"
          :key="category.category_id"
          @update:open="(open) => onPopoverOpen(category.category_id, open)"
        >
          <PopoverTrigger as-child>
            <button
              type="button"
              class="group cursor-pointer flex w-full flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3 text-left transition-all hover:border-fuchsia-500/25 hover:bg-muted/35 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              :aria-label="`Ver lançamentos de ${category.name}`"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex min-w-0 items-center gap-2.5">
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/60 transition group-hover:ring-fuchsia-500/40"
                  >
                    <Icon
                      :name="category.icon"
                      class="size-4 shrink-0 text-fuchsia-600/90 dark:text-fuchsia-400/90"
                    />
                  </span>
                  <span
                    class="truncate text-sm font-medium group-hover:text-foreground"
                  >
                    {{ category.name }}
                  </span>
                </div>
                <span
                  class="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground sm:text-sm"
                  :title="
                    category.total_amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency,
                    })
                  "
                >
                  {{ category.percentage }}%
                </span>
              </div>
              <Progress
                :model-value="category.percentage"
                class="h-2.5 transition group-hover:h-3"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            class="w-[min(100vw-2rem,22rem)] border-border/70 p-0 shadow-xl sm:w-[24rem]"
            align="center"
            :side-offset="6"
          >
            <div
              class="border-b border-border/60 bg-muted/35 px-4 py-3"
              :style="{ borderBottomColor: `${category.color_hex}33` }"
            >
              <div class="flex items-start gap-3">
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/85 ring-1 ring-border/50"
                >
                  <Icon :name="category.icon" class="size-5" />
                </span>
                <div class="min-w-0 flex-1 pt-0.5">
                  <p class="text-sm font-semibold leading-snug tracking-tight">
                    {{ category.name }}
                  </p>
                  <p class="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Total no mês
                  </p>
                  <p
                    class="text-lg font-semibold tabular-nums tracking-tight text-rose-600 dark:text-rose-400"
                  >
                    {{ formatMoney(category.total_amount) }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="max-h-[min(320px,calc(100vh-12rem))] overflow-y-auto scroll-smooth p-3"
            >
              <template v-if="categoryPhase(category.category_id) === 'loading'">
                <div class="flex flex-col gap-2 px-1 py-4">
                  <Skeleton
                    v-for="line in 4"
                    :key="line"
                    class="h-14 w-full rounded-lg"
                  />
                </div>
              </template>
              <p
                v-else-if="categoryPhase(category.category_id) === 'error'"
                class="px-2 py-6 text-center text-sm text-muted-foreground"
              >
                Não foi possível carregar os lançamentos.
              </p>
              <ul
                v-else-if="categoryList(category.category_id)?.txs.length"
                class="flex flex-col gap-1"
              >
                <li
                  v-for="t in categoryList(category.category_id)!.txs"
                  :key="t.id"
                  class="rounded-lg px-3 py-2.5 ring-1 ring-border/40 transition-colors hover:bg-muted/50"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium">
                        {{ txLabel(t) }}
                      </p>
                      <time
                        :datetime="t.date"
                        class="mt-0.5 block text-[11px] text-muted-foreground"
                      >
                        {{ txDateShort(t.date) }}
                      </time>
                    </div>
                    <span
                      class="shrink-0 text-sm font-semibold tabular-nums text-rose-600 dark:text-rose-400"
                    >
                      {{ formatMoney(Number(t.amount)) }}
                    </span>
                  </div>
                </li>
              </ul>
              <p
                v-else
                class="px-2 py-8 text-center text-sm text-muted-foreground"
              >
                Nenhum lançamento em despesas para esta categoria no período.
              </p>
              <p
                v-if="spendingsOverflowNote(category.category_id)"
                class="mt-2 px-3 pb-2 text-[11px] leading-relaxed text-muted-foreground"
              >
                Exibindo até {{ FETCH_LIMIT }} de
                {{ spendingsOverflowNote(category.category_id)!.total }}
                registros neste período.
              </p>
            </div>
          </PopoverContent>
        </Popover>
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
