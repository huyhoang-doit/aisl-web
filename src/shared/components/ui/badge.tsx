import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        warning:
          "border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-700",
        success:
          "border-emerald-300 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-700",
        info:
          "border-blue-300 bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-700",
        progress:
          "border-sky-300 bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200 dark:border-sky-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
