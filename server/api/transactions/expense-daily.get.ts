import { serverSupabaseClient } from "#supabase/server"
import {
  currentYearMonth,
  daysInMonthRange,
  monthDateBounds,
  shiftYearMonth,
} from "../../utils/month-bounds"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)
  const prevYm = shiftYearMonth(month, -1)
  const { start: prevStart, end: prevEnd } = monthDateBounds(prevYm)

  const client = await serverSupabaseClient(event)
  const { data: rows, error } = await client
    .from("transactions")
    .select("amount, date")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("date", prevStart)
    .lte("date", end)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const byDay = new Map<string, number>()
  let previous_month_total = 0
  for (const r of rows ?? []) {
    const key = String(r.date).slice(0, 10)
    const amt = Math.abs(Number(r.amount) || 0)
    if (key >= prevStart && key <= prevEnd)
      previous_month_total += amt
    if (key >= start && key <= end)
      byDay.set(key, (byDay.get(key) ?? 0) + amt)
  }

  const daily = daysInMonthRange(month).map(date => ({
    date,
    amount: byDay.get(date) ?? 0,
  }))

  const month_total = daily.reduce((s, d) => s + d.amount, 0)

  return { month, daily, month_total, previous_month_total }
})
