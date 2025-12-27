import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeumorphicButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const NeumorphicButton = ({
  children,
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  onClick,
  type = "button",
  disabled = false,
}: NeumorphicButtonProps) => {
  const baseStyles = "relative rounded-2xl font-medium transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-neu hover:shadow-glow",
    secondary: "bg-card text-foreground shadow-neu hover:shadow-neu-lg active:shadow-neu-inset",
    ghost: "bg-transparent text-foreground hover:bg-secondary/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={!disabled ? { scale: magnetic ? 1.02 : 1, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
