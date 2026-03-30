import { createError } from "h3"

export function currentYearMonth(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

function parseYearMonth(ym: string): { y: number, m: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(ym.trim())
  if (!match)
    return null
  const y = Number(match[1])
  const m = Number(match[2])
  if (m < 1 || m > 12)
    return null
  return { y, m }
}

export function monthDateBounds(ym: string): { start: string, end: string } {
  const p = parseYearMonth(ym)
  if (!p) {
    throw createError({
      statusCode: 400,
      statusMessage: "month deve estar no formato YYYY-MM",
    })
  }
  const { y, m } = p
  const lastDay = new Date(y, m, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, "0")
  return {
    start: `${y}-${pad(m)}-01`,
    end: `${y}-${pad(m)}-${pad(lastDay)}`,
  }
}

/** `deltaMonths` negativo recua (ex.: -1 = mês anterior). */
export function shiftYearMonth(ym: string, deltaMonths: number): string {
  const p = parseYearMonth(ym)
  if (!p) {
    throw createError({
      statusCode: 400,
      statusMessage: "month deve estar no formato YYYY-MM",
    })
  }
  let { y, m } = p
  m += deltaMonths
  while (m > 12) {
    m -= 12
    y += 1
  }
  while (m < 1) {
    m += 12
    y -= 1
  }
  return `${y}-${String(m).padStart(2, "0")}`
}
