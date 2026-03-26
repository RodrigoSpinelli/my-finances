import { getTransactionWithCategory } from "../../utils/transactions-with-categories"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "id ausente" })
  }

  const transaction = await getTransactionWithCategory(event, id)
  return { transaction }
})
