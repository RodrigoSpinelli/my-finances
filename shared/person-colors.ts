/**
 * Cores permitidas para pessoas: valor salvo no banco = token Tailwind (ex.: "orange").
 * Pré-visualização: classe `bg-{token}-600` (definida explicitamente para o scanner do Tailwind).
 */
export const PERSON_COLOR_NAMES = [
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

export type PersonColorName = (typeof PERSON_COLOR_NAMES)[number]

/** Classes literais para o Tailwind incluir no bundle */
export const PERSON_SWATCH_BG: Record<PersonColorName, string> = {
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

export function isPersonColorName(value: string): value is PersonColorName {
  return (PERSON_COLOR_NAMES as readonly string[]).includes(value)
}

/** Classe da bolinha: `bg-{nome}-600` quando o nome é válido */
export function personSwatchBgClass(
  name: string | null | undefined,
): string {
  if (!name || !isPersonColorName(name)) return "bg-muted"
  return PERSON_SWATCH_BG[name]
}

export const PERSON_COLOR_OPTIONS: {
  value: PersonColorName
  label: string
  swatchClass: string
}[] = PERSON_COLOR_NAMES.map((value) => ({
  value,
  label: value,
  swatchClass: PERSON_SWATCH_BG[value],
}))
