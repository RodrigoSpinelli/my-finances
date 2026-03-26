import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import type { Tables } from "~/types/database.types"

type TxRow = Tables<"transactions">
type CategoryBrief = Pick<
  Tables<"categories">,
  "id" | "name" | "icon" | "type" | "color"
>

export type TransactionWithCategory = TxRow & {
  categories: CategoryBrief | null
}

export async function listTransactionsWithCategories(
  event: H3Event,
): Promise<TransactionWithCategory[]> {
  const client = await serverSupabaseClient(event)
  const { data: txs, error: txError } = await client
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (txError) {
    throw createError({
      statusCode: 500,
      statusMessage: txError.message,
    })
  }

  const rows = txs ?? []
  const catIds = [
    ...new Set(
      rows
        .map((t) => t.category_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    ),
  ]

  const categoryById = new Map<string, CategoryBrief>()
  if (catIds.length > 0) {
    const { data: cats, error: catError } = await client
      .from("categories")
      .select("id, name, icon, type, color")
      .in("id", catIds)

    if (catError) {
      throw createError({
        statusCode: 500,
        statusMessage: catError.message,
      })
    }
    for (const c of cats ?? []) {
      categoryById.set(c.id, c)
    }
  }

  return rows.map((t) => ({
    ...t,
    categories: t.category_id
      ? categoryById.get(t.category_id) ?? null
      : null,
  }))
}

export async function getTransactionWithCategory(
  event: H3Event,
  id: string,
): Promise<TransactionWithCategory> {
  const client = await serverSupabaseClient(event)
  const { data: t, error: txError } = await client
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (txError) {
    throw createError({
      statusCode: 500,
      statusMessage: txError.message,
    })
  }

  if (!t) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transação não encontrada",
    })
  }

  let categories: CategoryBrief | null = null
  if (t.category_id) {
    const { data: cat, error: catError } = await client
      .from("categories")
      .select("id, name, icon, type, color")
      .eq("id", t.category_id)
      .maybeSingle()

    if (catError) {
      throw createError({
        statusCode: 500,
        statusMessage: catError.message,
      })
    }
    categories = cat
  }

  return { ...t, categories }
}
