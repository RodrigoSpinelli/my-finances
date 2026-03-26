/**
 * Paleta nomeada (ex.: categorias): valor no banco = token Tailwind (`orange`, `blue`, …).
 * Pré-visualização: classe `bg-{token}-600` (literal para o scanner do Tailwind).
 */
export const COLOR_NAMES = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
] as const

export type ColorName = (typeof COLOR_NAMES)[number]

/** Classes literais para o Tailwind incluir no bundle */
export const COLOR_SWATCH_BG: Record<ColorName, string> = {
  red: "bg-red-600",
  orange: "bg-orange-600",
  amber: "bg-amber-600",
  yellow: "bg-yellow-600",
  lime: "bg-lime-600",
  green: "bg-green-600",
  emerald: "bg-emerald-600",
  teal: "bg-teal-600",
  cyan: "bg-cyan-600",
  sky: "bg-sky-600",
  blue: "bg-blue-600",
  indigo: "bg-indigo-600",
  violet: "bg-violet-600",
  purple: "bg-purple-600",
  fuchsia: "bg-fuchsia-600",
  pink: "bg-pink-600",
  rose: "bg-rose-600",
  slate: "bg-slate-600",
  gray: "bg-gray-600",
  zinc: "bg-zinc-600",
}

export function isColorName(value: string): value is ColorName {
  return (COLOR_NAMES as readonly string[]).includes(value)
}

/** Classe da bolinha: `bg-{nome}-600` quando o nome é válido */
export function colorSwatchBgClass(
  name: string | null | undefined,
): string {
  if (!name || !isColorName(name)) return "bg-muted"
  return COLOR_SWATCH_BG[name]
}

/** Opções para selects com bolinha de cor (valor = token salvo no banco) */
export const COLOR_SELECT_OPTIONS: {
  value: ColorName
  label: string
  swatchClass: string
}[] = COLOR_NAMES.map((value) => ({
  value,
  label: value,
  swatchClass: COLOR_SWATCH_BG[value],
}))
