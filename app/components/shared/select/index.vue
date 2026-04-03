<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  label: string;
  value: string;
}

defineProps<{
  options: Option[];
  placeholder: string;
  label?: string;
  disabled?: boolean;
}>();

const model = defineModel<string>();
const id = useId();
</script>

<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id">{{ label }}</Label>
    <Select v-model="model" :disabled="disabled">
      <SelectTrigger class="w-full" :id="id" :disabled="disabled">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
