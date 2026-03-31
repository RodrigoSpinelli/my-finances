import {
  centsToDisplayString,
  onMoneyInput,
  onMoneyKeydown,
  onMoneyPaste,
} from "~/utils/money-input"

/**
 * Buffer de centavos (estilo POS) + exibição formatada.
 * Use :model-value="display" com @keydown / @paste / @input nos handlers abaixo.
 */
export function useMoneyInput() {
  const cents = ref(0)

  const display = computed(() => centsToDisplayString(cents.value))

  const numeric = computed(() => cents.value / 100)

  function setFromNumber(value: number) {
    cents.value = Number.isFinite(value) ? Math.round(value * 100) : 0
  }

  function clear() {
    cents.value = 0
  }

  function handleKeydown(e: KeyboardEvent) {
    onMoneyKeydown(e, cents)
  }

  function handlePaste(e: ClipboardEvent) {
    onMoneyPaste(e, cents)
  }

  function handleInput(e: Event) {
    onMoneyInput(e, cents)
  }

  return {
    cents,
    display,
    numeric,
    setFromNumber,
    clear,
    handleKeydown,
    handlePaste,
    handleInput,
  }
}
