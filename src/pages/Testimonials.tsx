import { useState, useRef, useEffect } from "react";
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
  const [current, setCurrent] = useState(0);
  const autoSlideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------- Auto Slide ---------- */
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [current]);

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideRef.current = setTimeout(() => {
      next();
    }, 5000); 
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearTimeout(autoSlideRef.current);
    }
  };

  const next = () => {
    stopAutoSlide();
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    stopAutoSlide();
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  /* ---------------- JSX ---------------- */

  return (
    <section id="testimonials" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-primary/10" />

      <SectionWrapper className="relative z-10">
        <div className="container mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm uppercase mb-3">
              Testimonials
            </AnimatedText>
            <AnimatedHeading>
              Stories of <span className="text-gradient">Success</span>
            </AnimatedHeading>
          </div>

          {/* SLIDER */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 shadow-neu flex flex-col">

                    <div>
                      <Quote className="w-10 h-10 text-primary/30 mb-4" />
                      <p className="text-lg leading-relaxed mb-1">
                        "{testimonials[current].text}"
                      </p>

                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-lg">{testimonials[current].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[current].role}
                      </p>
                      <p className="text-sm text-primary">
                        {testimonials[current].course}
                      </p>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CONTROLS */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <NeumorphicButton variant="secondary" onClick={prev}>
                <ChevronLeft />
              </NeumorphicButton>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      stopAutoSlide();
                      setCurrent(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === current
                        ? "w-8 bg-primary"
                        : "w-2 bg-primary/30"
                    }`}
                  />
                ))}
              </div>

              <NeumorphicButton variant="secondary" onClick={next}>
                <ChevronRight />
              </NeumorphicButton>
            </div>
          </div>

        </div>
      </SectionWrapper>
    </section>
  );
};

export default Testimonials;