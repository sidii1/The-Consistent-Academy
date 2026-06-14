import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Neumorphic Badge — Phase 2
 *
 * Design Rules:
 *  - No flat colors, no borders.
 *  - Default: accent violet, extruded (neo-surface-sm)
 *  - Secondary: neutral surface, extruded (neo-surface-sm)
 *  - Outline: inset pill (carved into surface)
 *  - Destructive: red tint, extruded
 *  - Shape: rounded-full (pill)
 *  - Size: compact — 24px min height for readability
 */
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-full",
    "px-3 py-0.5",
    "text-xs font-semibold tracking-wide",
    "transition-all duration-300 ease-out",
    "focus:outline-none focus-visible:shadow-neo-focus",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Accent violet — for primary status, counts
        default: [
          "bg-neo-accent text-white",
          "shadow-neo-flat-xs",
        ].join(" "),

        // Neutral surface — for secondary labels
        secondary: [
          "bg-neo-base text-neo-muted",
          "shadow-neo-flat-sm",
        ].join(" "),

        // Carved pill — for subtle tags
        outline: [
          "bg-neo-base text-neo-fg",
          "shadow-neo-inset-sm",
        ].join(" "),

        // Success teal
        success: [
          "bg-neo-success text-white",
          "shadow-neo-flat-xs",
        ].join(" "),

        // Destructive red
        destructive: [
          "bg-red-500 text-white",
          "shadow-neo-flat-xs",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
