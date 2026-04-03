import type { Tables } from "~/types/database.types"

/** Como a API devolve categorias: joins achatados para UI. */
export type Category = Tables<"categories"> & {
  icon: string
  /** Token Tailwind (`colors.name`), derivado do join com `colors`. */
  color: string | null
}