import { listTransactionsWithCategories } from "../../utils/transactions-with-categories"
import { requireAuthUserId } from "../../utils/require-auth-user"

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const transactions = await listTransactionsWithCategories(event, userId)
  return { transactions }
})
