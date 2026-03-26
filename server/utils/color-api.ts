import {
  isColorName,
  COLOR_NAMES,
} from "../../shared/colors"

export function normalizeColorField(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "color deve ser texto ou null",
    })
  }
  const t = raw.trim()
  if (!t) return null
  if (!isColorName(t)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Cor inválida. Use um dos tokens: ${COLOR_NAMES.join(", ")}`,
    })
  }
  return t
}
