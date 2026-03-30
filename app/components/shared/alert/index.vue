<script setup lang="ts">
import type { AlertVariants } from "@/components/ui/alert";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-vue-next";

defineProps<{
  title: string;
  description?: string;
  icon?: string;
  variant: AlertVariants["variant"];
}>();
</script>

<template>
  <Alert :variant="variant">
    <AlertTriangleIcon />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription v-if="description">{{ description }}</AlertDescription>
  </Alert>
</template>
