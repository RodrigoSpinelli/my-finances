<script setup lang="ts">
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  centsToDisplayString,
  modelStringToCents,
  onMoneyInput,
  onMoneyKeydown,
  onMoneyPaste,
} from "~/utils/money-input";

const props = defineProps<{
  placeholder?: string;
  icon?: string;
  readonly?: boolean;
  value?: string;
  required?: boolean;
  label?: string;
  type?: HTMLInputElement["type"];
  disabled?: boolean;
  maxlength?: number | string;
  minlength?: number | string;
  /** Buffer de centavos (POS) + exibição pt-BR; evita estados quebrados no digitar. */
  moneyBr?: boolean;
}>();

const modelValue = defineModel<string | undefined>();

const cents = ref(0);

const moneyDisplay = computed(() => centsToDisplayString(cents.value));

watch(
  () => modelValue.value,
  (v) => {
    if (!props.moneyBr)
      return;
    const next = modelStringToCents(String(v ?? ""));
    if (next !== cents.value)
      cents.value = next;
  },
  { immediate: true },
);

watch(
  cents,
  (c) => {
    if (!props.moneyBr)
      return;
    const s = centsToDisplayString(c);
    if (modelValue.value !== s)
      modelValue.value = s;
  },
  { immediate: true },
);

const plainInput = computed({
  get: () => modelValue.value ?? props.value ?? "",
  set: (val: string | undefined) => {
    modelValue.value = val;
  },
});

function onMoneyBrKeydown(e: KeyboardEvent) {
  onMoneyKeydown(e, cents);
}

function onMoneyBrPaste(e: ClipboardEvent) {
  onMoneyPaste(e, cents);
}

function onMoneyBrInput(e: Event) {
  onMoneyInput(e, cents);
}
</script>

<template>
  <div class="grid gap-2">
    <Label v-if="label" for="input"
      >{{ label }} {{ required ? "*" : "" }}</Label
    >
    <InputGroup>
      <InputGroupInput
        v-if="moneyBr"
        :model-value="moneyDisplay"
        :placeholder="placeholder"
        :inputmode="'decimal'"
        :aria-readonly="readonly"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :type="'text'"
        :minlength="minlength"
        :maxlength="maxlength"
        @update:model-value="() => {}"
        @keydown="onMoneyBrKeydown"
        @paste="onMoneyBrPaste"
        @input="onMoneyBrInput"
      />
      <InputGroupInput
        v-else
        v-model="plainInput"
        :placeholder="placeholder"
        :aria-readonly="readonly"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :type="type"
        :minlength="minlength"
        :maxlength="maxlength"
      />
      <InputGroupAddon>
        <Icon v-if="icon" :name="icon" />
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
