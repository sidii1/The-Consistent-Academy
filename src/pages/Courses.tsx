import { motion, AnimatePresence } from "framer-motion";
import { reveal } from "@/lib/device";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, ChevronDown, Clock, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ExpandableCourseCard, { Course } from "@/components/ui/expandable-course-card";
import { SEO } from "@/components/SEO";
import { routeSeo } from "@/seo/routes";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { KIDS_COURSE_PRICE, KIDS_COURSE_PRICE_OVERRIDES, formatINR } from "../../shared/pricing";

import { courses, kidsCourses } from "@/data/courses";
import { GENERAL_FAQS } from "@/data/faqs";
import { FAQ } from "@/components/FAQ";
import { courseListJsonLd } from "@/seo/site";


const Courses = () => {
  const [payCourse, setPayCourse] = useState<string | null>(null);
  const [audience, setAudience] = useState<"professional" | "kids">("professional");
  const [expandedKids, setExpandedKids] = useState<Record<number, boolean>>({});
  const schema = courseListJsonLd();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        {...routeSeo("/courses")}
        schema={schema}
      />
      <Navbar />
      <main>

      {/* Hero Section */}
      <section className="relative pt-28 max-sm:pt-24 max-sm:pb-2 overflow-hidden">

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
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
              className="text-xl max-sm:text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose from our carefully designed courses, each tailored to help you achieve specific English milestones.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Audience toggle */}
      <section className="pb-2 pt-7">
        <div className="container mx-auto px-4 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => setAudience("professional")}
            className={cn(
              "text-base sm:text-xl font-bold transition-colors duration-300",
              audience === "professional" ? "text-neo-accent" : "text-neo-muted hover:text-neo-fg",
            )}
          >
            Professional <br></br> Courses
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={audience === "kids"}
            aria-label="Switch between professional and kids courses"
            onClick={() => setAudience((a) => (a === "kids" ? "professional" : "kids"))}
            className="skeu-switch"
          >
            <span className="skeu-indicator left" />
            <span className="skeu-indicator right" />
            <span className="skeu-button" />
          </button>
          <button
            type="button"
            onClick={() => setAudience("kids")}
            className={cn(
              "text-base sm:text-xl font-bold transition-colors duration-300",
              audience === "kids" ? "text-neo-accent" : "text-neo-muted hover:text-neo-fg",
            )}
          >
            Kids <br></br> Courses
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {audience === "professional" ? (
          <motion.div
            key="professional"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SectionWrapper className="!py-6">
              <div className="container mx-auto">
                <ExpandableCourseCard courses={courses} />
              </div>
            </SectionWrapper>
          </motion.div>
        ) : (
          <motion.div
            key="kids"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <SectionWrapper className="!py-6">
              <div className="container mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      {kidsCourses.map((course, index) => {
        const expanded = expandedKids[index] ?? false;
        const coursePrice = KIDS_COURSE_PRICE_OVERRIDES[course.id] ?? KIDS_COURSE_PRICE;
        return (
          <NeumorphicCard
            key={index}
            delay={0.05 * index}
            className="p-6 flex flex-col"
          >
            {/* Image */}
            {course.image && (
              <div className="mb-4 rounded-lg overflow-hidden shrink-0">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            {/* Title + price */}
            <div className="flex items-start justify-between gap-3 mb-2 shrink-0">
              <h3 className="text-lg font-semibold text-foreground leading-snug">
                {course.title}
              </h3>
              <span className="text-primary font-semibold text-sm whitespace-nowrap mt-0.5">
                {formatINR(coursePrice)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 shrink-0">
              {course.description}
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3 shrink-0">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {course.duration}
              </span>
              <span className="inline-flex items-center gap-1.5 neo-inset rounded-full px-2.5 py-0.5 text-xs font-semibold text-neo-accent">
                <Wifi size={12} />
                Online
              </span>
            </div>

            {/* Expand toggle */}
            <button
              type="button"
              onClick={() => setExpandedKids((prev) => ({ ...prev, [index]: !expanded }))}
              className="inline-flex items-center gap-1 text-s font-semibold text-neo-accent mb-3 hover:opacity-75 transition-opacity"
            >
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                <ChevronDown size={23} />
              </motion.span>
              {expanded ? "Show less" : "View details"}
            </button>

            {/* Expandable features */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="features"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-4">
                    {course.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                        {course.rich && feature.includes(": ") ? (
                          <span>
                            <strong className="text-foreground">{feature.split(": ")[0]}:</strong>{" "}
                            {feature.slice(feature.indexOf(": ") + 2)}
                          </span>
                        ) : (
                          <span>{feature}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Link
              to={`/courses/${course.slug}`}
              className="self-start mb-3 text-xs font-semibold text-neo-accent hover:underline"
            >
              Full course page →
            </Link>

            {/* Enroll button always visible at the bottom */}
            <div className="mt-auto pt-1">
              <NeumorphicButton variant="secondary" className="w-full" onClick={() => setPayCourse(course.id)}>
                Enroll Now · {formatINR(coursePrice)}
                <ArrowRight size={16} />
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        );
      })}
    </div>
              </div>
            </SectionWrapper>
          </motion.div>
        )}
      </AnimatePresence>
</main>

      <FAQ items={GENERAL_FAQS} />

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
              {...reveal({
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.2 },
              })}
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

      <PaymentModal
        open={payCourse !== null}
        onOpenChange={(o) => !o && setPayCourse(null)}
        productId={payCourse ?? "kid-mun"}
        image={kidsCourses.find((c) => c.id === payCourse)?.image}
        duration={kidsCourses.find((c) => c.id === payCourse)?.duration}
        highlights={kidsCourses.find((c) => c.id === payCourse)?.features}
      />
    </div>
  );
};

export default Courses;
