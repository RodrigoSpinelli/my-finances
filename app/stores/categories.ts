import type { Category } from "~/interfaces/category";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);

  return { categories };
});