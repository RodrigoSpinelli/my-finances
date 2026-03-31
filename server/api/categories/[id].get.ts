import { serverSupabaseClient } from "#supabase/server"
import { requireAuthUserId } from "../../utils/require-auth-user"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("categories")
    .select("*, icons(name)")
    .eq("id", id)
    .eq("user_id", userId)
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
      statusMessage: "Categoria não encontrada",
    })
  }

  return {
    category: flattenCategoryIcon(data as CategoryRowWithIconJoin),
  }
})
