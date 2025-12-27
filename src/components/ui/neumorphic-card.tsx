import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  pressed?: boolean;
  delay?: number;
}

export const NeumorphicCard = ({
  children,
  className,
  hover = true,
  pressed = false,
  delay = 0,
}: NeumorphicCardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-3xl bg-card p-6 transition-all duration-300",
        pressed ? "shadow-neu-inset" : "shadow-neu",
        hover && "hover:shadow-neu-lg",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : undefined}
    >
      {children}
    </motion.div>
  );
};
