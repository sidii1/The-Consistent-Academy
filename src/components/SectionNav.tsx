import { useEffect, useState } from "react";
import LineSidebar from "@/components/ui/LineSidebar";

export interface NavSection {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: NavSection[];
  accentColor: string;
  textColor: string;
  markerColor: string;
  /** Pixels reserved at the top (e.g. fixed navbar) when scrolling to a section. */
  offset?: number;
  /** Fade in once the page has scrolled past this fraction of the viewport height. */
  showAfter?: number;
}

/** Fixed, LineSidebar-based section index. Wide screens only (2xl+). */
export const SectionNav = ({
  sections,
  accentColor,
  textColor,
  markerColor,
  offset = 0,
  showAfter = 0.5,
}: SectionNavProps) => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * showAfter);
      let current = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, showAfter]);

  const go = (index: number) => {
    const el = document.getElementById(sections[index].id);
    if (index === 0 || !el) return window.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`hidden 2xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <LineSidebar
        items={sections.map((s) => s.label)}
        accentColor={accentColor}
        textColor={textColor}
        markerColor={markerColor}
        proximityRadius={40}
        maxShift={12}
        falloff="linear"
        markerLength={18}
        tickScale={0.5}
        itemGap={22}
        fontSize={0.9}
        smoothing={100}
        activeIndex={active}
        onItemClick={go}
      />
    </div>
  );
};

export default SectionNav;
