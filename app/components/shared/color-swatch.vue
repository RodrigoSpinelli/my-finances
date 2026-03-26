<script setup lang="ts">
import { cn } from "@/lib/utils";
import { getColorOptionByName } from "~/constants/colors";

const props = defineProps<{
  color: string | null | undefined;
}>();

const swatch = computed(() => getColorOptionByName(props.color));

const swatchClass = computed(() => {
  const c = swatch.value;
  if (!c) return "";
  return cn(
    "size-6 shrink-0 rounded-full border ring-1",
    c.bg,
    c.ring,
    c.border,
  );
});
</script>

<template>
  <div
    v-if="swatch"
    :class="swatchClass"
    :aria-label="`Cor ${swatch.name}`"
    role="img"
  />
  <span v-else class="text-muted-foreground">—</span>
</template>
