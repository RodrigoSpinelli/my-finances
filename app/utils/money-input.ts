/**
 * Valores monetários como centavos inteiros + exibição pt-BR.
 * Digitação estilo POS: cada dígito entra à direita (evita estados inválidos como "00,002").
 */

/** Valor exibido quando o montante é zero. */
export const MONEY_INPUT_DEFAULT_DISPLAY = "00,00" as const

const MAX_CENTS = 999_999_999_999

export function centsToDisplayString(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0)
    return MONEY_INPUT_DEFAULT_DISPLAY
  const n = cents / 100
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

/**
 * Converte texto vindo do pai (colagem, v-model) em centavos.
 * - Sem vírgula: só dígitos = buffer POS (ex.: "1234" → 12,34).
 * - Com vírgula: parte inteira + decimais (até 2 casas; "12,3" → 12,30 em centavos).
 */
export function modelStringToCents(raw: string): number {
  const s = raw.trim()
  if (!s)
    return 0
  if (s === MONEY_INPUT_DEFAULT_DISPLAY)
    return 0

  if (!s.includes(",")) {
    const d = s.replace(/\D/g, "")
    if (!d)
      return 0
    const n = Number.parseInt(d, 10)
    return Number.isFinite(n) ? Math.min(n, MAX_CENTS) : 0
  }

  const idx = s.lastIndexOf(",")
  const intRaw = s.slice(0, idx).replace(/\./g, "").replace(/\D/g, "")
  let decRaw = s.slice(idx + 1).replace(/\D/g, "")

  if (decRaw.length > 2)
    decRaw = decRaw.slice(0, 2)

  const intVal = Number.parseInt(intRaw || "0", 10) || 0
  if (!Number.isFinite(intVal))
    return 0

  let decCents = 0
  if (decRaw.length === 0)
    decCents = 0
  else if (decRaw.length === 1)
    decCents = Number.parseInt(`${decRaw}0`, 10) || 0
  else
    decCents = Number.parseInt(decRaw.slice(0, 2), 10) || 0

  const total = intVal * 100 + decCents
  return Math.min(Math.max(0, total), MAX_CENTS)
}

export function formatMoneyInputBr(value: number): string {
  if (!Number.isFinite(value))
    return MONEY_INPUT_DEFAULT_DISPLAY
  const cents = Math.round(value * 100)
  return centsToDisplayString(cents)
}

/** Para envio à API; string vazia → null (campo não preenchido). */
export function parseMoneyInputBr(raw: string): number | null {
  const s = raw.trim()
  if (!s)
    return null
  const cents = modelStringToCents(s)
  return cents / 100
}

function selectionIsFullField(el: HTMLInputElement): boolean {
  const len = el.value.length
  if (!len)
    return true
  const a = el.selectionStart ?? 0
  const b = el.selectionEnd ?? 0
  return a === 0 && b === len
}

function selectionIsNonEmpty(el: HTMLInputElement): boolean {
  const a = el.selectionStart ?? 0
  const b = el.selectionEnd ?? 0
  return b > a
}

/** Teclas: buffer de centavos (0–9 acrescenta, Backspace/Delete remove último dígito). */
export function onMoneyKeydown(e: KeyboardEvent, centsRef: { value: number }): void {
  if (e.ctrlKey || e.metaKey || e.altKey)
    return

  const el = e.target as HTMLInputElement | null
  if (!el)
    return

  if (e.key >= "0" && e.key <= "9") {
    const d = Number.parseInt(e.key, 10)
    if (!Number.isFinite(d))
      return
    e.preventDefault()
    if (selectionIsNonEmpty(el)) {
      centsRef.value = d
      return
    }
    const next = centsRef.value * 10 + d
    if (next <= MAX_CENTS)
      centsRef.value = next
    return
  }

  const navKeys = ["Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]
  if (navKeys.includes(e.key))
    return

  if (e.key === "Backspace" || e.key === "Delete") {
    e.preventDefault()
    if (selectionIsFullField(el) || selectionIsNonEmpty(el))
      centsRef.value = 0
    else
      centsRef.value = Math.floor(centsRef.value / 10)
  }
}

/** Cola texto e interpreta com {@link modelStringToCents}. */
export function onMoneyPaste(e: ClipboardEvent, centsRef: { value: number }): void {
  e.preventDefault()
  const text = e.clipboardData?.getData("text/plain") ?? ""
  centsRef.value = modelStringToCents(text)
}

/** Alternativa para teclados que disparam só `input` (ex.: alguns móveis). */
export function onMoneyInput(e: Event, centsRef: { value: number }): void {
  const el = e.target as HTMLInputElement | null
  if (!el)
    return
  centsRef.value = modelStringToCents(el.value)
}
