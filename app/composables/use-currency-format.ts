

/**
 * Formatação de valores monetários conforme `preferred_currency` do usuário (pt-BR).
 */
export function useCurrencyFormat() {
  const { preferences } = storeToRefs(useUserStore())

  const money = computed(() =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: preferences.value?.preferred_currency ?? "BRL",
    }),
  )

  function formatMoney(value: number) {
    return money.value.format(value)
  }

  return { money, formatMoney }
}
