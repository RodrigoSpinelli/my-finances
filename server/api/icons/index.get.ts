import { serverSupabaseClient } from "#supabase/server"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("icons")
    .select("id, name, created_at")
    .order("name", { ascending: true })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { icons: data ?? [] }
})
