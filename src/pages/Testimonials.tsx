import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "IELTS Score: 7.5",
    image: "🎓",
    text: "The Consistent Academy completely transformed my approach to IELTS preparation. Vidya ma'am's teaching methodology made even the toughest sections feel manageable. The daily practice sessions and personalized feedback were game-changers.",
    rating: 5,
    course: "IELTS Preparation",
  },
  {
    name: "Priya Mehta",
    role: "Software Engineer",
    image: "💼",
    text: "I was always hesitant to speak English in professional settings. After just 8 weeks at The Consistent Academy, I now confidently lead team meetings and give presentations. The transformation has been incredible.",
    rating: 5,
    course: "Spoken English",
  },
  {
    name: "Amit Kumar",
    role: "IELTS Score: 8.0",
    image: "⭐",
    text: "I had attempted IELTS twice before with disappointing results. The structured approach and mock tests at TCA helped me understand my weaknesses and work on them systematically. Finally achieved my dream score!",
    rating: 5,
    course: "IELTS Preparation",
  },
  {
    name: "Sneha Patel",
    role: "MBA Student",
    image: "📚",
    text: "The writing skills course was exactly what I needed for my business school applications. My essay writing improved dramatically, and I received admission offers from multiple universities.",
    rating: 5,
    course: "Writing Skills",
  },
  {
    name: "Vikram Desai",
    role: "Business Professional",
    image: "🌟",
    text: "The business English course helped me navigate international client meetings with ease. The practical scenarios and role-play sessions prepared me for real-world situations perfectly.",
    rating: 5,
    course: "Business English",
  },
  {
    name: "Anjali Gupta",
    role: "IELTS Score: 7.0",
    image: "✨",
    text: "What I love about TCA is the personal attention each student receives. Vidya ma'am remembers your weaknesses and tailors feedback accordingly. That level of care is rare and valuable.",
    rating: 5,
    course: "IELTS Preparation",
  },
];

const featuredTestimonial = testimonials[0];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Testimonials
            </motion.span>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Stories of </span>
              <span className="text-gradient">Success</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hear from our students who have transformed their English skills 
              and achieved their goals with us.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      <SectionWrapper className="pt-0">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <NeumorphicCard className="p-8 md:p-12" hover={false}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl shadow-neu">
                          {testimonials[currentIndex].image}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Quote className="w-10 h-10 text-primary/30 mb-4" />
                        <p className="text-lg text-foreground leading-relaxed mb-6">
                          "{testimonials[currentIndex].text}"
                        </p>
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                            <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                          <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                          <p className="text-sm text-primary mt-1">{testimonials[currentIndex].course}</p>
                        </div>
                      </div>
                    </div>
                  </NeumorphicCard>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <NeumorphicButton variant="secondary" onClick={prevTestimonial} className="p-3">
                  <ChevronLeft size={20} />
                </NeumorphicButton>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? "w-8 bg-primary" 
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
                <NeumorphicButton variant="secondary" onClick={nextTestimonial} className="p-3">
                  <ChevronRight size={20} />
                </NeumorphicButton>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* All Testimonials Grid */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              More Stories
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">What Our </span>
              <span className="text-gradient">Students Say</span>
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <NeumorphicCard key={index} delay={0.05 * index} className="h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl shadow-neu-sm flex-shrink-0">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-xs text-primary font-medium">{testimonial.course}</p>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Stats */}
      <SectionWrapper>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Happy Students" },
              { value: "4.9", label: "Average Rating" },
              { value: "95%", label: "Success Rate" },
              { value: "50+", label: "5-Star Reviews" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Testimonials;
