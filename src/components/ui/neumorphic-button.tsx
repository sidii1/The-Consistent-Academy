import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * NeumorphicButton — Custom animated button primitive (Phase 2)
 *
 * Use this when you need Framer Motion spring animations (e.g. hero CTAs).
 * For regular UI buttons, prefer the shadcn <Button> component.
 *
 * Design Rules:
 *  - Primary: neo-accent-surface (violet gradient, extruded)
 *  - Secondary: neo-surface (base grey, extruded)
 *  - Ghost: transparent, gains neo-surface-sm on hover
 *  - Focus: shadow-neo-focus (2px accent ring via box-shadow)
 *  - No borders. No bg-white. No flat designs.
 */
interface NeumorphicButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const NeumorphicButton = ({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled = false,
}: NeumorphicButtonProps) => {
  const base =
    "relative font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus-visible:outline-none";

  const variants = {
    primary: cn(
      "neo-accent-surface",                 // violet gradient + extruded shadow
      "text-white",
      "rounded-neo-btn",
      "focus-visible:shadow-neo-focus",
    ),
    secondary: cn(
      "neo-surface",                        // base grey extruded
      "text-neo-fg",
      "rounded-neo-btn",
      "focus-visible:shadow-neo-focus",
    ),
    ghost: cn(
      "bg-transparent text-neo-muted",
      "rounded-neo-btn",
      "hover:bg-neo-base hover:shadow-neo-flat-sm hover:text-neo-fg",
      "focus-visible:shadow-neo-focus",
    ),
  };

  const sizes = {
    sm: "h-9  px-5  py-2   text-sm",
    md: "h-11 px-7  py-2.5 text-base",
    lg: "h-12 px-10 py-3   text-lg",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              y: -2,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              scale: 0.98,
              y: 0.5,
              transition: { type: "spring", stiffness: 600, damping: 25 },
            }
          : undefined
      }
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </span>
    </motion.button>
  );
};
