import { listTransactionsWithCategories } from "../../utils/transactions-with-categories"

export default defineEventHandler(async (event) => {
  const transactions = await listTransactionsWithCategories(event)
  return { transactions }
})
