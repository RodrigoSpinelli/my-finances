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

type RawCategoryEmbed = Pick<
  Tables<"categories">,
  "id" | "name" | "icon_id" | "type" | "color"
> & {
  icons: { name: string } | null
}

type RawTxWithEmbed = TxRow & {
  categories: RawCategoryEmbed | null
}

function mapTransactionRow(raw: RawTxWithEmbed): TransactionWithCategory {
  const { categories: cat, ...t } = raw
  if (!cat) {
    return { ...t, categories: null }
  }
  const { icons, ...base } = cat
  return {
    ...t,
    categories: {
      ...base,
      icon: icons?.name ?? "lucide:tag",
    },
  }
}

export type ListTransactionsPaginatedResult = {
  transactions: TransactionWithCategory[]
  total: number
}

export type TransactionListFilters = {
  date?: string
  type?: Tables<"transactions">["type"]
  categoryId?: string
}

export async function listTransactionsWithCategoriesPaginated(
  event: H3Event,
  userId: string,
  options: { page: number; pageSize: number; filters?: TransactionListFilters },
): Promise<ListTransactionsPaginatedResult> {
  const client = await serverSupabaseClient(event)
  const { page, pageSize, filters } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let qb = client
    .from("transactions")
    .select(
      "*, categories(id, name, icon_id, type, color, icons(name))",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters?.date) {
    qb = qb.eq("date", filters.date)
  }
  if (filters?.type) {
    qb = qb.eq("type", filters.type)
  }
  if (filters?.categoryId) {
    qb = qb.eq("category_id", filters.categoryId)
  }

  const { data: rows, error: txError, count } = await qb.range(from, to)

  if (txError) {
    throw createError({
      statusCode: 500,
      statusMessage: txError.message,
    })
  }

  const transactions = (rows ?? []).map((row) =>
    mapTransactionRow(row as RawTxWithEmbed),
  )

  return {
    transactions,
    total: count ?? 0,
  }
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
