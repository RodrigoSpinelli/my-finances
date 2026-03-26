import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesUpdate } from "~/types/database.types"
import { requireAuthUserId } from "../../utils/require-auth-user"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const body = await readBody<{
    name?: string
    type?: TransactionType
    color?: string | null
    icon?: string | null
  }>(event)

  const patch: TablesUpdate<"categories"> = {}

  if (body.name !== undefined) {
    const v = body.name.trim()
    if (!v) {
      throw createError({
        statusCode: 400,
        statusMessage: "name não pode ser vazio",
      })
    }
    patch.name = v
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

  if (body.icon !== undefined) {
    const v = typeof body.icon === "string" ? body.icon.trim() : ""
    patch.icon = v || "lucide:tag"
  }

  if (Object.keys(patch).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nenhum campo para atualizar",
    })
  }

  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("categories")
    .update(patch)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
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
      statusMessage: "Categoria não encontrada",
    })
  }

  return { category: data }
})
