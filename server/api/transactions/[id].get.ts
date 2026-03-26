import { getTransactionWithCategory } from "../../utils/transactions-with-categories"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const userId = await requireAuthUserId(event)
  const transaction = await getTransactionWithCategory(event, id, userId)
  return { transaction }
})
