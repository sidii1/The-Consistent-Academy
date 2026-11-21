import { useEffect, useState } from "react";
import LineSidebar from "@/components/ui/LineSidebar";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "courses", label: "Courses" },
  { id: "founder", label: "Founder" },
  { id: "books", label: "Books" },
  { id: "visionaries", label: "Visionaries" },
  { id: "experts", label: "Experts" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
];

/** Fixed section index for the home page (wide screens only). */
export const HomeSectionNav = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
      let current = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (index: number) => {
    const id = SECTIONS[index].id;
    if (id === "home") return window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`hidden 2xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <LineSidebar
        items={SECTIONS.map((s) => s.label)}
        accentColor="#9C37FC"
        textColor="#6B7280"
        markerColor="#A3B1C6"
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

export default HomeSectionNav;
