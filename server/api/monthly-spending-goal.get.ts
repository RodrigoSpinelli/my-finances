import { serverSupabaseClient } from "#supabase/server"
import { currentYearMonth, monthDateBounds } from "../utils/month-bounds"
import { requireAuthUserId } from "../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)
  const [yStr, mStr] = month.split("-")
  const year = Number(yStr)
  const monthNum = Number(mStr)

  const client = await serverSupabaseClient(event)

  const [goalRes, txRes] = await Promise.all([
    client
      .from("monthly_goals")
      .select("id, amount")
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", monthNum)
      .maybeSingle(),
    client
      .from("transactions")
      .select("type, amount")
      .eq("user_id", userId)
      .gte("date", start)
      .lte("date", end),
  ])

  if (goalRes.error) {
    throw createError({
      statusCode: 500,
      statusMessage: goalRes.error.message,
    })
  }
  if (txRes.error) {
    throw createError({
      statusCode: 500,
      statusMessage: txRes.error.message,
    })
  }

  let spent = 0
  for (const r of txRes.data ?? []) {
    if (r.type === "expense")
      spent += Math.abs(Number(r.amount) || 0)
  }

  const g = goalRes.data
  const goal = g
    ? { id: g.id, amount: Number(g.amount) }
    : null

  return { month, goal, spent }
})
