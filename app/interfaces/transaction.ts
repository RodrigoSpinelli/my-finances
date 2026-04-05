import type { Tables } from "~/types/database.types"
import type { Category } from "./category";

export type Transaction = Tables<"transactions">

export type TransactionWithCategory = Transaction & {
  category: Category | null;
}