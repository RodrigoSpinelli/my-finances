import { serverSupabaseClient } from "#supabase/server"
import type { MonthlyGoalItem } from "~/interfaces/goal"
import { flattenCategoryIcon, type CategoryRowWithIconJoin } from "../utils/category-with-icon"
import { currentYearMonth, monthDateBounds } from "../utils/month-bounds"
import { requireAuthUserId } from "../utils/require-auth-user"

type GoalRow = {
  id: string
  amount: string | number
  category_id: string | null
  categories:
    | (CategoryRowWithIconJoin & Record<string, unknown>)
    | null
}

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

  const [goalsRes, txRes] = await Promise.all([
    client
      .from("monthly_goals")
      .select("id, amount, category_id, categories(*, icons(name), colors(name))")
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", monthNum)
      .order("category_id", { ascending: true, nullsFirst: true }),
    client
      .from("transactions")
      .select("type, amount, category_id")
      .eq("user_id", userId)
      .gte("date", start)
      .lte("date", end),
  ])

  if (goalsRes.error) {
    throw createError({
      statusCode: 500,
      statusMessage: goalsRes.error.message,
    })
  }
  if (txRes.error) {
    throw createError({
      statusCode: 500,
      statusMessage: txRes.error.message,
    })
  }

  type TxRow = { type: string, amount?: string | number, category_id: string | null }
  const txs = txRes.data as TxRow[] | null

  const expenses = (
    txs?.filter(r => r.type === "expense") ?? []
  ).map(r => ({
    amount: Math.abs(Number(r.amount) || 0),
    category_id: r.category_id,
  }))

  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0)

  const spentByCategory = new Map<string, number>()
  for (const row of expenses) {
    const cid = row.category_id
    if (cid)
      spentByCategory.set(cid, (spentByCategory.get(cid) ?? 0) + row.amount)
  }

  function spentFor(categoryId: string | null): number {
    if (categoryId === null)
      return totalExpense
    return spentByCategory.get(categoryId) ?? 0
  }

  const goals: MonthlyGoalItem[] = []

  const rows = (goalsRes.data ?? []) as GoalRow[]

  for (const raw of rows) {
    const cid = raw.category_id
    let brief: MonthlyGoalItem["category"] = null
    const joined = raw.categories
    if (joined && cid) {
      const flat = flattenCategoryIcon(joined as CategoryRowWithIconJoin)
      brief = {
        id: flat.id,
        name: flat.name,
        icon: flat.icon,
        color: flat.color,
      }
    }

    goals.push({
      id: raw.id,
      amount: Number(raw.amount) || 0,
      category_id: cid,
      category: cid ? brief : null,
      spent: spentFor(cid),
    })
  }

  return { month, goals }
})
