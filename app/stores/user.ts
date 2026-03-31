interface UserPreferences {
  preferred_currency: "BRL" | "EUR" | "USD";
}
export const useUserStore = defineStore("user", () => {
  const preferences = ref<UserPreferences | null>(null);

  async function getPreferences() {
    try {
      const response = await $fetch<{ preferences: UserPreferences }>(
        "/api/user-preferences",
      );

      preferences.value = response.preferences;
    } catch (error) {
      useToast({
        type: "error",
        title: "Erro ao carregar preferências",
        description: getFetchErrorMessage(
          error,
          "Não foi possível carregar as preferências",
        ),
      });
    }
  }

  return {
    preferences,
    getPreferences,
  };
});
