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
  id?: string;
}>();

const model = defineModel<string>();
</script>

<template>
  <Select v-model="model">
    <SelectTrigger class="w-full" :id="id">
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
      <SelectItem v-if="options.length === 0" :disabled="true" value="">
        Não encontramos nada.
      </SelectItem>
    </SelectContent>
  </Select>
</template>
