import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("transactions")
    .select(`
      *,
      categories ( id, name, icon, type, color ),
      people ( id, first_name, last_name, color )
    `)
    .eq("id", id)
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
      statusMessage: "Transação não encontrada",
    })
  }

  return { transaction: data }
})
