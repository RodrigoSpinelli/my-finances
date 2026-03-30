<script setup lang="ts">
import type { DashboardBalance } from "~/interfaces/balance";
import { WalletMinimalIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-vue-next";

defineProps<{
  data: DashboardBalance | null;
  pending: boolean;
}>();

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const pct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

function formatPct(value: number | null): string {
  if (value === null) return "—";
  return pct.format(value / 100);
}
</script>

<template>
  <Card>
    <CardHeader
      class="gap-4 flex flex-wrap items-center justify-between border-b"
    >
      <CardTitle>Saldo anterior</CardTitle>
      <WalletMinimalIcon />
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">
          {{ pending ? "…" : money.format(data?.previous_balance ?? 0) }}
        </h3>
        <Badge
          v-if="data?.previous_change_percent != null"
          size="sm"
          :variant="
            data.previous_change_percent < 0 ? 'destructive' : 'outline'
          "
        >
          <ArrowUpIcon
            v-if="data.previous_change_percent >= 0"
            class="size-3"
          />
          <ArrowDownIcon v-else class="size-3" />
          {{ formatPct(data.previous_change_percent) }}
        </Badge>
        <Badge v-else size="sm" variant="outline">—</Badge>
      </div>
    </CardContent>
  </Card>
</template>
