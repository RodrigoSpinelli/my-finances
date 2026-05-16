import { serverSupabaseClient } from "#supabase/server"
import type { Database } from "~/types/database.types"
import { requireAuthUserId } from "../../utils/require-auth-user"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

function firstQueryString(v: unknown): string | undefined {
  if (Array.isArray(v))
    return typeof v[0] === "string" ? v[0] : undefined
  return typeof v === "string" ? v : undefined
}

function parsePositiveInt(v: unknown, fallback: number, max?: number): number {
  const s = firstQueryString(v)
  const n = s === undefined ? Number.NaN : Number.parseInt(s, 10)
  if (!Number.isFinite(n) || n < 1)
    return fallback
  if (max !== undefined && n > max)
    return max
  return n
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const rawType = firstQueryString(query.type)
  const typeFilter
    = typeof rawType === "string" && rawType.trim() !== ""
      ? (rawType.trim() as TransactionType)
      : undefined

  if (
    typeFilter !== undefined
    && typeFilter !== "income"
    && typeFilter !== "expense"
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "type deve ser income ou expense",
    })
  }

  const rawSearch = firstQueryString(query.search)
  const search
    = typeof rawSearch === "string" && rawSearch.trim() !== ""
      ? rawSearch.trim()
      : undefined

  const rawPage = firstQueryString(query.page)
  const paginate = rawPage !== undefined
  const page = parsePositiveInt(query.page, 1)
  const pageSize = parsePositiveInt(query.pageSize, 10, 100)

  const client = await serverSupabaseClient(event)

  let countQuery = client
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (typeFilter !== undefined)
    countQuery = countQuery.eq("type", typeFilter)
  if (search !== undefined)
    countQuery = countQuery.ilike("name", `%${search}%`)

  const { count: matchedCount, error: countError } = await countQuery

  if (countError) {
    throw createError({
      statusCode: 500,
      statusMessage: countError.message,
    })
  }

  const total = matchedCount ?? 0

  let dataQuery = client
    .from("categories")
    .select("*, icons(name), colors(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (typeFilter !== undefined)
    dataQuery = dataQuery.eq("type", typeFilter)
  if (search !== undefined)
    dataQuery = dataQuery.ilike("name", `%${search}%`)

  if (paginate) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    dataQuery = dataQuery.range(from, to)
  }

  const { data, error } = await dataQuery

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const categories = (data ?? []).map((row) =>
    flattenCategoryIcon(row as CategoryRowWithIconJoin),
  )

  return { categories, total }
})
