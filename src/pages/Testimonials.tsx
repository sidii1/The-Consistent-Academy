import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedText, AnimatedHeading } from "@/components/ui/animated-text";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const testimonials = [
  {
    name: "Ninoshka",
    role: "Veterinary Professional",
    course: "IELTS Preparation",
    rating: 5,
    text: "With consistent guidance and focused practice, I cleared my IELTS in my first attempt with an overall band score of 7.5. Today, I am in Canada, pursuing my goals with confidence and pride."
  },
  {
    name: "Sucharita",
    role: "Aspiring International Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "I cleared my IELTS in my first attempt with an overall band score of 7. Choosing the right guidance helped me move one step closer to building my life abroad."
  },
  {
    name: "Deepak S.",
    role: "Grade 12 Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "I cleared my IELTS with a band score of 6.5, which was exactly what my university required. This achievement helped me continue my education in Australia and make my family proud."
  },
  {
    name: "Atharv",
    role: "Mechanical Engineering Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "Scoring a 6.5 band in IELTS helped me achieve my dream of studying in Germany. The preparation was structured, practical, and constantly motivating."
  },
  {
    name: "Shreya",
    role: "Literature Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "I cleared my IELTS with a 6.5 band and secured admission to my dream university in Germany and the UK. The guidance throughout the process made everything clearer and easier."
  },
  {
    name: "Amol D.",
    role: "Working Professional",
    course: "IELTS Preparation",
    rating: 5,
    text: "With consistent practice and focused mentoring, I achieved the score required for higher studies in Germany. This journey taught me discipline and confidence."
  },
  {
    name: "Neha O.",
    role: "Working Professional",
    course: "IELTS Preparation",
    rating: 5,
    text: "I achieved a strong band score of 7 through consistency and the right mentorship. Managing work and preparation was challenging, but the support made it possible."
  },
  {
    name: "Monika",
    role: "Canada PR Applicant",
    course: "IELTS Preparation",
    rating: 5,
    text: "Clearing my IELTS with a 6.5 band helped me successfully apply for Canada PR. This success has helped me give my daughter a better life in Canada."
  },
  {
    name: "IT Aspirant",
    role: "IT Enthusiast",
    course: "IELTS Preparation",
    rating: 5,
    text: "With proper guidance, I cleared my IELTS and moved to Germany for higher studies. Things are going well for me here, and I’m grateful for the support I received."
  },
  {
    name: "Sudhanshu",
    role: "Aspiring International Student",
    course: "IELTS Preparation",
    rating: 5,
    text: "I managed to score 6.5 in IELTS through consistency and regular practice. This achievement helped me move closer to my goal of studying in Germany."
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
            <div className="relative h-[480px] md:h-[400px] flex flex-col">
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <div className="rounded-3xl bg-card p-8 md:p-8 shadow-neu bg-gradient-to-br from-primary/10 via-card to-accent/5 h-full">
                      <div className="flex flex-col md:flex-row gap-8 items-start h-full">
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
                            <p className="font-bold text-foreground">{testimonials[currentTestimonial].name}</p>
                            <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                            <p className="text-sm text-primary mt-1">{testimonials[currentTestimonial].course}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrow Navigation */}
              <div className="flex justify-center gap-4 mt-8 flex-shrink-0">
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
              { value: "1500+", label: "Happy Students" },
              { value: "4.9", label: "Average Rating" },
              { value: "95%", label: "Success Rate" },
              { value: "50+", label: "5-Star Reviews" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-card shadow-neu"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
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
