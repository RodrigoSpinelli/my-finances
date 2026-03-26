import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesInsert } from "~/types/database.types"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string
    type?: TransactionType
    color?: string | null
    icon?: string | null
  }>(event)

  const name = body.name?.trim()
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "name é obrigatório",
    })
  }

  const type = body.type
  if (type !== "income" && type !== "expense") {
    throw createError({
      statusCode: 400,
      statusMessage: "type deve ser income ou expense",
    })
  }

  const icon =
    (typeof body.icon === "string" ? body.icon.trim() : "") || "lucide:tag"

  const payload: TablesInsert<"categories"> = {
    name,
    type,
    icon,
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("categories")
    .insert(payload)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { category: data }
})
