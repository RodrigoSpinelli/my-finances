<script setup lang="ts">
import type { Database } from "~/types/database.types";
import { Progress } from "@/components/ui/progress";
import { TagIcon } from "lucide-vue-next";
import type { CategoryData } from "~/interfaces/dashboard";

const { pending, data } = defineProps<{
  pending: boolean;
  data: CategoryData | null;
}>();
</script>

<template>
  <Card>
    <CardHeader
      class="gap-4 flex flex-wrap items-center justify-between border-b"
    >
      <CardTitle>Gastos por categoria</CardTitle>
      <TagIcon />
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-if="data?.items && data?.items.length > 0"
        class="grid gap-2"
        v-for="category in data?.items"
        :key="category.category_id"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon :name="category.icon" class="size-4 shrink-0" />
            <span>{{ category.name }}</span>
          </div>
          <span>{{ category.percentage }}%</span>
        </div>
        <Progress :model-value="category.percentage" />
      </div>
      <div
        v-else
        class="text-muted-foreground flex aspect-square max-h-[250px] mx-auto flex-col items-center justify-center gap-1 px-4 text-center text-sm"
      >
        <p>Nenhuma gasto por categoria encontrada.</p>
        <p class="text-xs">
          Registre gastos em
          <NuxtLink
            to="/transactions"
            class="text-foreground underline-offset-4 hover:underline"
          >
            transações
          </NuxtLink>
          .
        </p>
      </div>
    </CardContent>
  </Card>
</template>
