import { serverSupabaseUser } from "#supabase/server"
import type { H3Event } from "h3"

export async function requireAuthUserId(event: H3Event): Promise<string> {
  const claims = await serverSupabaseUser(event)
  const userId = claims?.sub
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autenticado",
    })
  }
  return userId
}
