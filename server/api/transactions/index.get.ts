import { getQuery } from "h3"
import { listTransactionsWithCategoriesPaginated } from "../../utils/transactions-with-categories"
import { requireAuthUserId } from "../../utils/require-auth-user"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const rawSize = Number(query.pageSize ?? query.limit)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE),
  )
  const q = typeof query.q === "string" ? query.q : undefined

  const { transactions, total } = await listTransactionsWithCategoriesPaginated(
    event,
    userId,
    { page, pageSize, q },
  )

  return { transactions, total, page, pageSize }
})
