import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("people")
    .select("*")
    .eq("id", id)
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
