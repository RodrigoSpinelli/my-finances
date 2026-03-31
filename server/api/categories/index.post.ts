import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesInsert } from "~/types/database.types"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"
import { requireAuthUserId } from "../../utils/require-auth-user"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)

  const body = await readBody<{
    name?: string
    type?: TransactionType
    color?: string | null
    icon_id?: string | null
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

  const iconId =
    typeof body.icon_id === "string" ? body.icon_id.trim() : ""
  if (!iconId) {
    throw createError({
      statusCode: 400,
      statusMessage: "icon_id é obrigatório",
    })
  }

  const client = await serverSupabaseClient(event)

  const { data: iconRow, error: iconErr } = await client
    .from("icons")
    .select("id")
    .eq("id", iconId)
    .maybeSingle()

  if (iconErr) {
    throw createError({
      statusCode: 500,
      statusMessage: iconErr.message,
    })
  }

  if (!iconRow) {
    throw createError({
      statusCode: 400,
      statusMessage: "Ícone inválido",
    })
  }

  const payload: TablesInsert<"categories"> = {
    name,
    type,
    icon_id: iconId,
    user_id: userId,
  }

  if (typeof body.color === "string") {
    const c = body.color.trim()
    if (c) {
      payload.color = c
    }
  }

  const { data, error } = await client
    .from("categories")
    .insert(payload)
    .select("*, icons(name)")
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    category: flattenCategoryIcon(data as CategoryRowWithIconJoin),
  }
})
