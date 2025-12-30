import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";

import FlowingMenu from "@/components/ui/flowing-menu";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Founder from "./Founder";
import Testimonials from "./Testimonials";

/* ---------------- DATA ---------------- */

const stats = [
  { icon: Users, value: "1500+", label: "Students Trained" },
  { icon: BookOpen, value: "6+", label: "Expert Courses" },
  { icon: Trophy, value: "95%", label: "Success Rate" },
];

const images = [
  "/v1.png",
  "/v2.png",
  "/v3.png",
  "/v4.png",
  "/v5.png",
  "/v6.png",
  "/v7.jpeg",
  "/v8.jpeg",
  "/v9.jpeg",
  "/v10.jpeg",
  "/v11.jpeg",
  "/v12.jpeg",
];

const courseImages = [
  "/courses/img1.png",
  "/courses/img2.png",
  "/courses/img3.png",
  "/courses/img4.png",
  "/courses/img5.png",
  "/courses/img6.png",
];

const courses = [
  { title: "IELTS Preparation", icon: "📚" },
  { title: "Spoken English", icon: "🎯" },
  { title: "Writing Skills", icon: "✍️" },
  { title: "Grammar Mastery", icon: "📖" },
  { title: "Business English", icon: "💼" },
  { title: "Interview Preparation", icon: "🎤" },
  { title: "IELTS Writing", icon: "📝" },
];

const courseMenuItems = courses.map((course, i) => ({
  link: "/courses",
  text: `${course.icon}  ${course.title}  ${course.icon}`,
  image: courseImages[i % courseImages.length],
}));

/* ---------------- CENTER PHOTO GALLERY ---------------- */

const CurvedPhotoGallery = () => {
  const [active, setActive] = useState(0);
  const total = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3200);

    return () => clearInterval(interval);
  }, [total]);

  return (
    <div className="relative w-full overflow-hidden py-24">
      <div className="relative flex justify-center items-center h-[520px]">
        {images.map((src, index) => {
          let offset = index - active;

          // loop correction
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          // CURVE math
          const x = offset * 280;
          const y = Math.abs(offset) * 22; // vertical curve
          const scale = offset === 0 ? 1.2 : 0.9;
          const opacity = offset === 0 ? 1 : 0.45;
          const zIndex = offset === 0 ? 20 : 10 - Math.abs(offset);

          return (
            <motion.div
              key={index}
              className="absolute cursor-pointer"
              onClick={() => setActive(index)}
              animate={{
                x,
                y,
                scale,
                opacity,
                zIndex,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              <div className="w-[320px] h-[460px] rounded-3xl overflow-hidden shadow-neu-xl bg-card">
                <img
                  src={src}
                  alt="Academy moment"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};


/* ---------------- PAGE ---------------- */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <FloatingBlob className="top-20 -left-32" size="xl" color="primary" />
        <FloatingBlob className="top-40 right-0" size="lg" color="accent" />

        <div className="container mx-auto text-center">
          <motion.h1 className="text-6xl md:text-8xl font-bold mb-6">
            The <span className="text-gradient">Consistent</span>
            <br />
            Academy
          </motion.h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Master English with consistent practice and expert guidance.
          </p>

          <Link to="/contact">
            <NeumorphicButton size="lg">
              Enroll Now <ArrowRight />
            </NeumorphicButton>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {stats.map((s, i) => (
              <NeumorphicCard key={i} className="text-center">
                <s.icon className="mx-auto text-primary mb-2" />
                <div className="text-3xl font-bold text-gradient">{s.value}</div>
                <div className="text-muted-foreground">{s.label}</div>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <Founder />

      {/* COURSES */}
      <SectionWrapper id="courses">
        <div className="text-center mb-10">
          <AnimatedText className="text-primary text-sm uppercase">
            Courses
          </AnimatedText>
          <AnimatedHeading>
            Learn with <span className="text-gradient">Clarity & Confidence</span>
          </AnimatedHeading>
        </div>

        <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl shadow-neu-xl">
          <FlowingMenu
            items={courseMenuItems}
            speed={18}
            textColor="#250060e7"
            bgColor="hsl(var(--card))"
            marqueeBgColor="#250060e7"
            marqueeTextColor="#ffffff"
            borderColor="rgba(0,0,0,0.1)"
          />
        </div>
      </SectionWrapper>

      {/* PHOTOS */}
    <SectionWrapper>
  <div className="text-center mb-10">
    <AnimatedHeading>
      Learning in <span className="text-gradient">Action</span>
    </AnimatedHeading>
  </div>

  <CurvedPhotoGallery />
</SectionWrapper>


      {/* TESTIMONIALS */}
      <Testimonials />

      <Footer />
    </div>
  );
};

export default Index;
