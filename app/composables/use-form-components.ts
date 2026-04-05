import { defineAsyncComponent } from "vue";

const formComponents = {
  category: defineAsyncComponent(() => import("@/components/form/category.vue")),
  transaction: defineAsyncComponent(
    () => import("@/components/form/transaction.vue"),
  ),
  firstCategories: defineAsyncComponent(
    () => import("@/components/form/first-categories.vue"),
  ),
  setGoals: defineAsyncComponent(() => import("@/components/form/set-goals.vue")),
  changePassword: defineAsyncComponent(() => import("@/components/form/change-password.vue")),
} as const;

export type FormComponentKey = keyof typeof formComponents;

export function useFormComponents() {
  return { formComponents };
}
