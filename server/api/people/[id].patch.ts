import { serverSupabaseClient } from "#supabase/server"
import type { TablesUpdate } from "~/types/database.types"
import { normalizePersonColorField } from "../../utils/person-color-api"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const body = await readBody<
    Partial<Pick<TablesUpdate<"people">, "first_name" | "last_name" | "color">>
  >(event)

  const patch: TablesUpdate<"people"> = {}

  if (body.first_name !== undefined) {
    const v = body.first_name.trim()
    if (!v) {
      throw createError({
        statusCode: 400,
        statusMessage: "first_name não pode ser vazio",
      })
    }
    patch.first_name = v
  }
  if (body.last_name !== undefined) {
    const v = body.last_name.trim()
    if (!v) {
      throw createError({
        statusCode: 400,
        statusMessage: "last_name não pode ser vazio",
      })
    }
    patch.last_name = v
  }
  if (body.color !== undefined) {
    patch.color = normalizePersonColorField(body.color)
  }

  if (Object.keys(patch).length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nenhum campo para atualizar",
    })
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("people")
    .update(patch)
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Pessoa não encontrada" })
  }

  return { person: data }
})
