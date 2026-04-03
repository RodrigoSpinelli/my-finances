import { getQuery } from "h3"
import {
  listTransactionsWithCategoriesPaginated,
  type TransactionListFilters,
} from "../../utils/transactions-with-categories"
import { requireAuthUserId } from "../../utils/require-auth-user"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function parseFilters(query: Record<string, unknown>): TransactionListFilters {
  const filters: TransactionListFilters = {}

  const date = typeof query.date === "string" ? query.date.trim() : ""
  if (date && ISO_DATE.test(date)) {
    filters.date = date
  }

  const typeRaw = typeof query.type === "string" ? query.type.trim() : ""
  if (typeRaw === "income" || typeRaw === "expense") {
    filters.type = typeRaw
  }

  const categoryId =
    typeof query.categoryId === "string" ? query.categoryId.trim() : ""
  if (categoryId && UUID_RE.test(categoryId)) {
    filters.categoryId = categoryId
  }

  return filters
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuthUserId(event)
  const query = getQuery(event)

  const page = Math.max(1, Number(query.page) || 1)
  const rawSize = Number(query.pageSize ?? query.limit)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_PAGE_SIZE),
  )
  const filters = parseFilters(query)

  const { transactions, total } = await listTransactionsWithCategoriesPaginated(
    event,
    userId,
    { page, pageSize, filters },
  )

  return { transactions, total, page, pageSize }
})
