import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * NeumorphicCard — Custom animated card primitive (Phase 2)
 *
 * Use for feature cards that need Framer Motion entrance animations.
 * For static cards in layouts, prefer the shadcn <Card> component.
 *
 * Design Rules:
 *  - Background: bg-neo-base (#E0E5EC) — same material as the page
 *  - Shape: rounded-neo-card (32px) — soft, pillowed
 *  - Resting: shadow-neo-flat (extruded from surface)
 *  - Hover: -2px lift + shadow-neo-lifted
 *  - Pressed: shadow-neo-inset + translateY(0) (carved into surface)
 *  - No borders. No bg-white. No gradients on the card shell.
 */
interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  pressed?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const NeumorphicCard = ({
  children,
  className,
  hover = true,
  pressed = false,
  delay = 0,
  onClick,
}: NeumorphicCardProps) => {
  return (
    <motion.div
      className={cn(
        // Shape
        "rounded-neo-card p-8",
        // Transitions
        "transition-shadow transition-transform duration-300 ease-out",
        // Surface state: extruded or inset
        pressed
          ? "neo-inset bg-neo-base"
          : "neo-surface",
        // Hover lift (CSS, not Framer Motion, so it composes with entrance anim)
        hover && !pressed && "hover:shadow-neo-lifted hover:-translate-y-0.5",
        className,
      )}
      onClick={onClick}
      // Entrance animation
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
};
