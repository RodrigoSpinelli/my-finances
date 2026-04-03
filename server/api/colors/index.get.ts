import { serverSupabaseClient } from "#supabase/server"
import type { Tables } from "~/types/database.types"
import { colorSwatchHex } from "../../../shared/colors"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("colors")
    .select("id, name, created_at")
    .order("name", { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const rows = data ?? []
  const colors = rows.map((row: Tables<"colors">) => ({
    ...row,
    swatch_hex: colorSwatchHex(row.name),
  }))

  return { colors }
})
