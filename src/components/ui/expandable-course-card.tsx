"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Clock, BookOpen, X, ArrowRight, Users, Target, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeumorphicButton } from "./neumorphic-button";
import { Link } from "react-router-dom";

interface CourseModule {
  title: string;
  duration?: string;
  topics: string[];
}

export interface Course {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  hours: string;
  price: string;
  modules: number;
  targetAudience: string;
  promise?: string;
  moduleDetails: CourseModule[];
  highlights?: string[];
}

interface ExpandableCourseCardProps {
  courses: Course[];
}

export default function ExpandableCourseCard({ courses }: ExpandableCourseCardProps) {
  const [active, setActive] = useState<Course | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {active && (
          <div className="fixed inset-0 z-[70] overflow-y-auto p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="min-h-full flex items-center justify-center"
            >
              <motion.div
                ref={ref}
                layoutId={`card-${active.title}-${id}`}
                className="w-full max-w-5xl bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden">
                  <motion.div
                    layoutId={`image-${active.title}-${id}`}
                    className="absolute inset-0"
                  >
                    <img
                      src={active.image}
                      alt={active.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </motion.div>
                  
                  {/* Close Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-background/90 backdrop-blur-sm shadow-neu-sm hover:shadow-neu-md transition-all hover:scale-105 active:scale-95"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Header Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary backdrop-blur-sm">
                        <Clock size={14} />
                        <span className="text-sm font-medium">{active.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-accent backdrop-blur-sm">
                        <BookOpen size={14} />
                        <span className="text-sm font-medium">{active.modules} Modules</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <motion.h2
                        layoutId={`title-${active.title}-${id}`}
                        className="text-3xl md:text-4xl font-bold text-white leading-tight"
                      >
                        {active.title}
                      </motion.h2>

                      <div className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">
                        ₹ {active.price}
                      </div>
                    </div>

                    {active.subtitle && (
                      <p className="text-lg text-white/90 font-medium">
                        {active.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="p-6 md:p-8 space-y-8">
                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6"
                    >
                      <p className="text-foreground leading-relaxed">{active.description}</p>
                    </motion.div>

                    {/* Key Information Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Target Audience */}
                      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-primary" />
                          <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
                            Target Audience
                          </h3>
                        </div>
                        <p className="text-foreground leading-relaxed">{active.targetAudience}</p>
                      </div>

                      {/* Course Promise */}
                      {active.promise && (
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                              Course Promise
                            </h3>
                          </div>
                          <p className="text-foreground leading-relaxed">{active.promise}</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Highlights */}
                    {active.highlights && active.highlights.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="w-5 h-5 text-accent" />
                          <h3 className="text-xl font-semibold text-foreground">What's Included</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {active.highlights.map((highlight, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-colors"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="text-sm text-foreground">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Module Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-foreground mb-6">Course Modules</h3>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {active.moduleDetails.map((module, i) => (
                          <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group bg-background rounded-xl p-5 hover:shadow-neu-md transition-all hover:-translate-y-1"
                          >
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary font-semibold text-sm">
                                  {i + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {module.title}
                                  </h4>
                                  {module.duration && (
                                    <div className="mt-1">
                                      <span className="text-xs text-foreground/70 bg-primary/10 px-2 py-1 rounded-md">
                                        {module.duration}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ul className="space-y-2">
                              {module.topics.map((topic, j) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-sm text-foreground/80 group-hover:text-foreground transition-colors"
                                >
                                  <ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="leading-relaxed">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-4"
                    >
                      <Link to="/contact" onClick={handleClose}>
                        <NeumorphicButton variant="primary" className="w-full py-6 text-lg font-semibold">
                          Enroll Now
                          <ArrowRight className="ml-2" size={20} />
                        </NeumorphicButton>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {courses.map((course, index) => (
          <motion.div
            key={course.title}
            variants={itemVariants}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              layoutId={`card-${course.title}-${id}`}
              onClick={() => handleCardClick(course)}
              className={cn(
                "group cursor-pointer rounded-3xl overflow-hidden",
                "bg-gradient-to-br from-background via-background to-secondary/10",
                "shadow-none hover:shadow-xl", 
                "transition-all duration-300 ease-out",
                "hover:-translate-y-2",
                "active:scale-[0.98]",
                "h-full flex flex-col"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image Container */}
              <motion.div 
                layoutId={`image-${course.title}-${id}`} 
                className="relative h-48 w-full overflow-hidden"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <motion.div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs">
                      <Clock size={12} />
                      <span>{course.hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs">
                      <BookOpen size={12} />
                      <span>{course.modules}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <motion.h3
                      layoutId={`title-${course.title}-${id}`}
                      className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors"
                    >
                      {course.title}
                    </motion.h3>

                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      ₹ {course.price}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/80 line-clamp-3 mb-4">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4">
                  <div className="text-sm text-primary font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}