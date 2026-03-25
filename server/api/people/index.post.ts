import { serverSupabaseClient } from "#supabase/server"
import type { TablesInsert } from "~/types/database.types"
import { normalizePersonColorField } from "../../utils/person-color-api"

export default defineEventHandler(async (event) => {
  const body = await readBody<
    Partial<Pick<TablesInsert<"people">, "first_name" | "last_name" | "color">>
  >(event)

  const first_name = body.first_name?.trim()
  const last_name = body.last_name?.trim()

  if (!first_name || !last_name) {
    throw createError({
      statusCode: 400,
      statusMessage: "first_name e last_name são obrigatórios",
    })
  }

  const payload: TablesInsert<"people"> = {
    first_name,
    last_name,
    color: normalizePersonColorField(body.color),
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("people")
    .insert(payload)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { person: data }
})
