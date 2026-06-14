import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Neumorphic Input — Phase 2
 *
 * Design Rules:
 *  - Background: #E0E5EC (bg-neo-base) — carved from the same surface
 *  - Default: neo-inset (shallow well, shadow-neo-inset)
 *  - Focus: neo-inset-deep + accent ring (shadow-neo-focus via glow-purple-lg)
 *  - Placeholder: text-neo-placeholder (#A0AEC0) — NOT used for body text
 *  - Shape: rounded-neo-btn (16px)
 *  - No border. The shadow defines the edge.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout & shape
          "flex h-11 w-full",
          "rounded-neo-btn",
          "px-4 py-3",
          "text-sm text-neo-fg",
          // Surface — inset by default (carved into the page)
          "bg-neo-base",
          "shadow-neo-inset",
          // Placeholder
          "placeholder:text-neo-placeholder",
          // Transitions
          "transition-all duration-300 ease-out",
          // Focus: deep inset + accent ring
          "focus-visible:outline-none",
          "focus-visible:shadow-neo-inset-deep focus-visible:shadow-[var(--neu-shadow-inset-lg),var(--glow-purple-lg)]",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neo-fg",
          "md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
