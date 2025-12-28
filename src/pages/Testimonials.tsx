import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedText, AnimatedHeading } from "@/components/ui/animated-text";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "IELTS Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "The Consistent Academy transformed my English skills. I achieved a band score of 8.0 in IELTS! The teaching methodology is exceptional and the personal attention made all the difference."
  },
  {
    name: "Rahul Mehta",
    role: "Corporate Professional",
    course: "Business English",
    rating: 5,
    text: "Professional, structured, and results-oriented. The business English course helped me excel in my career. Highly recommended for anyone looking to improve their professional communication."
  },
  {
    name: "Sneha Patel",
    role: "University Student",
    course: "Spoken English",
    rating: 5,
    text: "I was always afraid to speak English in public. Now I'm confident and fluent! The supportive environment and expert guidance made learning enjoyable and effective."
  },
  {
    name: "Amit Kumar",
    role: "IT Professional",
    course: "IELTS Preparation",
    rating: 5,
    text: "Got my dream score of 7.5! The personalized feedback and consistent practice sessions were exactly what I needed. Thank you for making my Canada dream possible!"
  }
];

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-primary/10" />
      
      <SectionWrapper className="relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              Testimonials
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">Stories of </span>
              <span className="text-gradient">Success</span>
            </AnimatedHeading>
          </div>

          {/* Featured Testimonial Carousel */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <NeumorphicCard className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-card to-accent/5" hover={false}>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-4xl shadow-neu">
                          🎓
                        </div>
                      </div>
                      <div className="flex-1">
                        <Quote className="w-10 h-10 text-primary/30 mb-4" />
                        <p className="text-lg text-foreground leading-relaxed mb-6">
                          "{testimonials[currentTestimonial].text}"
                        </p>
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                            <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</p>
                          <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                          <p className="text-sm text-primary mt-1">{testimonials[currentTestimonial].course}</p>
                        </div>
                      </div>
                    </div>
                  </NeumorphicCard>
                </motion.div>
              </AnimatePresence>

              {/* Arrow Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <NeumorphicButton variant="secondary" onClick={prevTestimonial} className="p-3">
                  <ChevronLeft size={20} />
                </NeumorphicButton>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial 
                          ? "w-8 bg-primary" 
                          : "bg-primary/30 hover:bg-primary/50"
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Happy Students" },
              { value: "4.9", label: "Average Rating" },
              { value: "95%", label: "Success Rate" },
              { value: "50+", label: "5-Star Reviews" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-card shadow-neu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default Testimonials;
