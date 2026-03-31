import type { Tables } from "~/types/database.types"

/** Linha retornada pelo Supabase com join `icons(name)`. */
export type CategoryRowWithIconJoin = Tables<"categories"> & {
  icons: { name: string } | null
}

/** Resposta da API: linha da tabela + nome Iconify resolvido. */
export type CategoryWithIconName = Tables<"categories"> & {
  icon: string
}

export function flattenCategoryIcon(
  row: CategoryRowWithIconJoin,
): CategoryWithIconName {
  const { icons, ...rest } = row
  return {
    ...rest,
    icon: icons?.name ?? "lucide:tag",
  }
}
