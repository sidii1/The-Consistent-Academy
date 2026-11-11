import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { reveal } from "@/lib/device";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "raised" | "purple";
}

export const SectionWrapper = ({ 
  children, 
  className, 
  id,
  variant = "default" 
}: SectionWrapperProps) => {
  const variants = {
    default: "",
    // max-sm: phones lose too much width to stacked margins + padding.
    raised: "rounded-[3rem] shadow-neu-lg bg-gradient-to-br from-card to-secondary/10 p-8 md:p-12 mx-4 md:mx-8 max-sm:mx-0 max-sm:px-4 max-sm:rounded-[2rem]",
    purple: "bg-section-purple rounded-[3rem] p-8 md:p-12 mx-4 md:mx-8 max-sm:mx-0 max-sm:px-4 max-sm:rounded-[2rem]",
  };

  return (
    <motion.section
      id={id}
      className={cn(
        "py-16 md:py-14 relative overflow-visible",
        variants[variant],
        className
      )}
      {...reveal(
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-100px" },
          transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        // Children already animate themselves; skip the extra wrapper fade on mobile.
        "none",
      )}
    >
      <div className={cn("container mx-auto px-4", variant !== "default" && "max-sm:px-0")}>
        {children}
      </div>
    </motion.section>
  );
};
