import { serverSupabaseClient } from "#supabase/server"
import { currentYearMonth, monthDateBounds, shiftYearMonth } from "../utils/month-bounds"
import { requireAuthUserId } from "../utils/require-auth-user"

function signedAmount(
  type: string | null,
  amount: number | null | undefined,
): number {
  const a = Math.abs(Number(amount) || 0)
  if (type === "income")
    return a
  if (type === "expense")
    return -a
  return 0
}

/** Variação % de `from` para `to` (base = valor absoluto do período anterior). */
function percentChange(from: number, to: number): number | null {
  if (from === 0)
    return null
  return ((to - from) / Math.abs(from)) * 100
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)
  const prevYm = shiftYearMonth(month, -1)
  const priorYm = shiftYearMonth(month, -2)
  const { start: prevMonthStart, end: endPrevious } = monthDateBounds(prevYm)
  const { start: priorMonthStart, end: priorMonthEnd } = monthDateBounds(priorYm)

  const client = await serverSupabaseClient(event)
  const { data: rows, error } = await client
    .from("transactions")
    .select("type, amount, date")
    .eq("user_id", userId)
    .lte("date", end)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  let accumulated_balance = 0
  let accumulated_at_prev_month_end = 0
  let month_balance = 0
  let previous_month_net = 0
  let prior_month_net = 0

  for (const r of rows ?? []) {
    const s = signedAmount(r.type, r.amount)
    if (r.date <= endPrevious)
      accumulated_at_prev_month_end += s
    if (r.date <= end)
      accumulated_balance += s
    if (r.date >= start && r.date <= end)
      month_balance += s
    if (r.date >= prevMonthStart && r.date <= endPrevious)
      previous_month_net += s
    if (r.date >= priorMonthStart && r.date <= priorMonthEnd)
      prior_month_net += s
  }

  return {
    month,
    month_balance,
    accumulated_balance,
    previous_month_balance: previous_month_net,
    month_change_percent: percentChange(previous_month_net, month_balance),
    previous_month_change_percent: percentChange(prior_month_net, previous_month_net),
    accumulated_change_percent: percentChange(
      accumulated_at_prev_month_end,
      accumulated_balance,
    ),
  }
})
