"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Clock, BookOpen, X, ArrowRight } from "lucide-react";
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
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-4xl h-full md:h-fit md:max-h-[90vh] flex flex-col bg-background rounded-3xl overflow-hidden border border-border/50 shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 hover:bg-secondary transition-all hover:scale-110 active:scale-95"
                onClick={() => setActive(null)}
              >
                <X className="w-4 h-4 text-foreground" />
              </motion.button>

              {/* Image Header */}
              <motion.div 
                layoutId={`image-${active.title}-${id}`} 
                className="relative h-64 w-full flex-shrink-0"
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
                <div className="relative">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Title & Stats */}
                    <div>
                      <motion.h2
                        layoutId={`title-${active.title}-${id}`}
                        className="text-3xl font-bold text-foreground mb-2"
                      >
                        {active.title}
                      </motion.h2>
                      {active.subtitle && (
                        <p className="text-lg text-muted-foreground mb-4">
                          {active.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                          <Clock size={16} />
                          <span className="font-medium">{active.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20">
                          <BookOpen size={16} />
                          <span className="font-medium">{active.modules} Modules</span>
                        </div>
                      </div>
                    </div>

                    {/* Target Audience */}
                    <div className="bg-secondary/50 rounded-2xl p-5 border border-border/50">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Target Audience
                      </h3>
                      <p className="text-foreground leading-relaxed">{active.targetAudience}</p>
                    </div>

                    {/* Promise */}
                    {active.promise && (
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-5 border border-primary/20">
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                          Course Promise
                        </h3>
                        <p className="text-foreground leading-relaxed">{active.promise}</p>
                      </div>
                    )}

                    {/* Highlights */}
                    {active.highlights && active.highlights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">What's Included</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {active.highlights.map((highlight, i) => (
                            <div 
                              key={i} 
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Module Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Course Modules</h3>
                      <div className="space-y-3">
                        {active.moduleDetails.map((module, i) => (
                          <div
                            key={i}
                            className="bg-secondary/30 rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h4 className="font-semibold text-foreground">
                                {module.title}
                              </h4>
                              {module.duration && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap px-2 py-1 bg-background/50 rounded-md">
                                  {module.duration}
                                </span>
                              )}
                            </div>
                            <ul className="space-y-2">
                              {module.topics.map((topic, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-primary mt-0.5 select-none">•</span>
                                  <span className="leading-relaxed">{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-2 pb-2">
                      <Link to="/contact" className="block">
                        <NeumorphicButton variant="primary" className="w-full">
                          Enroll Now
                          <ArrowRight size={18} />
                        </NeumorphicButton>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {courses.map((course, index) => (
          <motion.div
            layoutId={`card-${course.title}-${id}`}
            key={course.title}
            onClick={() => setActive(course)}
            className={cn(
              "group cursor-pointer rounded-3xl overflow-hidden",
              "bg-gradient-to-br from-card to-secondary/20",
              "shadow-neu-lg hover:shadow-neu-xl",
              "transition-all duration-400 ease-out",
              "hover:-translate-y-1"
            )}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Image */}
            <motion.div layoutId={`image-${course.title}-${id}`} className="relative h-48 w-full overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80" />
            </motion.div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <motion.h3
                  layoutId={`title-${course.title}-${id}`}
                  className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
                >
                  {course.title}
                </motion.h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={14} className="text-primary" />
                  <span>{course.hours}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen size={14} className="text-accent" />
                  <span>{course.modules} Modules</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Details
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
