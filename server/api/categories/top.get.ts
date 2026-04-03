import { serverSupabaseClient } from "#supabase/server"
import type { Database } from "~/types/database.types"
import { resolveCategoryChartHex } from "../../../shared/colors"
import { currentYearMonth, monthDateBounds } from "../../utils/month-bounds"
import { requireAuthUserId } from "../../utils/require-auth-user"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

/** Inteiros 0–100 que somam 100; baseado na participação de cada valor no total. */
function sharePercentages(values: number[]): number[] {
  const sum = values.reduce((a, b) => a + b, 0)
  if (sum <= 0)
    return values.map(() => 0)
  const raw = values.map((v) => (v / sum) * 100)
  const floors = raw.map((r) => Math.floor(r))
  let remainder = 100 - floors.reduce((a, b) => a + b, 0)
  const withFrac = raw.map((r, i) => ({ i, frac: r - floors[i]! }))
  withFrac.sort((a, b) => b.frac - a.frac)
  const out = [...floors]
  for (let k = 0; k < remainder; k++)
    out[withFrac[k]!.i]! += 1
  return out
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const monthRaw = typeof query.month === "string" ? query.month : ""
  const month = monthRaw ? monthRaw : currentYearMonth()
  const { start, end } = monthDateBounds(month)

  const typeRaw = typeof query.type === "string" ? query.type : "expense"
  let typeFilter: TransactionType | "all" = "expense"
  if (typeRaw === "income")
    typeFilter = "income"
  else if (typeRaw === "expense")
    typeFilter = "expense"
  else if (typeRaw === "all")
    typeFilter = "all"
  else {
    throw createError({
      statusCode: 400,
      statusMessage: "type deve ser expense, income ou all",
    })
  }

  const client = await serverSupabaseClient(event)

  let q = client
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end)
    .not("category_id", "is", null)

  if (typeFilter !== "all")
    q = q.eq("type", typeFilter)

  const { data: rows, error: txError } = await q

  if (txError) {
    throw createError({
      statusCode: 500,
      statusMessage: txError.message,
    })
  }

  const agg = new Map<
    string,
    { transaction_count: number, total_amount: number }
  >()
  for (const row of rows ?? []) {
    const cid = row.category_id as string
    const amt = Number(row.amount) || 0
    const prev = agg.get(cid)
    if (prev) {
      prev.transaction_count += 1
      prev.total_amount += amt
    }
    else {
      agg.set(cid, { transaction_count: 1, total_amount: amt })
    }
  }

  const ranked = [...agg.entries()].sort((a, b) => {
    const byCount = b[1].transaction_count - a[1].transaction_count
    if (byCount !== 0)
      return byCount
    return b[1].total_amount - a[1].total_amount
  })

  const ids = ranked.map(([id]) => id)
  if (ids.length === 0) {
    return {
      month,
      type: typeFilter,
      items: [] as const,
    }
  }

  const { data: cats, error: catError } = await client
    .from("categories")
    .select("id, name, icon_id, type, color_id, icons(name), colors(name)")
    .eq("user_id", userId)
    .in("id", ids)

  if (catError) {
    throw createError({
      statusCode: 500,
      statusMessage: catError.message,
    })
  }

  const catById = new Map(
    (cats ?? []).map((raw) => {
      const row = raw as typeof raw & {
        icons: { name: string } | null
        colors: { name: string } | null
      }
      const { icons, colors, ...base } = row
      return [
        base.id,
        {
          ...base,
          icon: icons?.name ?? "lucide:tag",
          color: colors?.name ?? null,
        },
      ] as const
    }),
  )
  const amounts = ranked.map(([, s]) => s.total_amount)
  const percentages = sharePercentages(amounts)

  const items = ranked.map(([categoryId, stats], index) => {
    const c = catById.get(categoryId)
    if (!c) {
      throw createError({
        statusCode: 500,
        statusMessage: "Categoria inconsistente para transações do período",
      })
    }
    return {
      category_id: c.id,
      name: c.name,
      icon: c.icon,
      type: c.type,
      color: c.color,
      color_hex: resolveCategoryChartHex(c.color, index),
      transaction_count: stats.transaction_count,
      total_amount: stats.total_amount,
      percentage: percentages[index] ?? 0,
    }
  })

  return { month, type: typeFilter, items }
})
