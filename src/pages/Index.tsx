import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Target, Heart, Lightbulb } from "lucide-react";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Founder from "./Founder";
import Testimonials from "./Testimonials";

const stats = [
  { icon: Users, value: "500+", label: "Students Trained" },
  { icon: BookOpen, value: "5+", label: "Expert Courses" },
  { icon: Trophy, value: "95%", label: "Success Rate" },
];

const courses = [
  { title: "IELTS Preparation", description: "Comprehensive training for all four modules", icon: "📚" },
  { title: "Spoken English", description: "Build confidence in everyday communication", icon: "🎯" },
  { title: "Writing Skills", description: "Master academic and professional writing", icon: "✍️" },
];

const values = [
  { icon: Target, title: "Consistency", description: "Regular practice is the key to mastery. We believe in small, consistent steps towards fluency." },
  { icon: Heart, title: "Passion", description: "We're passionate about language learning and dedicated to helping every student succeed." },
  { icon: Lightbulb, title: "Innovation", description: "Modern teaching methods combined with time-tested techniques for optimal learning." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Purple background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Floating Blobs */}
        <FloatingBlob className="top-20 -left-32 animate-float" size="xl" color="primary" />
        <FloatingBlob className="top-40 right-0 animate-float-slow" size="lg" color="accent" delay={0.5} />
        <FloatingBlob className="bottom-20 left/3 animate-float" size="md" color="mixed" delay={1} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Logo placeholder in hero */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl shadow-neu-lg overflow-hidden bg-card flex items-center justify-center">
                  <img src="/logo.png" alt="The Consistent Academy" className="w-full h-full object-cover" />
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-foreground">The </span>
                <span className="text-gradient">Consistent</span>
                <br />
                <span className="text-foreground">Academy</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Master English with consistent practice, expert guidance, and a proven methodology for lasting fluency.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/contact">
                  <NeumorphicButton variant="primary" size="lg">
                    Enroll Now
                    <ArrowRight size={20} />
                  </NeumorphicButton>
                </Link>
                <Link to="/courses">
                  <NeumorphicButton variant="secondary" size="lg">
                    Explore Courses
                  </NeumorphicButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {stats.map((stat, index) => (
                <NeumorphicCard key={index} className="text-center bg-gradient-to-br from-card to-primary/5" delay={0.1 * index}>
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </NeumorphicCard>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Founder Section */}
      <Founder />

      {/* About Section */}
      <section id="about" className="relative overflow-hidden">
        {/* Purple accent background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-accent/5 to-background" />
        
        <SectionWrapper className="relative z-10">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
                About Us
              </AnimatedText>
              <AnimatedHeading delay={0.1}>
                <span className="text-foreground">Building </span>
                <span className="text-gradient">Confident Speakers</span>
              </AnimatedHeading>
              <AnimatedText className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto" delay={0.2}>
                The Consistent Academy is dedicated to transforming language learning through 
                structured, consistent practice and expert guidance.
              </AnimatedText>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <NeumorphicCard className="p-8 md:p-10 bg-gradient-to-br from-primary/10 to-card">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-primary text-sm font-medium uppercase tracking-wider mb-3">Our Mission</h3>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Empowering Through Language
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our mission is to make quality English education accessible to learners from all backgrounds. 
                    We believe that language proficiency opens doors to opportunities.
                  </p>
                </motion.div>
              </NeumorphicCard>

              <NeumorphicCard className="p-8 md:p-10 bg-gradient-to-br from-accent/10 to-card">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-accent text-sm font-medium uppercase tracking-wider mb-3">Our Vision</h3>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Global Communication Excellence
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision a world where language barriers no longer limit potential. By fostering confident 
                    English speakers, we aim to create global citizens.
                  </p>
                </motion.div>
              </NeumorphicCard>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <NeumorphicCard key={index} delay={0.1 * index} className="text-center p-8 bg-gradient-to-b from-primary/5 to-card">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6 shadow-neu">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </NeumorphicCard>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Courses Preview */}
      <SectionWrapper className="bg-gradient-to-b from-primary/5 via-secondary/50 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              Our Programs
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">Courses Designed for </span>
              <span className="text-gradient">Success</span>
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <NeumorphicCard key={index} delay={0.1 * index} className="group bg-gradient-to-br from-card via-card to-primary/5">
                <div className="text-4xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <Link to="/courses" className="text-primary font-medium inline-flex items-center gap-2 group/link">
                  Learn more
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </NeumorphicCard>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/courses">
              <NeumorphicButton variant="secondary" size="lg">
                View All Courses
                <ArrowRight size={18} />
              </NeumorphicButton>
            </Link>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <SectionWrapper>
        <div className="container mx-auto">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 md:p-20 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <FloatingBlob className="-top-20 -left-20 opacity-30" size="lg" color="primary" />
            <FloatingBlob className="-bottom-20 -right-20 opacity-30" size="lg" color="accent" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of successful students who have transformed their English skills with us.
              </p>
              <Link to="/contact">
                <NeumorphicButton 
                  variant="secondary" 
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Get Started Today
                  <ArrowRight size={20} />
                </NeumorphicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Index;
