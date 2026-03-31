<script setup lang="ts">
import { CrosshairIcon } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MonthlySpendingGoalPayload } from "~/interfaces/monthly-spending-goal";
import { getFetchErrorMessage } from "~/utils/fetch-error";

const {
  display,
  setFromNumber,
  clear,
  numeric,
  handleKeydown,
  handlePaste,
  handleInput,
} = useMoneyInput();

const props = defineProps<{
  month: string;
  data: MonthlySpendingGoalPayload | null;
  pending: boolean;
}>();

const emit = defineEmits<{
  (e: "saved"): void;
}>();

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const goalDialogOpen = ref(false);
const saving = ref(false);

const hasGoal = computed(() => (props.data?.goal?.amount ?? 0) > 0);

const progressPercent = computed(() => {
  const target = props.data?.goal?.amount ?? 0;
  if (target <= 0) return 0;
  const spent = props.data?.spent ?? 0;
  return Math.min(100, (spent / target) * 100);
});

function openGoalDialog() {
  if (props.data?.goal) setFromNumber(props.data.goal.amount);
  else clear();
  goalDialogOpen.value = true;
}

function onGoalAmountKeydown(e: KeyboardEvent) {
  handleKeydown(e);
  if (e.key === "Enter") {
    e.preventDefault();
    void saveGoal();
  }
}

async function saveGoal() {
  const amount = numeric.value;
  if (amount <= 0) {
    useToast({
      type: "error",
      title: "Valor inválido",
      description: "Informe um valor maior que zero.",
    });
    return;
  }
  saving.value = true;
  try {
    await $fetch("/api/monthly-spending-goal", {
      method: "PUT",
      body: { month: props.month, amount },
    });
    useToast({
      type: "success",
      title: "Meta salva",
      description: "Sua meta mensal foi atualizada.",
    });
    goalDialogOpen.value = false;
    emit("saved");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description: getFetchErrorMessage(
        error,
        "Não foi possível salvar a meta.",
      ),
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Card>
    <CardHeader
      class="gap-4 flex flex-wrap items-center justify-between border-b"
    >
      <CardTitle>Meta de gastos do mês</CardTitle>
      <CrosshairIcon />
    </CardHeader>
    <CardContent>
      <div v-if="pending" class="text-muted-foreground text-sm">
        Carregando…
      </div>
      <div
        v-else-if="!hasGoal"
        class="text-muted-foreground text-sm flex flex-wrap items-center gap-x-2 gap-y-1"
      >
        Nenhuma meta definida para este mês.
        <button
          type="button"
          class="text-foreground font-semibold underline-offset-4 hover:underline cursor-pointer inline p-0 border-0 bg-transparent text-sm"
          @click="openGoalDialog"
        >
          Definir agora
        </button>
      </div>
      <div v-else class="grid space-y-2">
        <div class="flex flex-wrap items-center justify-between mb-1 gap-2">
          <span class="text-sm text-muted-foreground">Gasto no mês</span>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span class="text-base font-semibold tabular-nums">
              {{ money.format(data?.spent ?? 0) }} /
              {{ money.format(data?.goal?.amount ?? 0) }}
            </span>
            <button
              type="button"
              class="text-muted-foreground text-xs underline-offset-4 hover:underline cursor-pointer p-0 border-0 bg-transparent shrink-0"
              @click="openGoalDialog"
            >
              Alterar meta
            </button>
          </div>
        </div>
        <Progress :model-value="progressPercent" />
      </div>
    </CardContent>
    <Dialog v-model:open="goalDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Meta de gastos</DialogTitle>
          <DialogDescription>
            Defina quanto deseja gastar no mês selecionado no painel. O
            progresso usa apenas despesas registradas naquele mês.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-2 py-2">
          <Label for="goal-amount">Valor da meta (R$)</Label>
          <Input
            id="goal-amount"
            :model-value="display"
            type="text"
            inputmode="decimal"
            placeholder="Como na maquininha: 150000 = 1.500,00"
            autocomplete="off"
            @update:model-value="() => {}"
            @keydown="onGoalAmountKeydown"
            @paste="handlePaste"
            @input="handleInput"
          />
        </div>
        <DialogFooter class="gap-2">
          <Button
            type="button"
            variant="outline"
            :disabled="saving"
            @click="goalDialogOpen = false"
          >
            Cancelar
          </Button>
          <Button type="button" :disabled="saving" @click="saveGoal">
            {{ saving ? "Salvando…" : "Salvar" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Card>
</template>
