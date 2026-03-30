import { serverSupabaseClient } from "#supabase/server"
import { currentYearMonth, monthDateBounds } from "../../utils/month-bounds"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)

  const client = await serverSupabaseClient(event)
  const { data: rows, error } = await client
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  let income_total = 0
  let expense_total = 0
  for (const r of rows ?? []) {
    const a = Math.abs(Number(r.amount) || 0)
    if (r.type === "income")
      income_total += a
    else if (r.type === "expense")
      expense_total += a
  }

  return { month, income_total, expense_total }
})
