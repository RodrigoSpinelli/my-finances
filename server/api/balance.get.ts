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
  const { end } = monthDateBounds(month)
  const prevYm = shiftYearMonth(month, -1)
  const priorYm = shiftYearMonth(month, -2)
  const { end: endPrevious } = monthDateBounds(prevYm)
  const { end: endPrior } = monthDateBounds(priorYm)

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

  let current_balance = 0
  let previous_balance = 0
  let prior_balance = 0
  for (const r of rows ?? []) {
    const s = signedAmount(r.type, r.amount)
    if (r.date <= endPrior)
      prior_balance += s
    if (r.date <= endPrevious)
      previous_balance += s
    current_balance += s
  }

  return {
    month,
    current_balance,
    previous_balance,
    current_change_percent: percentChange(previous_balance, current_balance),
    previous_change_percent: percentChange(prior_balance, previous_balance),
  }
})
