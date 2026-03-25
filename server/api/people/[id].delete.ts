import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const client = await serverSupabaseClient(event)
  const { data: existing, error: fetchError } = await client
    .from("people")
    .select("id")
    .eq("id", id)
    .maybeSingle()

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message,
    })
  }

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Pessoa não encontrada" })
  }

  const { error } = await client.from("people").delete().eq("id", id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { ok: true as const }
})
