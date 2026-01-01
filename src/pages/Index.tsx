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
import CircularGallery from '@/components/ui/circular-gallery';
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
  "/v8.jpeg",
  "/v6.png",
  "/v1.png",
  "/v7.jpeg",
  "/v2.png",
  "/v3.png",
  "/v4.png",
  "/v5.png",
  "/v9.jpeg",
  "/v13.jpeg",
  "/v10.jpeg",
  "/v11.jpeg",
  "/v12.jpeg"
];

const courseImages = [
  "/courses/img1.png",
  "/courses/img2.png",
  "/courses/img3.png",
  "/courses/img4.png",
  "/courses/img5.png",
  "/courses/img6.png",
  "/courses/img7.png",
];

const courses = [
  { title: "IELTS Preparation", description: "Comprehensive training for all four modules", icon: "📚" },
  { title: "Spoken English", description: "Build confidence in everyday communication", icon: "🎯" },
  { title: "Writing Skills", description: "Master academic and professional writing", icon: "✍️" },
  { title: "Grammar Mastery", description: "Strong foundation from basics to advanced", icon: "📖" },
  { title: "Business English", description: "Professional communication for corporate settings", icon: "💼" },
  { title: "Interview Preparation", description: "Ace interviews with confidence", icon: "🎤" },
  { title: "IELTS Writing", description: "Focused training to boost writing band scores", icon: "📝" },
];

const courseMenuItems = courses.map((course, i) => ({
  link: "/courses",
  text: `${course.icon}  ${course.title}  ${course.icon}`,
  image: courseImages[i % courseImages.length],
}));

const galleryItems = images.map((src, i) => ({
  image: src,
  text: ``,
}));



/* ---------------- PAGE ---------------- */

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <FloatingBlob className="top-20 -left-32" size="xl" color="primary" />
        <FloatingBlob className="top-40 right-0" size="lg" color="accent" />

        <div className="container mx-auto text-center">
          <motion.h1 className="text-6xl md:text-8xl font-bold mb-6">
            The <span className="text-gradient">Consistent</span><br />Academy
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

      <Founder />

      {/* COURSES */}
      <SectionWrapper id="courses">
        <div className="text-center mb-10">
          <AnimatedText className="text-primary text-sm uppercase">Courses</AnimatedText>
          <AnimatedHeading>
            Learn with <span className="text-gradient">Clarity & Confidence</span>
          </AnimatedHeading>
        </div>

        <div className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden rounded-3xl shadow-neu-xl">
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
        <div className="text-center mb-6">
          <AnimatedHeading>
            Learning in <span className="text-gradient">Action</span>
          </AnimatedHeading>
        </div>

        <div className="relative h-[620px] w-full overflow-hidden">
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
