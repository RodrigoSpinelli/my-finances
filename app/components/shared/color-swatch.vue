<script setup lang="ts">
import { cn } from "@/lib/utils";
import { colorSwatchHex } from "../../../shared/colors";

const props = defineProps<{
  color: string | null | undefined;
}>();

const token = computed(() => props.color?.trim() || null);

const hex = computed(() => colorSwatchHex(token.value));

const swatchClass = computed(() =>
  cn(
    "size-6 shrink-0 rounded-full border border-black/10 ring-1 ring-black/5 dark:border-white/10 dark:ring-white/10",
    hex.value ? "" : "bg-muted",
  ),
);
</script>

<template>
  <div
    v-if="token"
    :class="swatchClass"
    :style="hex ? { backgroundColor: hex } : undefined"
    :aria-label="`Cor ${token}`"
    role="img"
  />
  <span v-else class="text-muted-foreground">—</span>
</template>
