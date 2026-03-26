import { serverSupabaseClient } from "#supabase/server"
import type { H3Event } from "h3"
import type { Database } from "~/types/database.types"

export type TransactionType = Database["public"]["Enums"]["transaction_type"]

export async function assertTransactionRelations(
  event: H3Event,
  opts: { person_id: string; type: TransactionType; category_id?: string | null },
) {
  const client = await serverSupabaseClient(event)

  const { data: person, error: personError } = await client
    .from("people")
    .select("id")
    .eq("id", opts.person_id)
    .maybeSingle()

  if (personError) {
    throw createError({
      statusCode: 500,
      statusMessage: personError.message,
    })
  }

  if (!person) {
    throw createError({
      statusCode: 400,
      statusMessage: "Pessoa não encontrada",
    })
  }

  if (!opts.category_id)
    return

  const { data: category, error: categoryError } = await client
    .from("categories")
    .select("id, type")
    .eq("id", opts.category_id)
    .maybeSingle()

  if (categoryError) {
    throw createError({
      statusCode: 500,
      statusMessage: categoryError.message,
    })
  }

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: "Categoria não encontrada",
    })
  }

  if (category.type !== opts.type) {
    throw createError({
      statusCode: 400,
      statusMessage: "A categoria não corresponde ao tipo da transação (receita/despesa)",
    })
  }
}

export function parseTransactionAmount(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw))
    return raw
  if (typeof raw === "string") {
    const normalized = raw.trim().replace(",", ".")
    const n = Number(normalized)
    if (Number.isFinite(n))
      return n
  }
  return Number.NaN
}

export function assertIsoDate(s: string | undefined): string {
  const v = s?.trim()
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    throw createError({
      statusCode: 400,
      statusMessage: "date deve estar no formato YYYY-MM-DD",
    })
  }
  return v
}
