import { serverSupabaseClient } from "#supabase/server"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { categories: data ?? [] }
})
