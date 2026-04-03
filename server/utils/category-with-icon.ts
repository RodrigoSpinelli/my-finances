import type { Tables } from "~/types/database.types"

/** Linha retornada pelo Supabase com join `icons(name)` e `colors(name)`. */
export type CategoryRowWithIconJoin = Tables<"categories"> & {
  icons: { name: string } | null
  colors: { name: string } | null
}

/** Resposta da API: linha da tabela + nome Iconify e token Tailwind da cor. */
export type CategoryWithIconName = Tables<"categories"> & {
  icon: string
  /** Token Tailwind (`colors.name`); uso em swatch e gráficos. */
  color: string | null
}

export function flattenCategoryIcon(
  row: CategoryRowWithIconJoin,
): CategoryWithIconName {
  const { icons, colors, ...rest } = row
  return {
    ...rest,
    icon: icons?.name ?? "lucide:tag",
    color: colors?.name ?? null,
  }
}
