interface UserPreferences {
  preferred_currency: "BRL" | "EUR" | "USD";
}
export const useUserStore = defineStore("user", () => {
  const preferences = ref<UserPreferences | null | undefined>(undefined);
  const pending = ref(false);

  async function getPreferences() {
    try {
      pending.value = true;
      const response = await $fetch<{ preferences: UserPreferences | null }>(
        "/api/user-preferences",
      );
      preferences.value = response.preferences ?? null;
    } catch (error) {
      preferences.value = null;
      useToast({
        type: "error",
        title: "Erro ao carregar preferências",
        description: getFetchErrorMessage(
          error,
          "Não foi possível carregar as preferências",
        ),
      });
    } finally {
      pending.value = false;
    }
  }

  function reset() {
    preferences.value = undefined;
    pending.value = false;
  }

  return {
    preferences,
    getPreferences,
    pending,
    reset,
  };
});
