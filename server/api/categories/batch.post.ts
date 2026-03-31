import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesInsert } from "~/types/database.types"
import { requireAuthUserId } from "../../utils/require-auth-user"

type TransactionType = Database["public"]["Enums"]["transaction_type"]

type CategoryInput = {
  name?: string
  type?: TransactionType
  color?: string | null
  icon?: string | null
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)

  const body = await readBody<{ categories?: CategoryInput[] }>(event)
  const items = body.categories

  if (!Array.isArray(items)) {
    throw createError({
      statusCode: 400,
      statusMessage: "categories deve ser um array",
    })
  }

  if (items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "categories não pode ser vazio",
    })
  }

  const client = await serverSupabaseClient(event)
  const { data: iconRows, error: iconsErr } = await client
    .from("icons")
    .select("id, name")

  if (iconsErr) {
    throw createError({
      statusCode: 500,
      statusMessage: iconsErr.message,
    })
  }

  const iconByName = new Map(
    (iconRows ?? []).map((r) => [r.name, r.id] as const),
  )

  const payloads: TablesInsert<"categories">[] = []

  for (let i = 0; i < items.length; i++) {
    const raw = items[i]!
    const name = raw.name?.trim()
    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: `categories[${i}]: name é obrigatório`,
      })
    }

    const type = raw.type
    if (type !== "income" && type !== "expense") {
      throw createError({
        statusCode: 400,
        statusMessage: `categories[${i}]: type deve ser income ou expense`,
      })
    }

    const iconName =
      (typeof raw.icon === "string" ? raw.icon.trim() : "") || "lucide:tag"
    const iconId = iconByName.get(iconName)
    if (!iconId) {
      throw createError({
        statusCode: 400,
        statusMessage: `categories[${i}]: ícone "${iconName}" não cadastrado na tabela icons`,
      })
    }

    const row: TablesInsert<"categories"> = {
      name,
      type,
      icon_id: iconId,
      user_id: userId,
    }

    if (raw.color !== undefined && raw.color !== null) {
      const c = typeof raw.color === "string" ? raw.color.trim() : ""
      if (c) {
        row.color = c
      }
    }

    payloads.push(row)
  }

  const { data, error } = await client
    .from("categories")
    .insert(payloads)
    .select()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { categories: data ?? [] }
})
