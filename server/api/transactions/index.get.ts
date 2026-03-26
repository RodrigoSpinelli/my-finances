import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("transactions")
    .select(`
      *,
      categories ( id, name, icon, type, color ),
      people ( id, first_name, last_name, color )
    `)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { transactions: data ?? [] }
})
