"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Clock, BookOpen, X, ArrowRight, Users, Target, Star, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LITE_MOTION } from "@/lib/device";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { getProduct, formatINR } from "../../../shared/pricing";

interface CourseModule {
  title: string;
  duration?: string;
  topics: string[];
}

export interface Course {
  /** Must match an entry in shared/pricing.ts so the server charges the right amount. */
  productId?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  hours: string;
  price: string;
  modules: number;
  targetAudience: string | string[];
  promise?: string;
  moduleDetails: CourseModule[];
  highlights?: string[];
}

interface ExpandableCourseCardProps {
  courses: Course[];
  /** How many cards are visible before "View all" is pressed. */
  initialVisible?: number;
}

/** Price shown to the user always comes from shared/pricing.ts (what is actually charged). */
const priceOf = (course: Course) => {
  const product = course.productId ? getProduct(course.productId) : undefined;
  return product ? formatINR(product.price) : `₹ ${course.price}`;
};

/** Primary button with a slightly squarer, more compact shape than the pill default. */
const enrollClass = "rounded-2xl";

export default function ExpandableCourseCard({ courses, initialVisible = 6 }: ExpandableCourseCardProps) {
  const [active, setActive] = useState<Course | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payId, setPayId] = useState("");
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.paddingRight = "0px";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, handleClose);

  function handleClose() {
    if (!isAnimating) {
      setActive(null);
    }
  }

  function handleCardClick(course: Course) {
    if (isAnimating) return;
    setIsAnimating(true);
    setActive(course);
    setTimeout(() => setIsAnimating(false), 300);
  }

  /** Opens the payment dialog. The details modal closes first so the two never stack. */
  function handleEnroll(course: Course) {
    if (!course.productId) return;
    setActive(null);
    setPayId(course.productId);
    setPayOpen(true);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const hasMore = courses.length > initialVisible;
  const visibleCourses = showAll ? courses : courses.slice(0, initialVisible);

  return (
    <>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-[#1a1f2e]/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {active && (
          <div
            className="fixed inset-0 z-[70] flex items-start justify-center p-4 md:p-6 overflow-y-auto custom-scrollbar overscroll-contain"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-5xl my-auto py-6"
            >
              <motion.div
                ref={ref}
                layoutId={`card-${active.title}-${id}`}
                className="w-full bg-neo-base text-neo-fg rounded-neo-card overflow-hidden shadow-[0_20px_50px_rgba(26,31,46,0.35)]"
              >
                {/* Modal Header */}
                <div className="relative p-4 md:p-5 pb-0 md:pb-0">
                  <motion.div
                    layoutId={`image-${active.title}-${id}`}
                    className="neo-inset rounded-neo-inner p-1.5"
                  >
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-52 md:h-64 object-cover rounded-neo-inner"
                    />
                  </motion.div>

                  {/* Close Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClose}
                    className={cn(
                      "absolute top-7 right-7 md:top-8 md:right-8 z-10 flex h-9 w-9 items-center justify-center rounded-full",
                      "bg-neo-base text-neo-muted shadow-neo-flat-sm transition-all duration-300",
                      "hover:shadow-neo-flat hover:-translate-y-px hover:text-neo-fg",
                      "active:shadow-neo-inset-sm active:translate-y-0.5 focus-visible:outline-none focus-visible:shadow-neo-focus",
                    )}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Title block */}
                <div className="px-6 md:px-8 pt-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="neo-inset-sm rounded-full flex items-center gap-2 px-3 py-1.5 text-neo-accent">
                      <Clock size={14} />
                      <span className="text-sm font-semibold">{active.hours}</span>
                    </div>
                    <div className="neo-inset-sm rounded-full flex items-center gap-2 px-3 py-1.5 text-neo-accent">
                      <BookOpen size={14} />
                      <span className="text-sm font-semibold">{active.modules} Modules</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <motion.h2
                      layoutId={`title-${active.title}-${id}`}
                      className="text-2xl md:text-4xl font-bold text-neo-fg leading-tight"
                    >
                      {active.title}
                    </motion.h2>
                    <div className="neo-surface-sm rounded-full px-5 py-2 text-neo-accent text-base font-bold whitespace-nowrap">
                      {priceOf(active)}
                    </div>
                  </div>

                  {active.subtitle && (
                    <p className="text-lg text-neo-muted font-medium mt-2">{active.subtitle}</p>
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="neo-inset rounded-neo-card p-6"
                  >
                    <p className="text-neo-fg leading-relaxed">{active.description}</p>
                  </motion.div>

                  {/* Audience + promise */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={cn("grid grid-cols-1 gap-5", active.promise && "md:grid-cols-2")}
                  >
                    <div className="neo-surface-sm rounded-neo-card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-neo-accent" />
                        <h3 className="text-sm font-semibold text-neo-muted uppercase tracking-wider">
                          Target Audience
                        </h3>
                      </div>
                      {Array.isArray(active.targetAudience) ? (
                        <ul className="list-disc pl-5 space-y-1.5 mt-1">
                          {active.targetAudience.map((audience, idx) => (
                            <li key={idx} className="text-neo-fg leading-relaxed text-sm">
                              {audience}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-neo-fg leading-relaxed text-sm">{active.targetAudience}</p>
                      )}
                    </div>

                    {active.promise && (
                      <div className="neo-surface-sm rounded-neo-card p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-neo-accent" />
                          <h3 className="text-sm font-semibold text-neo-accent uppercase tracking-wider">
                            Course Promise
                          </h3>
                        </div>
                        <p className="text-neo-fg leading-relaxed text-sm">{active.promise}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Highlights */}
                  {active.highlights && active.highlights.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="neo-inset rounded-neo-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-neo-accent" />
                        <h3 className="text-xl font-semibold text-neo-fg">What's Included</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {active.highlights.map((highlight, i) => (
                          <div
                            key={i}
                            className="neo-surface-sm rounded-neo-btn flex items-center gap-3 px-4 py-3"
                          >
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#42106F" }} />
                            <span className="text-sm text-neo-fg">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Module Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="neo-inset rounded-neo-card p-5 md:p-6"
                  >
                    <h3 className="text-xl font-semibold text-neo-fg mb-5">Course Modules</h3>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      {active.moduleDetails.map((module, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="neo-surface-sm rounded-neo-card p-5"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="neo-inset-sm rounded-full flex items-center justify-center w-8 h-8 shrink-0 text-neo-accent font-bold text-sm">
                              {i + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-neo-fg leading-snug">{module.title}</h4>
                              {module.duration && (
                                <span className="inline-block mt-1.5 text-xs text-neo-muted neo-inset-sm rounded-full px-2.5 py-0.5">
                                  {module.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {module.topics.map((topic, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-neo-muted">
                                <ChevronRight className="w-3 h-3 text-neo-accent mt-1 flex-shrink-0" />
                                <span className="leading-relaxed">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* CTA */}
                  {active.productId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center pt-2"
                    >
                      <NeumorphicButton
                        size="lg"
                        className={cn(enrollClass, "w-full sm:w-auto sm:min-w-72")}
                        onClick={() => handleEnroll(active)}
                      >
                        Enroll Now · {priceOf(active)}
                        <ArrowRight size={18} />
                      </NeumorphicButton>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {visibleCourses.map((course, index) => (
          <motion.div
            key={course.title}
            variants={itemVariants}
            // Each card animates itself (rather than inheriting from the grid) so cards that
            // mount later, via "View all", reveal too. Mobile renders immediately.
            initial={LITE_MOTION ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              layoutId={`card-${course.title}-${id}`}
              onClick={() => handleCardClick(course)}
              className={cn(
                "group cursor-pointer rounded-neo-card p-4 h-full flex flex-col",
                "neo-surface transition-shadow duration-300 ease-out",
                "hover:shadow-neo-lifted",
              )}
            >
              {/* Image, recessed into the surface */}
              <motion.div
                layoutId={`image-${course.title}-${id}`}
                className="neo-inset rounded-neo-inner p-1.5"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-neo-inner">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <div className="pt-4 px-1 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="neo-inset-sm rounded-full inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-neo-accent">
                    <Clock size={12} />
                    {course.hours}
                  </span>
                  <span className="neo-inset-sm rounded-full inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-neo-accent">
                    <BookOpen size={12} />
                    {course.modules} Modules
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 mb-2">
                  <motion.h3
                    layoutId={`title-${course.title}-${id}`}
                    className="text-lg font-semibold text-neo-fg leading-snug line-clamp-2"
                  >
                    {course.title}
                  </motion.h3>
                  <span className="text-sm font-bold text-neo-accent whitespace-nowrap mt-0.5">
                    {priceOf(course)}
                  </span>
                </div>

                <p className="text-sm text-neo-muted line-clamp-2 mb-4">{course.description}</p>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-3">
                  <button
                    type="button"
                    className={cn(
                      "neo-surface-sm rounded-neo-btn flex-1 h-9 inline-flex items-center justify-center gap-1.5",
                      "text-sm font-semibold text-neo-fg transition-all duration-200",
                      "hover:-translate-y-px active:shadow-neo-inset-sm active:translate-y-0.5",
                    )}
                  >
                    Details
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  {course.productId && (
                    <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <NeumorphicButton
                        size="sm"
                        className={cn(enrollClass, "w-full px-4")}
                        onClick={() => handleEnroll(course)}
                      >
                        Enroll Now
                      </NeumorphicButton>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <NeumorphicButton variant="secondary" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show less" : `View all ${courses.length} courses`}
            <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex">
              <ChevronDown size={16} />
            </motion.span>
          </NeumorphicButton>
        </div>
      )}

      <PaymentModal open={payOpen} onOpenChange={setPayOpen} productId={payId} />
    </>
  );
}
