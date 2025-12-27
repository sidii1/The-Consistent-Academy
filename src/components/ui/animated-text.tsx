import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export const AnimatedText = ({
  children,
  className,
  delay = 0,
  as: Component = "p",
}: AnimatedTextProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Component className={cn(className)}>{children}</Component>
    </motion.div>
  );
};

export const AnimatedHeading = ({
  children,
  className,
  delay = 0,
}: AnimatedTextProps) => {
  return (
    <motion.h2
      className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
        className
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.h2>
  );
};
