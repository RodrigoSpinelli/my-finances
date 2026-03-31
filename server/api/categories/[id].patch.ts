import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesUpdate } from "~/types/database.types"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"
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
    icon_id?: string | null
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

  if (body.icon_id !== undefined) {
    const v = typeof body.icon_id === "string" ? body.icon_id.trim() : ""
    if (!v) {
      throw createError({
        statusCode: 400,
        statusMessage: "icon_id não pode ser vazio",
      })
    }
    patch.icon_id = v
  }

  if (body.color !== undefined) {
    const c = typeof body.color === "string" ? body.color.trim() : ""
    patch.color = c
  }

  if (Object.keys(patch).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nenhum campo para atualizar",
    })
  }

  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)

  if (patch.icon_id) {
    const { data: iconRow, error: iconErr } = await client
      .from("icons")
      .select("id")
      .eq("id", patch.icon_id)
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
  }

  const { data, error } = await client
    .from("categories")
    .update(patch)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*, icons(name)")
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

  return {
    category: flattenCategoryIcon(data as CategoryRowWithIconJoin),
  }
})
