import { motion } from "framer-motion";

export const FloatingCreators = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
      className="fixed left-3 md:left-4 top-3 md:top-4 z-[60] group"
    >
      <div className="relative pt-1 pb-4 px-4 rounded-[40px] shadow-neu-lg border border-white/20 w-[130px] md:w-[150px] flex flex-col items-center bg-background/80 backdrop-blur-md transition-all duration-500 hover:shadow-neu-xl">
        
        {/* Slightly Curved Text via SVG */}
        <div className="w-[110%] flex justify-center mb-0 pointer-events-none" style={{ marginLeft: "-5%" }}>
          <svg viewBox="0 0 120 35" className="w-full overflow-visible">
            {/* Gentle Quadratic Bezier Curve */}
            <path id="dev-curve" d="M 0 35 Q 60 0 120 35" fill="transparent" />
            <text 
              style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }} 
              className="fill-current text-primary"
            >
              <textPath href="#dev-curve" startOffset="50%" textAnchor="middle">
                Designed & Developed
              </textPath>
            </text>
          </svg>
        </div>

        <span className="text-[8px] md:text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-[-5px] mb-2">
          By
        </span>
        
        <div className="flex justify-between w-full px-1 text-[12px] md:text-[14px] font-black">
          <a 
            href="https://www.linkedin.com/in/nakul-bhadade/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4"
          >
            Nakul
          </a>
          <span className="text-muted-foreground/30 select-none font-medium">&</span>
          <a 
            href="https://www.linkedin.com/in/siddhi-dhoke-53b7b432b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4"
          >
            Siddhi
          </a>
        </div>

        {/* Hover Image Pop-up */}
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 mt-4 w-[180px] md:w-[150px] pointer-events-none opacity-0 translate-y-[-15px] scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-400 ease-out rounded-2xl overflow-hidden shadow-neu-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/20">
          <img 
            src="/developers.png" 
            alt="Nakul & Siddhi" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};
