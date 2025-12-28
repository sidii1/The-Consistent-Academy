import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { title } from "process";

const courses = [
  {
    title: "IELTS Preparation",
    description: "Comprehensive training for all four IELTS modules: Listening, Reading, Writing, and Speaking.",
    icon: "📚",
    duration: "4 Weeks",
    students: "200+",
    rating: "4.9",
    features: ["Mock tests", "Speaking practice", "Writing feedback", "Score prediction","Study materials provided"],
    popular: true,
  },
  {
    title: "Spoken English",
    description: "Build confidence in everyday communication with practical conversation skills.",
    icon: "🎯",
    duration: "4 Weeks",
    students: "150+",
    rating: "4.8",
    features: ["Daily conversations", "Pronunciation", "Fluency building", "Role plays"],
    popular: false,
  },
  {
    title: "Writing Skills",
    description: "Master academic and professional writing with structured practice sessions.",
    icon: "✍️",
    duration: "2 Weeks",
    students: "120+",
    rating: "4.9",
    features: ["Essay writing", "Email etiquette", "Report writing", "Grammar focus"],
    popular: false,
  },
  {
    title: "Grammar Mastery",
    description: "Build a strong foundation with comprehensive grammar training from basics to advanced.",
    icon: "📖",
    duration: "6 Weeks",
    students: "180+",
    rating: "4.7",
    features: ["Tenses", "Sentence structure", "Common errors", "Practice exercises"],
    popular: false,
  },
  {
    title: "Business English",
    description: "Professional communication skills for corporate environments and business contexts.",
    icon: "💼",
    duration: "4 Weeks",
    students: "90+",
    rating: "4.8",
    features: ["Presentations", "Meetings", "Negotiations", "Corporate vocabulary"],
    popular: false,
  },
  {
    title: "Interview Preparation",
    description: "Ace your interviews with confident communication and structured responses.",
    icon: "🎤",
    duration: "4 Weeks",
    students: "100+",
    rating: "4.9",
    features: ["Mock interviews", "Body language", "Common questions", "Confidence building"],
    popular: true,
  },

  {
    title:"IELTS Writing",
    description: "Focused training on IELTS Writing tasks to boost your scores effectively.",
    icon: "📝",
    duration: "2 Weeks",
    students: "80+",
    rating: "4.9",
    features:["Academic & General Training","Analyze(Task 1/Academic module)","Letters (Task 1/General module)","Descriptive Essays","Essential Grammar & Vocabulary "],
    popular: false,
  }
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Programs for </span>
              <span className="text-gradient">Every Goal</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose from our carefully designed courses, each tailored to help you achieve 
              specific English language milestones.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <SectionWrapper className="pt-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <NeumorphicCard 
                key={index} 
                delay={0.05 * index} 
                className="relative overflow-hidden group"
              >
                {course.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-medium">
                    Popular
                  </div>
                )}
                
                <div className="text-5xl mb-4">{course.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">{course.description}</p>
                
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={14} />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users size={14} />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    {course.rating}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {course.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={14} className="text-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Link to="/contact">
                  <NeumorphicButton variant="secondary" className="w-full">
                    Enroll Now
                    <ArrowRight size={16} />
                  </NeumorphicButton>
                </Link>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedHeading>
              <span className="text-foreground">Not Sure Which </span>
              <span className="text-gradient">Course to Choose?</span>
            </AnimatedHeading>
            <AnimatedText className="text-muted-foreground text-lg mt-6 mb-8" delay={0.1}>
              Book a free consultation with our course advisors who can help you identify 
              the best program based on your goals and current English proficiency.
            </AnimatedText>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/contact">
                <NeumorphicButton variant="primary" size="lg">
                  Book Free Consultation
                  <ArrowRight size={18} />
                </NeumorphicButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Courses;
