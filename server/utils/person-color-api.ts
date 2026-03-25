import {
  isPersonColorName,
  PERSON_COLOR_NAMES,
} from "../../shared/person-colors"

export function normalizePersonColorField(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "color deve ser texto ou null",
    })
  }
  const t = raw.trim()
  if (!t) return null
  if (!isPersonColorName(t)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Cor inválida. Use um dos tokens: ${PERSON_COLOR_NAMES.join(", ")}`,
    })
  }
  return t
}
