<script setup lang="ts">
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

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
}>();

const modelValue = defineModel<string | undefined>();

const inputValue = computed({
  get: () => modelValue.value ?? props.value ?? "",
  set: (val: string | undefined) => {
    modelValue.value = val;
  },
});
</script>

<template>
  <div class="grid gap-2">
    <Label v-if="label" for="input"
      >{{ label }} {{ required ? "*" : "" }}</Label
    >
    <InputGroup>
      <InputGroupInput
        v-model="inputValue"
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
