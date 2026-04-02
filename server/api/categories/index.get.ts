import { serverSupabaseClient } from "#supabase/server"
import type { Database } from "~/types/database.types"
import { requireAuthUserId } from "../../utils/require-auth-user"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)
  const rawType = Array.isArray(query.type) ? query.type[0] : query.type
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

  const client = await serverSupabaseClient(event)
  let q = client
    .from("categories")
    .select("*, icons(name)")
    .eq("user_id", userId)

  if (typeFilter !== undefined) {
    q = q.eq("type", typeFilter)
  }

  const { data, error } = await q.order("created_at", { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const categories = (data ?? []).map((row) =>
    flattenCategoryIcon(row as CategoryRowWithIconJoin),
  )

  return { categories }
})
