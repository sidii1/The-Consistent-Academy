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

const courses = [
  { title: "IELTS Preparation", description: "Comprehensive training for all four modules", icon: "📚" },
  { title: "Spoken English", description: "Build confidence in everyday communication", icon: "🎯" },
  { title: "Writing Skills", description: "Master academic and professional writing", icon: "✍️" },
  { title: "Grammar Mastery", description: "Strong foundation from basics to advanced", icon: "📖" },
  { title: "Business English", description: "Professional communication for corporate settings", icon: "💼" },
  { title: "Interview Preparation", description: "Ace interviews with confidence", icon: "🎤" },
  { title: "IELTS Writing", description: "Focused training to boost writing band scores", icon: "📝" },
];

const values = [
  { icon: Target, title: "Consistency", description: "Small, consistent steps towards fluency." },
  { icon: Heart, title: "Passion", description: "Dedicated to helping every learner succeed." },
  { icon: Lightbulb, title: "Innovation", description: "Modern methods blended with proven techniques." },
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
const galleryItems = images.map((src, i) => ({
  image: src,
  text: ``, // or any label you want
}));



/* ---------------- COURSES SLIDESHOW ---------------- */

const CoursesSlideshow = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % courses.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative w-full overflow-visible py-24 min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex justify-center items-center h-full">
        {courses.map((course, index) => {
          // circular distance
          let offset = index - active;
          const half = Math.floor(courses.length / 2);

          if (offset > half) offset -= courses.length;
          if (offset < -half) offset += courses.length;

          // hide far slides
          if (Math.abs(offset) > 2) return null;

          return (
            <motion.div
              key={index}
              onClick={() => setActive(index)}
              animate={{
                x: offset * 380,
                scale: offset === 0 ? 1.15 : 0.9,
                opacity: offset === 0 ? 1 : 0.45,
                y: offset === 0 ? -12 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                zIndex: 10 - Math.abs(offset),
              }}
              className="absolute cursor-pointer"
            >
              <NeumorphicCard className="w-[360px] h-[460px] text-center p-10 flex flex-col justify-center shadow-neu-xl">
                <div className="text-6xl mb-6">{course.icon}</div>

                <h3 className="text-2xl font-semibold mb-4">
                  {course.title}
                </h3>

                <p className="text-muted-foreground text-base leading-relaxed">
                  {course.description}
                </p>
              </NeumorphicCard>
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
      <section className="relative min-h-screen flex items-center justify-center pt-20">
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

      {/* ABOUT */}
      <SectionWrapper>
        <div className="text-center mb-14">
          <AnimatedText className="text-primary text-sm uppercase">About Us</AnimatedText>
          <AnimatedHeading>
            Building <span className="text-gradient">Confident Speakers</span>
          </AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <NeumorphicCard key={i} className="text-center p-8">
              <v.icon className="mx-auto text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
              <p className="text-muted-foreground">{v.description}</p>
            </NeumorphicCard>
          ))}
        </div>
      </SectionWrapper>

      {/* COURSES SLIDESHOW */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <AnimatedText className="text-primary text-sm uppercase">Courses</AnimatedText>
          <AnimatedHeading>
            Learn with <span className="text-gradient">Clarity & Confidence</span>
          </AnimatedHeading>
        </div>

        <CoursesSlideshow />
      </SectionWrapper>

      {/* PHOTOS */}
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
