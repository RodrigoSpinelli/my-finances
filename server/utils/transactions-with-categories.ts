import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import type { Tables } from "~/types/database.types"

type TxRow = Tables<"transactions">
type CategoryBrief = Pick<
  Tables<"categories">,
  "id" | "name" | "icon_id" | "type" | "color"
> & {
  icon: string
}

export type TransactionWithCategory = TxRow & {
  categories: CategoryBrief | null
}

export async function listTransactionsWithCategories(
  event: H3Event,
  userId: string,
): Promise<TransactionWithCategory[]> {
  const client = await serverSupabaseClient(event)
  const { data: txs, error: txError } = await client
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
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
      .select("id, name, icon_id, type, color, icons(name)")
      .eq("user_id", userId)
      .in("id", catIds)

    if (catError) {
      throw createError({
        statusCode: 500,
        statusMessage: catError.message,
      })
    }
    for (const raw of cats ?? []) {
      const row = raw as typeof raw & {
        icons: { name: string } | null
      }
      const { icons, ...base } = row
      categoryById.set(base.id, {
        ...base,
        icon: icons?.name ?? "lucide:tag",
      })
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
  userId: string,
): Promise<TransactionWithCategory> {
  const client = await serverSupabaseClient(event)
  const { data: t, error: txError } = await client
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
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
    const { data: catRow, error: catError } = await client
      .from("categories")
      .select("id, name, icon_id, type, color, icons(name)")
      .eq("id", t.category_id)
      .eq("user_id", userId)
      .maybeSingle()

    if (catError) {
      throw createError({
        statusCode: 500,
        statusMessage: catError.message,
      })
    }
    if (catRow) {
      const row = catRow as typeof catRow & {
        icons: { name: string } | null
      }
      const { icons, ...base } = row
      categories = {
        ...base,
        icon: icons?.name ?? "lucide:tag",
      }
    }
  }

  return { ...t, categories }
}
