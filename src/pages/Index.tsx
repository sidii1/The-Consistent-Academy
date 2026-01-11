import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Sparkles,
  Star,
  Instagram,
  MessageCircle,
  Linkedin,
} from "lucide-react";

import FlowingMenu from "@/components/ui/flowing-menu";
import CircularGallery from '@/components/ui/circular-gallery';
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Founder from "../components/Founder";
import Testimonials from "../components/Testimonials";

/* ---------------- DATA ---------------- */

const stats = [
  { icon: Users, value: "1500+", label: "Students Trained", color: "#FF6B8B" },
  { icon: BookOpen, value: "10+", label: "Expert Courses", color: "#4ECDC4" },
  { icon: Trophy, value: "95%", label: "Success Rate", color: "#FFD166" },
  { icon: Star, value: "4.9", label: "Student Rating", color: "#7B68EE" },
];

const socialLinks = [
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/the_consistent_academy/", 
    color: "#E4405F",
    label: "Instagram"
  },
  { 
    icon: MessageCircle, 
    href: "https://chat.whatsapp.com/Kw2YbntkWMqG66MVI9xSJq?mode=ac_t", 
    color: "#25D366",
    label: "WhatsApp"
  },
  { 
    icon: Linkedin, 
    href: "https://www.linkedin.com/company/the-consistent-academy/", 
    color: "#0A66C2",
    label: "LinkedIn"
  },
];

const images = [
  "/gallery/v8.jpeg",
  "/gallery/v6.png",
  "/gallery/v1.png",
  "/gallery/v7.jpeg",
  "/gallery/v2.png",
  "/gallery/v3.png",
  "/gallery/v4.png",
  "/gallery/v5.png",
  "/gallery/v9.jpeg",
  "/gallery/v13.jpeg",
  "/gallery/v10.jpeg",
  "/gallery/v11.jpeg",
  "/gallery/v12.jpeg"
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
  { title: "IELTS | TOEFL | PTE | CELPIP ", icon: "📚" },
  { title: "Corporate Survival & Success", icon: "🤵🏻" },
  { title: "Crack Your Interview", icon: "🕴🏻" },
  { title: "Dining & Social Etiquette", icon: "🍽️" },
  { title: "Communication Skill Training", icon: "🎤" },
  { title: "Personality Development Training",icon: "🗣️" },
  { title: "Courses for Kids", icon: "👧🏻" }
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

/* ---------------- ENHANCED STATS CARD ---------------- */

const EnhancedStatsCard = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="relative"
    >
      <NeumorphicCard 
        className="text-center p-3 md:p-4 relative overflow-hidden group cursor-pointer"
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${stat.color}10 0%, transparent 70%)`,
          }}
        />
        
        {/* Icon with animation */}
        <motion.div
          className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl mb-2 md:mb-3 mx-auto relative"
          style={{ 
            backgroundColor: stat.color + '10',
            boxShadow: `inset 3px 3px 6px ${stat.color}15, inset -3px -3px 6px ${stat.color}08`
          }}
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: index * 0.5 }}
        >
          <stat.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: stat.color }} />
          <Sparkles className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3" style={{ color: stat.color }} />
        </motion.div>
        
        {/* Value with counter animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="text-xl md:text-2xl font-bold mb-1"
          style={{ color: stat.color }}
        >
          {stat.value}
        </motion.div>
        
        <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
        
        {/* Progress indicator */}
        <div className="mt-2 md:mt-3 h-0.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: stat.color }}
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
          />
        </div>
      </NeumorphicCard>
    </motion.div>
  );
};

/* ---------------- SOCIAL ICON COMPONENT ---------------- */

const SocialIcon = ({ social, index }) => {
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -2, scale: 1.1 }}
      className="relative group"
      aria-label={social.label}
    >
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ 
          backgroundColor: social.color + '15',
          boxShadow: `inset 2px 2px 4px ${social.color}20, inset -2px -2px 4px ${social.color}10`
        }}
      >
        <social.icon 
          className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300" 
          style={{ color: social.color }} 
        />
      </div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-medium px-2 py-1 rounded bg-background shadow-neu-sm">
        {social.label}
      </div>
    </motion.a>
  );
};

/* ---------------- PAGE ---------------- */

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ENHANCED HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 md:pt-24 overflow-hidden">
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                             linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Heading with subtle emphasis on "Consistent" */}
              <div className="mb-8">
                <motion.div 
                  className="font-bold leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-2">
                    The
                  </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                    Consistent
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                    Academy
                  </div>
                </motion.div>
              </div>

              {/* Subheading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Master English with consistent practice and expert guidance.
                  <br className="hidden sm:block" />
                  Transform your language skills in just 12 weeks.
                </p>
              </motion.div>

            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Link to="/contact" className="block max-w-xs mx-auto sm:mx-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <div className="relative border hover:border-purple-400 duration-500 group cursor-pointer text-purple-50 overflow-hidden h-16 w-64 rounded-md bg-gradient-to-r from-purple-600 to-violet-700 p-2 flex justify-center items-center font-bold shadow-lg hover:shadow-xl transition-all">
                    <div className="absolute z-10 w-56 h-56 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-purple-900/90 delay-150 group-hover:delay-75" />
                    <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-purple-800/90 delay-150 group-hover:delay-100" />
                    <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-purple-700/90 delay-150 group-hover:delay-150" />
                    <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-purple-600/90 delay-150 group-hover:delay-200" />
                    <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-purple-500/90 delay-150 group-hover:delay-300" />
                    <span className="z-10 flex items-center justify-center gap-2 font-semibold text-lg">
                      Enroll Now
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
            </motion.div>

            {/* Right Column - Stats & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                {stats.map((stat, i) => (
                  <EnhancedStatsCard key={i} stat={stat} index={i} />
                ))}
              </div>

              {/* Community Card */}
              <motion.div
                className="relative h-32 md:h-36 rounded-xl md:rounded-2xl overflow-hidden mb-6 shadow-neu-md"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary/15" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-primary" />
                  <div className="text-lg md:text-xl font-bold mb-1">Join Our Community</div>
                  <div className="text-xs md:text-sm text-muted-foreground mb-3">Connect with fellow learners</div>
                  
                  {/* Social Media Icons */}
                  <div className="flex gap-3 md:gap-4">
                    {socialLinks.map((social, index) => (
                      <SocialIcon key={index} social={social} index={index} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ rotate: -3 }}
                animate={{ rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -right-2 md:-right-3 -bottom-2 md:-bottom-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-2 md:p-3 rounded-lg md:rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                  <div>
                    <div className="text-xs font-bold">Top Rated</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-6">
            and more.....
          </p>
          
          <Link to="/courses">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <NeumorphicButton className="px-8 py-4 text-base font-semibold bg-primary text-white">
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </NeumorphicButton>
            </motion.div>
          </Link>
        </motion.div>
      </SectionWrapper>

      <Founder />

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