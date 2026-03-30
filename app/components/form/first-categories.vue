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
const emit = defineEmits<{
  (e: "submit"): void;
}>();

const isLoading = ref(false);
const showAlert = ref(false);
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
  if (selectedCategories.value.length === 0) {
    showAlert.value = true;
    return;
  }
  createCategories();
};

const createCategories = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/categories/batch", {
      method: "POST",
      body: {
        categories: selectedCategories.value,
      },
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Categorias cadastradas com sucesso",
    });
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description: "Erro ao cadastrar categorias",
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
        :class="{ 'outline-2 outline-foreground': category.selected }"
        class="cursor-pointer"
        @click="addSelectedCategory(category)"
      >
        <Icon :name="category.icon" />
        {{ category.name }}
      </Badge>
    </div>
    <shared-alert
      v-if="showAlert && !isLoading && selectedCategories.length === 0"
      title="Você deve selecionar pelo menos uma categoria"
      variant="warning"
      icon="lucide:alert-circle"
    />
    <Button
      class="w-full"
      :disabled="isLoading"
      type="submit"
      :loading="isLoading"
    >
      <Icon
        :name="isLoading ? 'lucide:loader-circle' : 'lucide:save'"
        :class="{ 'animate-spin': isLoading }"
      />
      {{ isLoading ? "Salvando..." : "Salvar" }}</Button
    >
  </form>
</template>
