import SectionNav from "@/components/SectionNav";

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

export const HomeSectionNav = () => (
  <SectionNav sections={SECTIONS} accentColor="#9C37FC" textColor="#6B7280" markerColor="#A3B1C6" />
);

export default HomeSectionNav;
