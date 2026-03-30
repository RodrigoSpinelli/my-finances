import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/90 text-primary-foreground hover:bg-primary/95 [a&]:hover:bg-primary/95",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary/90 [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive/90 text-white hover:bg-destructive [a&]:hover:bg-destructive focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/50 dark:bg-destructive/70",
        outline:
          "text-foreground/80 border-foreground/20 hover:bg-accent/40 [a&]:hover:bg-accent/40 hover:text-accent-foreground [a&]:hover:text-accent-foreground",
        red: 
          "border-red-500/50 bg-red-500/70 text-white hover:bg-red-500/90 [a&]:hover:bg-red-500/90",
        blue: 
          "border-blue-400/50 bg-blue-400/60 text-white hover:bg-blue-500/80 [a&]:hover:bg-blue-500/80",
        purple: 
          "border-purple-500/40 bg-purple-400/60 text-white hover:bg-purple-500 [a&]:hover:bg-purple-500",
        yellow: 
          "border-yellow-300/60 bg-yellow-200/80 text-yellow-900 hover:bg-yellow-400/90 [a&]:hover:bg-yellow-400/90",
        gray:
          "border-gray-400/40 bg-gray-300/70 text-gray-800 hover:bg-gray-400/70 [a&]:hover:bg-gray-400/70",
        green:
          "border-green-500/50 bg-green-400/60 text-white hover:bg-green-600/90 [a&]:hover:bg-green-600/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
