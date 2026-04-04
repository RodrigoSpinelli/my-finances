import type { Category } from "~/interfaces/category";

interface CategoryFilter {
  search?: string;
  type?: TransactionType;
}

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const filter = ref<CategoryFilter>({
    search: "",
    type: undefined,
  });
  const pending = ref(false);
  const { start, finish } = useLoadingIndicator();

  const getCategories = async () => {
    try {
      pending.value = true;
      start();
      const response = await $fetch<{ categories: Category[] }>(
        "/api/categories",
      );
      categories.value = response.categories ?? [];
    } catch (error) {
      useToast({
        type: "error",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar categorias",
      });
    } finally {
      finish();
      pending.value = false;
    }
  };

  const deleteCategory = async (category: Category) => {
    try {
      start();
      await $fetch("/api/categories/" + category.id, {
        method: "DELETE",
      });
      useToast({
        type: "success",
        title: "Sucesso",
        description: "Categoria excluída com sucesso.",
      });
      getCategories();
    } catch (error) {
      useToast({
        type: "error",
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao deletar categoria",
      });
    } finally {
      finish();
    }
  };

  function reset() {
    categories.value = [];
    filter.value = {
      search: "",
      type: undefined,
    };
  }

  return { categories, filter, pending, reset, getCategories, deleteCategory };
});
