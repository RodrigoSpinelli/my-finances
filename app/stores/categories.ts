import type { Category } from "~/interfaces/category";

interface CategoryFilter {
  search?: string;
  type?: TransactionType;
}

const PAGE_SIZE = 5;

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const filter = ref<CategoryFilter>({
    search: "",
    type: undefined,
  });
  /** Página atual (lista paginada em `/categories`). */
  const page = ref(1);
  /** Total de itens compatíveis com filtros aplicados ao carregar modo paginado. */
  const total = ref(0);
  const pending = ref(false);
  const { start, finish } = useLoadingIndicator();

  async function getCategories(opts?: { paginate?: boolean }) {
    const paginate = opts?.paginate ?? false;
    try {
      pending.value = true;
      start();
      const query: Record<string, string | number> = {};
      if (paginate) {
        query.page = page.value;
        query.pageSize = PAGE_SIZE;
        if (filter.value.type)
          query.type = filter.value.type;
        const s = filter.value.search?.trim();
        if (s)
          query.search = s;
      }
      const response = await $fetch<{ categories: Category[], total: number }>(
        "/api/categories",
        { query },
      );
      categories.value = response.categories ?? [];
      total.value = response.total ?? categories.value.length;

      if (paginate) {
        const pageCount = Math.max(1, Math.ceil(total.value / PAGE_SIZE));
        if (page.value > pageCount)
          page.value = pageCount;
      }
    }
    catch (error) {
      useToast({
        type: "error",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar categorias",
      });
    }
    finally {
      finish();
      pending.value = false;
    }
  }

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
      await getCategories({ paginate: true });
    }
    catch (error) {
      useToast({
        type: "error",
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao deletar categoria",
      });
    }
    finally {
      finish();
    }
  };

  function reset() {
    categories.value = [];
    filter.value = {
      search: "",
      type: undefined,
    };
    page.value = 1;
    total.value = 0;
  }

  function clearFilters() {
    filter.value.search = "";
    filter.value.type = undefined;
    page.value = 1;
  };

  return {
    categories,
    filter,
    page,
    total,
    pageSize: PAGE_SIZE,
    pending,
    reset,
    getCategories,
    deleteCategory,
    clearFilters,
  };
});
