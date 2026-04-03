import type { Category } from "~/interfaces/category";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);

  function reset() {
    categories.value = [];
  }

  return { categories, reset };
});