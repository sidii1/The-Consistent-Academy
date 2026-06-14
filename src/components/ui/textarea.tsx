import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Neumorphic Textarea — Phase 2
 *
 * Same design rules as Input:
 *  - neo-inset by default (carved into surface)
 *  - Focus: neo-inset-deep + accent ring
 *  - No border. No bg-white.
 *  - resize-none for clean layout
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Layout & shape
          "flex min-h-[120px] w-full",
          "rounded-neo-btn",
          "px-4 py-3",
          "text-sm text-neo-fg",
          // Surface — inset (carved)
          "bg-neo-base",
          "shadow-neo-inset",
          // Placeholder
          "placeholder:text-neo-placeholder",
          // Transitions
          "transition-all duration-300 ease-out",
          // Focus: deeper inset + accent ring
          "focus-visible:outline-none",
          "focus-visible:shadow-[var(--neu-shadow-inset-lg),var(--glow-purple-lg)]",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
