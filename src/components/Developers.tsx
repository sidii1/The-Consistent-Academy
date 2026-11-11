import { useState } from "react";
import { motion } from "framer-motion";
import { IS_TOUCH } from "@/lib/device";

export const Developers = () => {
  // Touch devices can't hover — a tap toggles the expanded (hover) state.
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      data-open={open}
      onClick={
        IS_TOUCH
          ? (e) => {
              // Let the LinkedIn links work once expanded.
              if (open && (e.target as HTMLElement).closest("a")) return;
              setOpen((o) => !o);
            }
          : undefined
      }
      /* Mobile (<md): absolute so it scrolls away with the hero and sits below
         the navbar instead of permanently covering the logo. md+: unchanged. */
      className="absolute md:fixed left-0 top-32 md:top-8 z-40 md:z-[60] flex items-center
      bg-[#E0E5EC]/95 backdrop-blur-md
      border border-l-0 border-primary/15
      rounded-r-full rounded-l-none
      shadow-[5px_5px_12px_rgba(163,177,198,0.65),-5px_-5px_12px_rgba(255,255,255,0.85),inset_1px_1px_2px_rgba(255,255,255,0.7)]
      hover:shadow-[7px_7px_16px_rgba(163,177,198,0.7),-6px_-6px_14px_rgba(255,255,255,0.9)]
      transition-all duration-500 ease-out
      overflow-hidden group h-[92px] w-[88px] hover:w-[194px] data-[open=true]:w-[194px] p-2
      max-md:h-[76px] max-md:w-[74px] max-md:data-[open=true]:w-[170px] max-md:p-1.5"
    >
      {/* Image */}
      <div className="relative h-[76px] max-md:h-[64px] flex-shrink-0 w-0 opacity-0
        group-hover:w-[96px] group-hover:opacity-100
        group-hover:mr-2 group-hover:ml-1
        group-data-[open=true]:w-[96px] group-data-[open=true]:opacity-100
        group-data-[open=true]:mr-2 group-data-[open=true]:ml-1
        max-md:group-data-[open=true]:w-[84px]
        transition-all duration-500 ease-out
        overflow-hidden rounded-s
        shadow-[inset_3px_3px_6px_rgba(163,177,198,0.7),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]
        border border-white/40"
      >
        <img
          src="/developers.png"
          alt="Siddhi & Nakul"
          className="absolute inset-0 w-full h-full min-w-[76px] object-cover"
        />

        {/* Name Overlays */}
        <div className="absolute bottom-0 inset-x-0 h-[40%] flex items-end pb-1.5
          opacity-0 group-hover:opacity-100 group-data-[open=true]:opacity-100
          transition-opacity duration-700 delay-100
          bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        >
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
      <div className="flex-shrink-0 flex flex-col items-center justify-center
        w-[70px] max-md:w-[60px] text-center font-black uppercase tracking-wider
        text-[9.5px] max-md:text-[8.5px] md:text-[10.5px] leading-[1.2]
        transition-transform duration-500 group-hover:scale-[1.02]
        drop-shadow-[0px_1px_0px_rgba(255,255,255,0.8)]"
      >
        <span className="text-primary block">Designed</span>
        <span className="text-foreground block text-[10.5px] my-[2px]">&</span>
        <span className="text-primary block">Developed</span>
        <span className="text-foreground block text-[8.5px] mt-[3px] tracking-widest">by</span>
      </div>
    </motion.div>
  );
};
