import { motion } from "framer-motion";

export const FloatingCreators = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
      className="fixed left-3 md:left-5 top-3 md:top-4 z-[60]"
    >
      <div className="relative p-1.5 md:p-2 rounded-xl shadow-neu-md border border-white/20 w-[90px] md:w-[110px] flex flex-col items-center bg-background/80 backdrop-blur-md">
        
        <span className="text-[8px] md:text-[7.5px] font-bold text-primary uppercase tracking-widest mb-1 text-center w-full leading-[1.2]">
          Designed & 
          <br />
          Developed by
        </span>
        
        <div className="w-full relative mb-1 rounded-lg overflow-hidden shadow-neu-inner bg-gradient-to-br from-primary/10 to-accent/10 mt-0.5">
          <img 
            src="/developers.png" 
            alt="Nakul & Siddhi" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="flex justify-between w-full px-1 text-[10px] md:text-[10px] font-semibold">
          <a 
            href="https://www.linkedin.com/in/nakul-bhadade/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors hover:underline"
          >
            Nakul
          </a>
          <a 
            href="https://www.linkedin.com/in/siddhi-dhoke-53b7b432b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors hover:underline"
          >
            Siddhi
          </a>
        </div>
      </div>
    </motion.div>
  );
};
