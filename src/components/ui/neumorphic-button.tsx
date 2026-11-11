
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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
    "bg-[#42106F] text-white",
    "rounded-full",
    "shadow-[inset_0_0.3rem_0.9rem_rgba(224,190,255,0.4),inset_0_-0.1rem_0.3rem_rgba(20,5,35,0.8),inset_0_-0.4rem_0.9rem_rgba(190,130,255,0.5),0_3rem_3rem_rgba(80,20,140,0.35),0_1rem_1rem_-0.6rem_rgba(20,5,40,0.85)]",
    "hover:shadow-[inset_0_0.3rem_0.5rem_rgba(255,255,255,0.5),inset_0_-0.1rem_0.3rem_rgba(20,5,35,0.8),inset_0_-0.4rem_0.9rem_rgba(196,145,255,0.7),0_3rem_3rem_rgba(120,30,190,0.35),0_1rem_1rem_-0.6rem_rgba(20,5,40,0.85),0_0_32px_rgba(168,85,247,0.28)]",
    "active:translate-y-1",
    "focus-visible:shadow-neo-focus",
    "before:content-[''] before:absolute before:-left-[15%] before:-right-[15%] before:-top-full before:bottom-[25%] before:rounded-[50%] before:bg-[rgba(192,132,252,0.22)] before:transition-transform before:duration-300 hover:before:-translate-y-[5%]",
    "after:content-[''] after:absolute after:left-[6%] after:right-[6%] after:top-[12%] after:bottom-[40%] after:rounded-t-[22px] after:shadow-[inset_0_10px_8px_-10px_rgba(255,255,255,0.5)] after:bg-[linear-gradient(180deg,rgba(255,255,255,0.38)_0%,rgba(168,85,247,0)_50%)] after:transition-all after:duration-300 hover:after:translate-y-[5%] hover:after:opacity-45",
  ),

    secondary: cn(
      "neo-surface",
      "text-[#42106F]",
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

  // max-sm: overrides keep long labels from clipping on phones (they may wrap
  // onto two centred lines instead); ≥640px sizing is unchanged.
  const sizes = {
    sm: "h-9 px-6 py-2 text-sm",
    md: "h-11 px-9 py-2.5 text-base max-sm:h-auto max-sm:min-h-11 max-sm:px-6 max-sm:leading-snug",
    lg: "h-12 px-12 py-3 text-lg max-sm:h-auto max-sm:min-h-12 max-sm:px-7 max-sm:text-base max-sm:leading-snug",
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
      <span className={cn("relative z-10 flex items-center justify-center gap-2.5 max-sm:text-center", variant === "primary" && "text-white")}>
        {children}
      </span>
    </motion.button>
  );
};
