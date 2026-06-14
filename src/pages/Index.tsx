import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Star,
  Instagram,
  MessageCircle,
  Linkedin,
  Sparkles,
} from "lucide-react";

import FlowingMenu from "@/components/ui/flowing-menu";
import CircularGallery from "@/components/ui/circular-gallery";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Founder from "../components/Founder";
import Testimonials from "../components/Testimonials";
import { FloatingCreators } from "../components/FloatingCreators";
import { PageLoader } from "@/components/PageLoader";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */


const socialLinks = [
  { icon: Instagram,     href: "https://www.instagram.com/the_consistent_academy/",          color: "#E4405F", label: "Instagram" },
  { icon: MessageCircle, href: "https://chat.whatsapp.com/Kw2YbntkWMqG66MVI9xSJq?mode=ac_t", color: "#25D366", label: "WhatsApp" },
  { icon: Linkedin,      href: "https://www.linkedin.com/company/the-consistent-academy/",   color: "#0A66C2", label: "LinkedIn" },
];

const images = [
  "/gallery/v8.jpeg", "/gallery/v6.png",  "/gallery/v1.png",  "/gallery/v7.jpeg",
  "/gallery/v2.png",  "/gallery/v3.png",  "/gallery/v4.png",  "/gallery/v5.png",
  "/gallery/v9.jpeg", "/gallery/v13.jpeg","/gallery/v10.jpeg","/gallery/v11.jpeg",
  "/gallery/v12.jpeg","/gallery/v13.jpeg","/gallery/v14.jpeg","/gallery/v15.jpeg",
  "/gallery/v16.jpeg","/gallery/v17.jpeg","/gallery/v18.jpeg","/gallery/v19.jpeg",
  "/gallery/v20.jpeg","/gallery/v21.jpeg","/gallery/v22.jpeg",
];

const courseImages = [
  "/courses/img1.png","/courses/img2.png","/courses/img3.png","/courses/img4.png",
  "/courses/img5.png","/courses/img6.png","/courses/img7.png",
];

const courses = [
  { title: "IELTS | TOEFL | PTE | CELPIP" },
  { title: "Corporate Survival & Success" },
  { title: "Crack Your Interview" },
  { title: "Dining & Social Etiquette" },
  { title: "Communication Skill Training" },
  { title: "Personality Development Training" },
  { title: "Courses for Kids" },
];

const courseMenuItems = courses.map((c, i) => ({
  link: "/courses",
  text: c.title,
  image: courseImages[i % courseImages.length],
}));

const galleryItems = images.map((src) => ({ image: src, text: "" }));

/* ─────────────────────────────────────────────────────────────
   SOCIAL ICON
───────────────────────────────────────────────────────────── */

const SocialIcon = ({ social, index, startAnim }: { social: typeof socialLinks[0]; index: number; startAnim: boolean }) => (
  <motion.a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={startAnim ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
    transition={{ delay: 0.1 + index * 0.08, type: "spring", stiffness: 300 }}
    whileHover={{ y: -2, scale: 1.1 }}
    className="relative group"
    aria-label={social.label}
  >
    {/* Icon well — inset */}
    <div className="neo-inset-sm rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:neo-flat">
      <social.icon className="w-5 h-5" style={{ color: social.color }} />
    </div>
    {/* Tooltip */}
    <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-medium px-2.5 py-1 neo-surface-sm rounded-full text-neo-muted pointer-events-none">
      {social.label}
    </div>
  </motion.a>
);

/* ─────────────────────────────────────────────────────────────
   ENROLL CTA BUTTON
───────────────────────────────────────────────────────────── */

const EnrollButton = ({ delay, startAnim }: { delay: number; startAnim: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
  >
    <Link to="/contact">
      <NeumorphicButton variant="primary" size="lg" className="gap-3 px-10">
        Enroll Now
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </NeumorphicButton>
    </Link>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────── */

const HeroSection = ({ startAnim }: { startAnim: boolean }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-start justify-center overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-8 lg:px-16 flex flex-col items-start justify-center min-h-[90vh] pt-24">

        {/* Main heading — left aligned, massive, Erica One */}
        <div style={{ fontFamily: '"Erica One", cursive' }} className="mb-10 leading-[1.0] tracking-tight">

          {/* "The" */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-neo-fg mb-1"
          >
            The
          </motion.div>

          {/* "Consistent" — brand purple, massive, with bouncing dot over "i" */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
            className="text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] leading-none py-2"
            style={{ color: "#9738F9" }}
          >
            {/* "Cons" */}
            Cons
            {/* "i" wrapped so we can put the bouncing dot above it */}
            <span className="relative inline-block">
              {/* The actual letter i — rendered normally */}
              <span className="inline-block" style={{ position: "relative" }}>i</span>
            </span>
            {/* "stent" */}
            stent
          </motion.div>

          {/* "Academy" */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-neo-fg mt-2"
          >
            Academy
          </motion.div>
        </div>

        {/* CTA */}
        <EnrollButton delay={0.6} startAnim={startAnim} />

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
          className="mt-10"
        >
          <div className="neo-surface rounded-neo-card px-6 py-4 inline-flex items-center gap-4">
            {socialLinks.map((s, i) => (
              <SocialIcon key={i} social={s} index={i} startAnim={startAnim} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};


/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neo-base overflow-x-hidden">
      {loading && <PageLoader onComplete={handleLoaderComplete} />}
      <Navbar />
      <FloatingCreators />

      <HeroSection startAnim={!loading} />

      {/* COURSES */}
      <SectionWrapper id="courses">
        <div className="text-center mb-10">
          <AnimatedText className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3">
            Courses
          </AnimatedText>
          <AnimatedHeading>
            Learn with{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6C63FF, #38B2AC)" }}
            >
              Clarity & Confidence
            </span>
          </AnimatedHeading>
        </div>

        <div className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden rounded-neo-card shadow-neo-flat">
          <FlowingMenu
            items={courseMenuItems}
            speed={18}
            textColor="#250060e7"
            bgColor="#E0E5EC"
            marqueeBgColor="#6C63FF"
            marqueeTextColor="#ffffff"
            borderColor="rgba(0,0,0,0.05)"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-lg text-neo-muted font-medium mb-6">and more…</p>
          <Link to="/courses">
            <NeumorphicButton size="lg" className="px-10">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </NeumorphicButton>
          </Link>
        </motion.div>
      </SectionWrapper>

      <Founder />

      {/* GALLERY */}
      <SectionWrapper>
        <div className="text-center mb-6">
          <AnimatedHeading>
            Learning in{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6C63FF, #38B2AC)" }}
            >
              Action
            </span>
          </AnimatedHeading>
        </div>

        <div className="relative h-[620px] w-full overflow-hidden rounded-neo-card">
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.06}
            scrollSpeed={2}
            scrollEase={0.08}
          />
        </div>
      </SectionWrapper>

      <Testimonials />

      <Footer />
    </div>
  );
};

export default Index;