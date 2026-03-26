import { serverSupabaseClient } from "#supabase/server"
import type { TablesInsert } from "~/types/database.types"
import {
  assertIsoDate,
  assertTransactionRelations,
  parseTransactionAmount,
  type TransactionType,
} from "../../utils/transaction-api"

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    amount?: unknown
    category_id?: string | null
    date?: string
    description?: string | null
    type?: TransactionType
  }>(event)

  const amount = parseTransactionAmount(body.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "amount deve ser um número maior que zero",
    })
  }

  const type = body.type
  if (type !== "income" && type !== "expense") {
    throw createError({
      statusCode: 400,
      statusMessage: "type deve ser income ou expense",
    })
  }

  const date = assertIsoDate(body.date)

  const category_id
    = body.category_id === undefined || body.category_id === null || body.category_id === ""
      ? null
      : String(body.category_id).trim() || null

  const description
    = body.description === undefined || body.description === null
      ? null
      : String(body.description).trim() || null

  await assertTransactionRelations(event, {
    type,
    category_id,
  })

  const payload: TablesInsert<"transactions"> = {
    amount,
    category_id,
    date,
    description,
    type,
  }

  const client = await serverSupabaseClient(event)
  // Só `*` no retorno: join com categories após insert costuma falhar com RLS
  // (política de SELECT diferente da de INSERT). A lista recarrega o relacionamento.
  const { data, error } = await client
    .from("transactions")
    .insert(payload)
    .select("*")
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { transaction: data }
})
