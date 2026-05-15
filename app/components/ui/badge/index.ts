import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { COLOR_NAMES } from "../../../../shared/colors";

export { default as Badge } from "./Badge.vue";

/** Nomes de cor vindos do banco (`colors.name`) que têm variante de badge. */
export const CATEGORY_BADGE_COLOR_NAMES = new Set<string>(COLOR_NAMES);

/**
 * Etiquetas coloridas: fundo bem baixo + texto na mesma família (tom sobre tom).
 * Classes literais para o Tailwind incluir no bundle.
 */
const TINT = {
  red: "border-0 bg-red-500/10 text-red-700 shadow-none ring-1 ring-red-500/20 transition-colors hover:bg-red-500/[0.16] [a&]:hover:bg-red-500/[0.16] dark:bg-red-400/12 dark:text-red-300 dark:ring-red-400/25 dark:hover:bg-red-400/[0.18] [a&]:dark:hover:bg-red-400/[0.18]",
  orange:
    "border-0 bg-orange-500/10 text-orange-800 shadow-none ring-1 ring-orange-500/20 transition-colors hover:bg-orange-500/[0.16] [a&]:hover:bg-orange-500/[0.16] dark:bg-orange-400/12 dark:text-orange-300 dark:ring-orange-400/25 dark:hover:bg-orange-400/[0.18] [a&]:dark:hover:bg-orange-400/[0.18]",
  amber:
    "border-0 bg-amber-500/11 text-amber-800 shadow-none ring-1 ring-amber-500/22 transition-colors hover:bg-amber-500/[0.17] [a&]:hover:bg-amber-500/[0.17] dark:bg-amber-400/12 dark:text-amber-300 dark:ring-amber-400/25 dark:hover:bg-amber-400/[0.18] [a&]:dark:hover:bg-amber-400/[0.18]",
  yellow:
    "border-0 bg-yellow-400/14 text-yellow-900 shadow-none ring-1 ring-yellow-500/22 transition-colors hover:bg-yellow-400/[0.22] [a&]:hover:bg-yellow-400/[0.22] dark:bg-yellow-400/12 dark:text-yellow-300 dark:ring-yellow-400/25 dark:hover:bg-yellow-400/[0.18] [a&]:dark:hover:bg-yellow-400/[0.18]",
  lime: "border-0 bg-lime-500/11 text-lime-800 shadow-none ring-1 ring-lime-500/22 transition-colors hover:bg-lime-500/[0.17] [a&]:hover:bg-lime-500/[0.17] dark:bg-lime-400/12 dark:text-lime-300 dark:ring-lime-400/25 dark:hover:bg-lime-400/[0.18] [a&]:dark:hover:bg-lime-400/[0.18]",
  green:
    "border-0 bg-green-500/10 text-green-800 shadow-none ring-1 ring-green-500/20 transition-colors hover:bg-green-500/[0.16] [a&]:hover:bg-green-500/[0.16] dark:bg-green-400/12 dark:text-green-300 dark:ring-green-400/25 dark:hover:bg-green-400/[0.18] [a&]:dark:hover:bg-green-400/[0.18]",
  emerald:
    "border-0 bg-emerald-500/10 text-emerald-800 shadow-none ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/[0.16] [a&]:hover:bg-emerald-500/[0.16] dark:bg-emerald-400/12 dark:text-emerald-300 dark:ring-emerald-400/25 dark:hover:bg-emerald-400/[0.18] [a&]:dark:hover:bg-emerald-400/[0.18]",
  teal: "border-0 bg-teal-500/10 text-teal-800 shadow-none ring-1 ring-teal-500/20 transition-colors hover:bg-teal-500/[0.16] [a&]:hover:bg-teal-500/[0.16] dark:bg-teal-400/12 dark:text-teal-300 dark:ring-teal-400/25 dark:hover:bg-teal-400/[0.18] [a&]:dark:hover:bg-teal-400/[0.18]",
  cyan: "border-0 bg-cyan-500/10 text-cyan-800 shadow-none ring-1 ring-cyan-500/20 transition-colors hover:bg-cyan-500/[0.16] [a&]:hover:bg-cyan-500/[0.16] dark:bg-cyan-400/12 dark:text-cyan-300 dark:ring-cyan-400/25 dark:hover:bg-cyan-400/[0.18] [a&]:dark:hover:bg-cyan-400/[0.18]",
  sky: "border-0 bg-sky-500/10 text-sky-800 shadow-none ring-1 ring-sky-500/20 transition-colors hover:bg-sky-500/[0.16] [a&]:hover:bg-sky-500/[0.16] dark:bg-sky-400/12 dark:text-sky-300 dark:ring-sky-400/25 dark:hover:bg-sky-400/[0.18] [a&]:dark:hover:bg-sky-400/[0.18]",
  blue: "border-0 bg-blue-500/10 text-blue-800 shadow-none ring-1 ring-blue-500/20 transition-colors hover:bg-blue-500/[0.16] [a&]:hover:bg-blue-500/[0.16] dark:bg-blue-400/12 dark:text-blue-300 dark:ring-blue-400/25 dark:hover:bg-blue-400/[0.18] [a&]:dark:hover:bg-blue-400/[0.18]",
  indigo:
    "border-0 bg-indigo-500/10 text-indigo-800 shadow-none ring-1 ring-indigo-500/20 transition-colors hover:bg-indigo-500/[0.16] [a&]:hover:bg-indigo-500/[0.16] dark:bg-indigo-400/12 dark:text-indigo-300 dark:ring-indigo-400/25 dark:hover:bg-indigo-400/[0.18] [a&]:dark:hover:bg-indigo-400/[0.18]",
  violet:
    "border-0 bg-violet-500/10 text-violet-800 shadow-none ring-1 ring-violet-500/20 transition-colors hover:bg-violet-500/[0.16] [a&]:hover:bg-violet-500/[0.16] dark:bg-violet-400/12 dark:text-violet-300 dark:ring-violet-400/25 dark:hover:bg-violet-400/[0.18] [a&]:dark:hover:bg-violet-400/[0.18]",
  purple:
    "border-0 bg-purple-500/10 text-purple-800 shadow-none ring-1 ring-purple-500/20 transition-colors hover:bg-purple-500/[0.16] [a&]:hover:bg-purple-500/[0.16] dark:bg-purple-400/12 dark:text-purple-300 dark:ring-purple-400/25 dark:hover:bg-purple-400/[0.18] [a&]:dark:hover:bg-purple-400/[0.18]",
  fuchsia:
    "border-0 bg-fuchsia-500/10 text-fuchsia-800 shadow-none ring-1 ring-fuchsia-500/20 transition-colors hover:bg-fuchsia-500/[0.16] [a&]:hover:bg-fuchsia-500/[0.16] dark:bg-fuchsia-400/12 dark:text-fuchsia-300 dark:ring-fuchsia-400/25 dark:hover:bg-fuchsia-400/[0.18] [a&]:dark:hover:bg-fuchsia-400/[0.18]",
  pink: "border-0 bg-pink-500/10 text-pink-800 shadow-none ring-1 ring-pink-500/20 transition-colors hover:bg-pink-500/[0.16] [a&]:hover:bg-pink-500/[0.16] dark:bg-pink-400/12 dark:text-pink-300 dark:ring-pink-400/25 dark:hover:bg-pink-400/[0.18] [a&]:dark:hover:bg-pink-400/[0.18]",
  rose: "border-0 bg-rose-500/10 text-rose-800 shadow-none ring-1 ring-rose-500/20 transition-colors hover:bg-rose-500/[0.16] [a&]:hover:bg-rose-500/[0.16] dark:bg-rose-400/12 dark:text-rose-300 dark:ring-rose-400/25 dark:hover:bg-rose-400/[0.18] [a&]:dark:hover:bg-rose-400/[0.18]",
  slate:
    "border-0 bg-slate-500/10 text-slate-800 shadow-none ring-1 ring-slate-500/20 transition-colors hover:bg-slate-500/[0.15] [a&]:hover:bg-slate-500/[0.15] dark:bg-slate-400/12 dark:text-slate-300 dark:ring-slate-400/25 dark:hover:bg-slate-400/[0.18] [a&]:dark:hover:bg-slate-400/[0.18]",
  gray: "border-0 bg-gray-500/10 text-gray-800 shadow-none ring-1 ring-gray-500/20 transition-colors hover:bg-gray-500/[0.15] [a&]:hover:bg-gray-500/[0.15] dark:bg-gray-400/12 dark:text-gray-300 dark:ring-gray-400/25 dark:hover:bg-gray-400/[0.18] [a&]:dark:hover:bg-gray-400/[0.18]",
  zinc: "border-0 bg-zinc-500/10 text-zinc-800 shadow-none ring-1 ring-zinc-500/20 transition-colors hover:bg-zinc-500/[0.15] [a&]:hover:bg-zinc-500/[0.15] dark:bg-zinc-400/12 dark:text-zinc-300 dark:ring-zinc-400/25 dark:hover:bg-zinc-400/[0.18] [a&]:dark:hover:bg-zinc-400/[0.18]",
} as const;

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border font-medium tracking-tight whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:focus-visible:ring-destructive dark:focus-visible:ring-offset-background antialiased",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm ring-1 ring-black/10 hover:bg-primary/88 [a&]:hover:bg-primary/88 dark:ring-white/10",
        secondary:
          "border-border/80 bg-muted text-foreground/90 shadow-xs ring-1 ring-black/5 hover:bg-muted/80 hover:text-foreground [a&]:hover:bg-muted/80 dark:bg-muted/50 dark:ring-white/10 dark:hover:bg-muted/70",
        destructive:
          "border-0 bg-destructive/12 text-destructive shadow-none ring-1 ring-destructive/25 transition-colors hover:bg-destructive/18 [a&]:hover:bg-destructive/18 dark:bg-destructive/15 dark:text-destructive dark:ring-destructive/30 dark:hover:bg-destructive/22 [a&]:dark:hover:bg-destructive/22",
        outline:
          "border border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground shadow-none hover:border-muted-foreground/55 hover:bg-muted/50 hover:text-foreground [a&]:hover:bg-muted/50 dark:hover:bg-muted/30",
        red: TINT.red,
        orange: TINT.orange,
        amber: TINT.amber,
        yellow: TINT.yellow,
        lime: TINT.lime,
        green: TINT.green,
        emerald: TINT.emerald,
        teal: TINT.teal,
        cyan: TINT.cyan,
        sky: TINT.sky,
        blue: TINT.blue,
        indigo: TINT.indigo,
        violet: TINT.violet,
        purple: TINT.purple,
        fuchsia: TINT.fuchsia,
        pink: TINT.pink,
        rose: TINT.rose,
        slate: TINT.slate,
        gray: TINT.gray,
        zinc: TINT.zinc,
        "green-light": TINT.emerald,
        "red-light": TINT.rose,
      },
      size: {
        default:
          "gap-1 px-2.5 py-1 text-xs [&>svg]:size-3.5",
        sm: "gap-0.5 rounded-md px-2 py-0.5 text-[11px] leading-none [&>svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/** Normaliza `colors.name` da API para variante de Badge (fallback: default). */
export function categoryColorToBadgeVariant(
  color: string | null | undefined,
): NonNullable<BadgeVariants["variant"]> {
  if (color != null && CATEGORY_BADGE_COLOR_NAMES.has(color))
    return color as NonNullable<BadgeVariants["variant"]>;
  return "default";
}
