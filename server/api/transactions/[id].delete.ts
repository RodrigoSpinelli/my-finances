import { serverSupabaseClient } from "#supabase/server"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data: existing, error: fetchError } = await client
    .from("transactions")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message,
    })
  }

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transação não encontrada",
    })
  }

  const { error } = await client
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { ok: true as const }
})
