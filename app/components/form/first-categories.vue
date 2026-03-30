<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import type { BadgeVariants } from "@/components/ui/badge";

interface Category {
  name: string;
  type: "expense" | "income";
  icon: string;
  color: BadgeVariants["variant"];
  selected: boolean;
}
const isLoading = ref(false);
const selectedCategories = ref<Category[]>([]);
const categories = ref<Category[]>([
  {
    name: "Alimentação",
    type: "expense",
    icon: "lucide:utensils",
    color: "red",
    selected: false,
  },
  {
    name: "Transporte",
    type: "expense",
    icon: "lucide:car",
    color: "blue",
    selected: false,
  },
  {
    name: "Hobbies",
    type: "expense",
    icon: "lucide:palette",
    color: "purple",
    selected: false,
  },
  {
    name: "Saúde",
    type: "expense",
    icon: "lucide:heart",
    color: "blue",
    selected: false,
  },
  {
    name: "Educação",
    type: "expense",
    icon: "lucide:book",
    color: "green",
    selected: false,
  },
  {
    name: "Lazer",
    type: "expense",
    icon: "lucide:party-popper",
    color: "yellow",
    selected: false,
  },
  {
    name: "Outros",
    type: "expense",
    icon: "lucide:tag",
    color: "gray",
    selected: false,
  },
]);

const addSelectedCategory = (category: Category) => {
  category.selected = !category.selected;
  if (category.selected) {
    selectedCategories.value.push(category);
  } else {
    selectedCategories.value = selectedCategories.value.filter(
      (c) => c.name !== category.name,
    );
  }
};
const submit = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/categories/batch", {
      method: "POST",
      body: {
        categories: selectedCategories.value,
      },
    });
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description: "Erro ao salvar categorias principais",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="flex flex-wrap gap-4">
      <Badge
        v-for="category in categories"
        :key="category.name"
        :variant="category.color"
        :class="{ 'border-2 border-primary': category.selected }"
        class="cursor-pointer"
        @click="addSelectedCategory(category)"
      >
        <Icon :name="category.icon" />
        {{ category.name }}
      </Badge>
    </div>
    <Button class="w-full" type="submit">Salvar</Button>
  </form>
</template>
