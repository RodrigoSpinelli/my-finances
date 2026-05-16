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

/** Todas as datas `YYYY-MM-DD` do mês `YYYY-MM`, em ordem crescente. */
export function daysInMonthRange(ym: string): string[] {
  const { start, end } = monthDateBounds(ym)
  const days: string[] = []
  const [y0, m0, d0] = start.split("-").map(Number)
  const [y1, m1, d1] = end.split("-").map(Number)
  const endTime = new Date(y1!, m1! - 1, d1!).getTime()
  const cursor = new Date(y0!, m0! - 1, d0!)
  while (cursor.getTime() <= endTime) {
    const yy = cursor.getFullYear()
    const mm = String(cursor.getMonth() + 1).padStart(2, "0")
    const dd = String(cursor.getDate()).padStart(2, "0")
    days.push(`${yy}-${mm}-${dd}`)
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
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
