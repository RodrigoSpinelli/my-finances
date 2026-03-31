import { serverSupabaseClient } from "#supabase/server"
import { currentYearMonth, monthDateBounds } from "../../utils/month-bounds"
import { requireAuthUserId } from "../../utils/require-auth-user"

function daysInMonthRange(ym: string): string[] {
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

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)

  const client = await serverSupabaseClient(event)
  const { data: rows, error } = await client
    .from("transactions")
    .select("amount, date")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("date", start)
    .lte("date", end)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const byDay = new Map<string, number>()
  for (const r of rows ?? []) {
    const key = String(r.date).slice(0, 10)
    const amt = Math.abs(Number(r.amount) || 0)
    byDay.set(key, (byDay.get(key) ?? 0) + amt)
  }

  const daily = daysInMonthRange(month).map(date => ({
    date,
    amount: byDay.get(date) ?? 0,
  }))

  const month_total = daily.reduce((s, d) => s + d.amount, 0)

  return { month, daily, month_total }
})
