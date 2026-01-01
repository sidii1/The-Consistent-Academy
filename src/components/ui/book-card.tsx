import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface BookLink {
  label: string;
  url: string;
}

interface BookCardProps {
  title: string;
  description: string;
  imagePath: string;
  links: BookLink[];
  index: number;
}

export const BookCard = ({ title, description, imagePath, links, index }: BookCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative h-[500px] perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side - Book Cover */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-card via-background to-secondary/30 p-6">
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col">
              {/* Book Image Container */}
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-lg overflow-hidden shadow-neu-lg transform transition-all duration-500 hover:scale-105 hover:shadow-neu-2xl">
                  <img
                    src={imagePath}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-sm text-primary/70 font-medium">
                  Hover to explore
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Details & Links */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 flex flex-col">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />
            
            <div className="relative flex flex-col h-full">
              {/* Title */}
              <h3 className="text-2xl font-bold text-gradient mb-4 leading-tight">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-shrink-0">
                {description}
              </p>

              {/* Links Section */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs uppercase tracking-wider text-primary/60 font-semibold mb-3">
                  Available on:
                </p>
                <div className="space-y-3">
                  {links.map((link, j) => (
                    <motion.a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-between p-3 rounded-lg bg-card/50 backdrop-blur-sm shadow-neu hover:shadow-neu-lg transition-all duration-300 hover:bg-card/80"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm font-medium text-foreground group-hover/link:text-primary transition-colors">
                        {link.label}
                      </span>
                      <ExternalLink 
                        size={16} 
                        className="text-primary/60 group-hover/link:text-primary group-hover/link:scale-110 transition-all" 
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hover indicator for mobile */}
      <div className="md:hidden absolute -bottom-8 left-0 right-0 text-center">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="text-xs text-primary/70 hover:text-primary transition-colors"
        >
          {isFlipped ? "Show cover" : "Show details"}
        </button>
      </div>
    </motion.div>
  );
};
