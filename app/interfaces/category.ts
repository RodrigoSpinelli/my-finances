import type { Tables } from "~/types/database.types"

/** Como a API devolve categorias: `icon` é o valor Iconify vindo do join com `icons`. */
export type Category = Tables<"categories"> & {
  icon: string
}