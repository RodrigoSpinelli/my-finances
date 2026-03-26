import { serverSupabaseClient } from "#supabase/server"
import type { Database, TablesInsert, TablesUpdate } from "~/types/database.types"
import { requireAuthUserId } from "../../utils/require-auth-user"

type Currency = Database["public"]["Enums"]["currency_type"]

const CURRENCIES: readonly Currency[] = ["EUR", "BRL", "USD"]

function isCurrency(v: unknown): v is Currency {
  return typeof v === "string" && (CURRENCIES as readonly string[]).includes(v)
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const body = await readBody<{ preferred_currency?: unknown }>(event)

  if (!isCurrency(body.preferred_currency)) {
    throw createError({
      statusCode: 400,
      statusMessage: `preferred_currency deve ser ${CURRENCIES.join(", ")}`,
    })
  }

  const client = await serverSupabaseClient(event)
  const { data: existing, error: fetchError } = await client
    .from("user_preferences")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    throw createError({
      statusCode: 500,
      statusMessage: fetchError.message,
    })
  }

  const patch: TablesUpdate<"user_preferences"> = {
    preferred_currency: body.preferred_currency,
  }

  if (existing) {
    const { data, error } = await client
      .from("user_preferences")
      .update(patch)
      .eq("user_id", userId)
      .select("*")
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    }

    return { preferences: data }
  }

  const insert: TablesInsert<"user_preferences"> = {
    user_id: userId,
    preferred_currency: body.preferred_currency,
  }

  const { data, error } = await client
    .from("user_preferences")
    .insert(insert)
    .select("*")
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return { preferences: data }
})
