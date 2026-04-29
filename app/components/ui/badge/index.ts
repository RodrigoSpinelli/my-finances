import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border border-primary bg-primary text-primary-foreground hover:bg-primary/90 [a&]:hover:bg-primary/90 dark:bg-primary/80 dark:border-primary/60",
        secondary:
          "border border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90 [a&]:hover:bg-secondary/90 dark:bg-secondary/80 dark:border-secondary/60",
        destructive:
          "border border-destructive bg-destructive text-white hover:bg-destructive/90 [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/50 dark:bg-destructive/80 dark:border-destructive/60",
        outline:
          "border border-foreground/50 text-foreground hover:bg-accent/50 [a&]:hover:bg-accent/50 hover:text-accent-foreground [a&]:hover:text-accent-foreground dark:border-foreground/40",
        red: "border border-red-500 bg-red-500 text-white hover:bg-red-600 [a&]:hover:bg-red-600 dark:bg-red-500/80 dark:border-red-600/60",
        blue: "border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 [a&]:hover:bg-blue-600 dark:bg-blue-500/80 dark:border-blue-600/60",
        purple:
          "border border-purple-500 bg-purple-500 text-white hover:bg-purple-600 [a&]:hover:bg-purple-600 dark:bg-purple-500/80 dark:border-purple-600/60",
        yellow:
          "border border-yellow-400 bg-yellow-300 text-yellow-900 hover:bg-yellow-400 [a&]:hover:bg-yellow-400 dark:bg-yellow-300/90 dark:border-yellow-500/70",
        gray: "border border-gray-400 bg-gray-300 text-gray-900 hover:bg-gray-400 [a&]:hover:bg-gray-400 dark:bg-gray-400/80 dark:border-gray-600/60",
        green:
          "border border-green-500 bg-green-500 text-white hover:bg-green-600 [a&]:hover:bg-green-600 dark:bg-green-500/80 dark:border-green-600/60",
        emerald:
          "border border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 [a&]:hover:bg-emerald-600 dark:bg-emerald-500/80 dark:border-emerald-600/60",
        amber:
          "border border-amber-500 bg-amber-500 text-white hover:bg-amber-600 [a&]:hover:bg-amber-600 dark:bg-amber-500/80 dark:border-amber-600/60",
        indigo:
          "border border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600 [a&]:hover:bg-indigo-600 dark:bg-indigo-500/80 dark:border-indigo-600/60",
        'green-light':
          "border border-green-300 bg-green-100 text-green-800 hover:bg-green-200 [a&]:hover:bg-green-200 dark:bg-green-300/30 dark:border-green-400/50 dark:text-green-100",
        'red-light':
          "border border-red-300 bg-red-100 text-red-800 hover:bg-red-200 [a&]:hover:bg-red-200 dark:bg-red-300/30 dark:border-red-400/50 dark:text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
