import { motion } from "framer-motion";

export const FloatingCreators = () => {
  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="fixed left-0 top-6 md:top-8 z-[60] flex items-center bg-card/95 backdrop-blur-md border border-l-0 border-primary/20 shadow-neu-lg hover:shadow-neu-xl rounded-r-full rounded-l-none transition-all duration-500 ease-out overflow-hidden group h-[92px] w-[88px] hover:w-[194px] p-2"
    >
      {/* Image (Revealed on hover, slides in from left) */}
      <div className="relative h-[76px] flex-shrink-0 w-0 opacity-0 group-hover:w-[96px] group-hover:opacity-100 group-hover:mr-2 group-hover:ml-1 transition-all duration-500 ease-out overflow-hidden rounded-s shadow-neu-inset-sm">
        <img 
          src="/developers.png" 
          alt="Siddhi & Nakul" 
          className="absolute inset-0 w-full h-full min-w-[76px] object-cover"
        />
        
        {/* Name Overlays - appears when component expands */}
        <div className="absolute bottom-0 inset-x-0 h-[40%] flex items-end pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <a
            href="https://www.linkedin.com/in/nakul-bhadade/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 text-center text-white text-[9px] font-black uppercase tracking-wider hover:text-primary transition-colors z-10 hover:scale-105 drop-shadow-md"
            title="Nakul Bhadade"
          >
            Nakul
          </a>
          <a 
            href="https://www.linkedin.com/in/siddhi-dhoke-53b7b432b/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 text-center text-white text-[9px] font-black uppercase tracking-wider hover:text-primary transition-colors z-10 hover:scale-105 drop-shadow-md"
            title="Siddhi Dhoke"
          >
            Siddhi
          </a>
        </div>
      </div>

      {/* Text block */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-[70px] text-center font-black uppercase tracking-wider text-[9.5px] md:text-[10.5px] leading-[1.2] transition-transform duration-500 group-hover:scale-[1.02]">
        <span className="text-primary block">Designed</span>
        <span className="text-foreground block text-[10.5px] my-[2px]">&</span>
        <span className="text-primary block">Developed</span>
        <span className="text-foreground block text-[8.5px] mt-[3px] tracking-widest">by</span>
      </div>
    </motion.div>
  );
};

