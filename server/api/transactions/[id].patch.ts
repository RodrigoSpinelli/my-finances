import { serverSupabaseClient } from "#supabase/server"
import type { Tables, TablesUpdate } from "~/types/database.types"
import type { TransactionType } from "../../utils/transaction-api"
import {
  assertIsoDate,
  assertTransactionRelations,
  parseTransactionAmount,
} from "../../utils/transaction-api"

type TxRow = Tables<"transactions">

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const body = await readBody<{
    amount?: unknown
    category_id?: string | null
    date?: string
    description?: string | null
    type?: TransactionType
  }>(event)

  const client = await serverSupabaseClient(event)
  const { data: existing, error: fetchError } = await client
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message,
    })
  }

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transação não encontrada",
    })
  }

  const row = existing as TxRow

  const patch: TablesUpdate<"transactions"> = {}

  if (body.amount !== undefined) {
    const amount = parseTransactionAmount(body.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "amount deve ser um número maior que zero",
      })
    }
    patch.amount = amount
  }

  if (body.date !== undefined) {
    patch.date = assertIsoDate(body.date)
  }

  if (body.description !== undefined) {
    patch.description
      = body.description === null
        ? null
        : String(body.description).trim() || null
  }

  if (body.type !== undefined) {
    if (body.type !== "income" && body.type !== "expense") {
      throw createError({
        statusCode: 400,
        statusMessage: "type deve ser income ou expense",
      })
    }
    patch.type = body.type
  }

  if (body.category_id !== undefined) {
    patch.category_id
      = body.category_id === null || body.category_id === ""
        ? null
        : String(body.category_id).trim() || null
  }

  if (Object.keys(patch).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nenhum campo para atualizar",
    })
  }

  const effective = {
    amount: patch.amount ?? row.amount,
    date: patch.date ?? row.date,
    description: patch.description !== undefined ? patch.description : row.description,
    type: (patch.type ?? row.type) as TransactionType | null,
    category_id: patch.category_id !== undefined ? patch.category_id : row.category_id,
  }

  if (effective.type !== "income" && effective.type !== "expense") {
    throw createError({
      statusCode: 400,
      statusMessage: "type da transação deve ser receita ou despesa",
    })
  }

  await assertTransactionRelations(event, {
    type: effective.type,
    category_id: effective.category_id,
  })

  const { data, error } = await client
    .from("transactions")
    .update(patch)
    .eq("id", id)
    .select("*")
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transação não encontrada",
    })
  }

  return { transaction: data }
})
