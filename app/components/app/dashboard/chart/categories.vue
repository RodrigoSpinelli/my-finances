<script setup lang="ts">
import type { Database } from "~/types/database.types"
import { Progress } from "@/components/ui/progress"
import { TagIcon } from "lucide-vue-next"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

interface ItemsData {
  category_id: string
  name: string
  icon: string
  type: TransactionType
  color: string
  color_hex: string
  transaction_count: number
  total_amount: number
  percentage: number
}

interface CategoryData {
  month: string
  type: TransactionType | "all"
  items: ItemsData[]
}

const {
  data: categoriesData,
  pending: categoriesPending,
  error: categoriesError,
} = await useFetch<CategoryData>("/api/categories/top");
</script>

<template>
  <Card>
    <CardHeader class="gap-4 flex flex-wrap items-center justify-between border-b">
      <CardTitle>Gastos por categoria</CardTitle>
      <TagIcon />
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        class="grid gap-2"
        v-for="category in categoriesData?.items"
        :key="category.category_id"
      >
        <div class="flex items-center justify-between">
          <span>{{ category.name }}</span>
          <span>{{ category.percentage }}%</span>
        </div>
        <Progress :model-value="category.percentage" />
      </div>
    </CardContent>
  </Card>
</template>
