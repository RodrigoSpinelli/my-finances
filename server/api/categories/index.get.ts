import { serverSupabaseClient } from "#supabase/server"
import { requireAuthUserId } from "../../utils/require-auth-user"
import {
  flattenCategoryIcon,
  type CategoryRowWithIconJoin,
} from "../../utils/category-with-icon"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from("categories")
    .select("*, icons(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const categories = (data ?? []).map((row) =>
    flattenCategoryIcon(row as CategoryRowWithIconJoin),
  )

  return { categories }
})
