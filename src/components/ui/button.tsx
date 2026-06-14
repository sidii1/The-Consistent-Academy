import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Neumorphic Button — Phase 2
 *
 * Design Rules:
 *  - No borders. No bg-white. No flat designs.
 *  - Default (primary): accent violet gradient surface, shadow-neo-flat
 *  - Secondary: bg-neo-base surface, shadow-neo-flat
 *  - Ghost: transparent, only subtle shadow on hover
 *  - Hover: translateY(-1px) + shadow-neo-lifted
 *  - Active: translateY(0.5px) + shadow-neo-inset-sm (physical press-down)
 *  - Focus: 2px accent ring via shadow-neo-focus (box-shadow approach, no outline)
 *  - Min touch target: 44px height (h-11 = 44px)
 */
const buttonVariants = cva(
  // ── Base: shared across all variants ──
  [
    "relative inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-semibold",
    "transition-all duration-300 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── PRIMARY: Accent violet, extruded from surface ──
        default: [
          "neo-accent-surface",           // gradient bg + neo-flat shadow + hover/active built-in
          "text-white",
          "rounded-neo-btn",
          "focus-visible:shadow-neo-focus",
        ].join(" "),

        // ── SECONDARY: Same surface color, extruded ──
        secondary: [
          "neo-surface",
          "text-neo-fg",
          "rounded-neo-btn",
          "hover:shadow-neo-lifted hover:-translate-y-px",
          "active:neo-inset-sm active:translate-y-0.5",
          "focus-visible:shadow-neo-focus",
        ].join(" "),

        // ── DESTRUCTIVE: Keeps semantic red, neumorphic depth ──
        destructive: [
          "bg-gradient-to-br from-red-500 to-red-600",
          "text-white",
          "rounded-neo-btn",
          "shadow-neo-flat",
          "hover:shadow-neo-lifted hover:-translate-y-px",
          "active:shadow-neo-inset-sm active:translate-y-0.5",
          "focus-visible:shadow-neo-focus",
        ].join(" "),

        // ── OUTLINE: No border — uses shallow neo-flat-sm depth ──
        outline: [
          "bg-neo-base",
          "text-neo-fg",
          "rounded-neo-btn",
          "shadow-neo-flat-sm",
          "hover:shadow-neo-flat hover:-translate-y-px",
          "active:shadow-neo-inset-sm active:translate-y-0.5",
          "focus-visible:shadow-neo-focus",
        ].join(" "),

        // ── GHOST: Minimal, gains depth only on hover ──
        ghost: [
          "bg-transparent text-neo-muted",
          "rounded-neo-btn",
          "hover:bg-neo-base hover:shadow-neo-flat-sm hover:text-neo-fg",
          "active:shadow-neo-inset-sm",
          "focus-visible:shadow-neo-focus",
        ].join(" "),

        // ── LINK: Purely typographic, no depth ──
        link: [
          "text-neo-accent underline-offset-4",
          "hover:underline hover:text-neo-accent-light",
          "focus-visible:shadow-neo-focus rounded-neo-inner",
        ].join(" "),
      },

      size: {
        // Min 44px height for WCAG touch targets
        default: "h-11 px-6 py-2.5 text-sm",
        sm:      "h-9  px-4 py-2   text-xs  rounded-neo-inner",
        lg:      "h-12 px-8 py-3   text-base",
        xl:      "h-14 px-10 py-3.5 text-lg",
        icon:    "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
