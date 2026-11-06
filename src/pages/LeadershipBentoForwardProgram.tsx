import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  User,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle2,
  BookOpen,
  Users,
  Target,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  Layers,
  TrendingUp,
  Lightbulb,
  Star,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";

/* ============================================================
   TYPES
   ============================================================ */

type LBFPFormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  background: string;
  offering: "Two-Day Workshop" | "Passion Projects" | "Both" | "";
  message: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

/* ============================================================
   SAMPLE DATA — replace with client-approved content
   ============================================================ */

// SAMPLE — replace with client-approved content
const workshopObjectives = [
  "Understand core leadership philosophies and frameworks",
  "Identify and leverage your unique leadership style",
  "Master the art of team dynamics and collaborative decision-making",
  "Develop strategic communication for high-stakes environments",
  "Build resilience and adaptability as a modern leader",
  "Create a personalised 90-day leadership action plan",
];

// SAMPLE — replace with client-approved content
const day1Schedule = [
  { time: "09:00 – 09:30", session: "Welcome & Orientation", type: "opening" },
  {
    time: "09:30 – 11:00",
    session: "Introduction to Leadership Thinking",
    type: "core",
  },
  {
    time: "11:00 – 11:15",
    session: "Tea & Networking Break",
    type: "break",
  },
  {
    time: "11:15 – 13:00",
    session: "Team Dynamics Workshop",
    type: "core",
  },
  { time: "13:00 – 14:00", session: "Lunch & Peer Networking", type: "break" },
  {
    time: "14:00 – 15:30",
    session: "Leadership Styles Assessment",
    type: "core",
  },
  {
    time: "15:30 – 15:45",
    session: "Refreshment Break",
    type: "break",
  },
  {
    time: "15:45 – 17:00",
    session: "Reflective Group Discussions & Day 1 Debrief",
    type: "core",
  },
];

// SAMPLE — replace with client-approved content
const day2Schedule = [
  {
    time: "09:00 – 09:15",
    session: "Day 2 Kickoff & Recap",
    type: "opening",
  },
  {
    time: "09:15 – 11:00",
    session: "Strategic Communication Masterclass",
    type: "core",
  },
  {
    time: "11:00 – 11:15",
    session: "Tea & Networking Break",
    type: "break",
  },
  {
    time: "11:15 – 13:00",
    session: "Real-world Case Studies & Problem-Solving",
    type: "core",
  },
  { time: "13:00 – 14:00", session: "Lunch & Collaboration Hour", type: "break" },
  {
    time: "14:00 – 15:30",
    session: "Personal Action Planning",
    type: "core",
  },
  {
    time: "15:30 – 15:45",
    session: "Refreshment Break",
    type: "break",
  },
  {
    time: "15:45 – 17:30",
    session: "Peer Presentations & Certification Ceremony",
    type: "closing",
  },
];

// SAMPLE — replace with client-approved content
const workshopDetails = [
  { icon: <Layers size={18} />, label: "Format", value: "In-person, cohort-based" },
  { icon: <MapPin size={18} />, label: "Venue", value: "To be announced" },
  {
    icon: <Calendar size={18} />,
    label: "Dates",
    value: "Upcoming cohort — TBA",
  },
  { icon: <Clock size={18} />, label: "Timings", value: "09:00 AM – 05:30 PM (both days)" },
  { icon: <Users size={18} />, label: "Capacity", value: "20–30 participants per cohort" },
  { icon: <Award size={18} />, label: "Certification", value: "Certificate of Completion (TCA)" },
];

// SAMPLE — replace with client-approved content
const passionProjectLevels = [
  {
    id: "explorer",
    name: "Explorer",
    subtitle: "Beginner",
    icon: <Lightbulb size={22} />,
    color: "from-emerald-400/20 to-teal-400/20",
    accentColor: "text-emerald-600",
    eligibility: "No prior project experience required",
    criteria:
      "Willingness to learn, basic awareness of a community or personal challenge",
    deliverables: [
      "Problem statement document",
      "Research summary (5 sources)",
      "Initial solution sketch",
    ],
    mentorship: "Weekly group check-ins + 1 individual session",
  },
  {
    id: "creator",
    name: "Creator",
    subtitle: "Intermediate",
    icon: <Target size={22} />,
    color: "from-blue-400/20 to-indigo-400/20",
    accentColor: "text-blue-600",
    eligibility: "Completion of Explorer level or demonstrated prior initiative",
    criteria:
      "Clear project scope, defined target audience, basic implementation plan",
    deliverables: [
      "Full project proposal",
      "Prototype or MVP",
      "Stakeholder feedback report",
    ],
    mentorship: "Bi-weekly 1:1 mentor sessions + group workshops",
  },
  {
    id: "innovator",
    name: "Innovator",
    subtitle: "Advanced",
    icon: <TrendingUp size={22} />,
    color: "from-violet-400/20 to-purple-400/20",
    accentColor: "text-violet-600",
    eligibility: "Creator level completion + active project portfolio",
    criteria:
      "Data-informed approach, measurable impact metrics, stakeholder engagement",
    deliverables: [
      "Data-driven impact report",
      "Scalability roadmap",
      "Public-facing presentation",
    ],
    mentorship: "Dedicated mentor + peer accountability partner",
  },
  {
    id: "pioneer",
    name: "Pioneer",
    subtitle: "Expert",
    icon: <Star size={22} />,
    color: "from-amber-400/20 to-orange-400/20",
    accentColor: "text-amber-600",
    eligibility: "Innovator level + externally recognised project outcomes",
    criteria:
      "Demonstrated community impact, replicable model, thought leadership evidence",
    deliverables: [
      "Case study publication",
      "Mentoring a junior participant",
      "Summit presentation",
    ],
    mentorship: "Expert advisory panel access + speaking opportunities",
  },
];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

const LeadershipBentoForwardProgram = () => {
  // ——— Workshop Day tab state ———
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // ——— Form state ———
  const [form, setForm] = useState<LBFPFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    background: "",
    offering: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = () => {
    document
      .getElementById("lbfp-enquiry-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    let emailStatus: "sent" | "failed" = "failed";

    try {
      // 1. Save to Firestore first
      await addDoc(collection(db, "lbfpEnquiries"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        background: form.background,
        offering: form.offering,
        message: form.message,
        emailStatus: "pending",
        createdAt: serverTimestamp(),
      });

      // 2. Send email via API — failure does NOT block success
      try {
        const res = await fetch("/api/lbfp-enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          emailStatus = "sent";
        } else {
          console.warn("LBFP email API returned non-OK status:", res.status);
        }
      } catch (emailErr) {
        console.error("LBFP enquiry email error:", emailErr);
      }

      // 3. Log email status (non-blocking)
      console.info("LBFP enquiry email status:", emailStatus);

      setFormStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        background: "",
        offering: "",
        message: "",
      });
    } catch (err) {
      console.error("LBFP enquiry Firestore error:", err);
      setErrorMessage(
        "Something went wrong. Please try again or email us directly."
      );
      setFormStatus("error");
    }
  };

  /* ——— Input class helper ——— */
  const inputClass =
    "w-full px-4 py-3 rounded-neo-btn bg-neo-base shadow-neo-inset text-neo-fg placeholder:text-neo-placeholder focus:outline-none focus:shadow-neo-focus transition-shadow duration-200";

  /* ——— Schedule row colour by type ——— */
  const sessionTypeClass = (type: string) => {
    switch (type) {
      case "opening":
        return "text-violet-600 bg-violet-100/60";
      case "closing":
        return "text-amber-600 bg-amber-100/60";
      case "break":
        return "text-neo-muted bg-neo-base/60";
      default:
        return "text-neo-fg bg-primary/5";
    }
  };

  return (
    <div className="min-h-screen bg-neo-base overflow-x-hidden">
      <SEO
        title="Leadership Bento Forward Program | The Consistent Academy"
        description="The Leadership Bento Forward Program (LBFP) by The Consistent Academy — a transformative two-day leadership workshop and passion project programme designed for the next generation of leaders."
        canonical="/lbfp"
      />
      <Navbar />

      <main>
        {/* ================================================================
            HERO
            ================================================================ */}
        <div className="pt-32 pb-8 relative overflow-hidden">
          {/* Ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-10 right-0 w-[320px] h-[320px] rounded-full bg-accent/10 blur-3xl"
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Programme badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-flex items-center gap-2 neo-inset rounded-full px-5 py-2 mb-6"
            >
              <Award size={15} className="text-neo-accent" />
              <span className="text-neo-accent text-sm font-semibold tracking-wide uppercase">
                Lead with Unparalleled Confidence
              </span>
            </motion.div>

            <AnimatedHeading className="text-neo-fg mb-5 " delay={0.1}>
              Leadership{" "}
              <span className="text-gradient">Bento Forward</span> Program
            </AnimatedHeading>

            <AnimatedText
              className="text-neo-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              delay={0.2}
            >
              The LBFP is a cohort-based programme that equips emerging leaders
              with the mindsets, skills, and frameworks to drive real impact —
              through an immersive two-day workshop and long-form passion
              projects.
            </AnimatedText>
          </div>
        </div>

        {/* ================================================================
            SECTION 1 — TWO-DAY WORKSHOP
            ================================================================ */}
        <SectionWrapper id="workshop" variant="default">
          {/* Section label */}
          <AnimatedText
            as="span"
            className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block"
          >
            Section 01
          </AnimatedText>

          <AnimatedHeading className="text-neo-fg mb-4">
            Two-Day Leadership{" "}
            <span className="text-gradient">Workshop</span>
          </AnimatedHeading>

          <AnimatedText className="text-neo-muted text-lg max-w-2xl mb-10">
            An intensive, hands-on <strong className="text-neo-fg">2-day</strong> experience
            designed to shift your leadership identity and equip you with
            tools you'll use for life.
          </AnimatedText>

          {/* ——— Two-column: Audience + Objectives ——— */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Intended audience */}
            <NeumorphicCard delay={0.1} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="neo-inset rounded-full w-10 h-10 flex items-center justify-center">
                  <Users size={18} className="text-neo-accent" />
                </div>
                <h3 className="text-neo-fg font-bold text-lg">Intended Audience</h3>
              </div>
              {/* SAMPLE — replace with client-approved content */}
              <ul className="space-y-2 text-neo-muted">
                {[
                  "Students (Grades 10–12 / undergraduates)",
                  "Early-career professionals (0–3 years)",
                  "Aspiring team leads & project managers",
                  "Educators seeking leadership development",
                  "Youth group organisers & community leaders",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight
                      size={14}
                      className="text-neo-accent mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </NeumorphicCard>

            {/* Learning objectives */}
            <NeumorphicCard delay={0.2} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="neo-inset rounded-full w-10 h-10 flex items-center justify-center">
                  <Target size={18} className="text-neo-accent" />
                </div>
                <h3 className="text-neo-fg font-bold text-lg">Learning Objectives</h3>
              </div>
              {/* SAMPLE — replace with client-approved content */}
              <ul className="space-y-2 text-neo-muted">
                {workshopObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      size={14}
                      className="text-neo-accent mt-0.5 shrink-0"
                    />
                    {obj}
                  </li>
                ))}
              </ul>
            </NeumorphicCard>
          </div>

          {/* ——— Day 1 / Day 2 Schedule Tab Switcher ——— */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >

            {/* Tab switcher */}
            <div className="flex gap-3 mb-6">
              {([1, 2] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={cn(
                    "px-6 py-2.5 rounded-neo-btn font-semibold text-sm transition-all duration-300",
                    activeDay === day
                      ? "neo-inset text-neo-accent"
                      : "neo-surface text-neo-muted hover:text-neo-fg"
                  )}
                >
                  Day {day}
                </button>
              ))}
            </div>

            {/* Schedule list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="neo-surface rounded-neo-card p-6 space-y-2"
              >
                <h3 className="text-neo-fg font-bold text-lg mb-4">
                  Day {activeDay} — Schedule
                </h3>
                {(activeDay === 1 ? day1Schedule : day2Schedule).map(
                  (item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="flex items-center gap-4 py-2.5 border-b border-primary/10 last:border-0"
                    >
                      <span className="text-neo-muted text-xs font-medium w-28 shrink-0">
                        {item.time}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-neo-inner",
                          sessionTypeClass(item.type)
                        )}
                      >
                        {item.session}
                      </span>
                    </motion.div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ——— Workshop Details grid ——— */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            <h3 className="text-neo-fg font-bold text-xl mb-5">
              Workshop Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshopDetails.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="neo-surface rounded-neo-btn p-4 flex items-start gap-3"
                >
                  <div className="neo-inset rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                    <span className="text-neo-accent">{detail.icon}</span>
                  </div>
                  <div>
                    <p className="text-neo-muted text-xs font-medium uppercase tracking-wide mb-0.5">
                      {detail.label}
                    </p>
                    <p className="text-neo-fg font-semibold text-sm">
                      {detail.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fees note — SAMPLE */}
            <div className="mt-4 neo-inset rounded-neo-btn px-5 py-3 text-sm text-neo-muted">
              💰 <strong className="text-neo-fg">Fees:</strong> To be announced.{" "}
            </div>
          </motion.div>

          {/* Workshop CTA */}
          <div className="text-center">
            <NeumorphicButton onClick={scrollToForm} size="lg">
              Register Your Interest
              <ArrowRight size={18} />
            </NeumorphicButton>
          </div>
        </SectionWrapper>

        {/* Gradient separator bar */}
        <div className="container mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-2" />
        </div>

        {/* ================================================================
            SECTION 2 — PASSION PROJECTS
            ================================================================ */}
        <SectionWrapper id="passion-projects" variant="purple">
          {/* Section label */}
          <AnimatedText
            as="span"
            className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block"
          >
            Section 02
          </AnimatedText>

          <AnimatedHeading className="text-neo-fg mb-4">
            Passion <span className="text-gradient">Projects</span>
          </AnimatedHeading>

          <AnimatedText className="text-neo-muted text-lg max-w-2xl mb-6">
            Go beyond the workshop. The Passion Projects programme challenges
            participants to identify a real-world problem they care about and
            build a solution — guided by mentors at every stage.
          </AnimatedText>

          {/* Purpose block */}
          <NeumorphicCard delay={0.15} className="mb-10 p-6">
            <div className="flex items-start gap-4">
              <div className="neo-inset rounded-full w-11 h-11 flex items-center justify-center shrink-0">
                <BookOpen size={20} className="text-neo-accent" />
              </div>
              <div>
                <h3 className="text-neo-fg font-bold text-lg mb-2">
                  What You Will Accomplish
                </h3>
                {/* SAMPLE — replace with client-approved content */}
                <ul className="space-y-1.5 text-neo-muted text-sm">
                  {[
                    "Identify a meaningful problem in your community or field",
                    "Research, ideate, and prototype a viable solution",
                    "Present your work to a panel of mentors and peers",
                    "Build a portfolio of real-world impact",
                    "Advance through levels based on evidence and outcomes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-neo-accent mt-0.5 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </NeumorphicCard>

          {/* Project Levels */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-neo-fg font-bold text-xl">
                Project Levels
              </h3>
            </div>
            <p className="text-neo-muted text-sm mb-6">
              Participants progress through levels based on demonstrated growth
              and project milestones — not time alone.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {passionProjectLevels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="neo-surface rounded-neo-card p-6 relative overflow-hidden"
                >
                  {/* Gradient tint */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-60 rounded-neo-card pointer-events-none",
                      level.color
                    )}
                  />

                  <div className="relative z-10">
                    {/* Level header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="neo-inset rounded-full w-10 h-10 flex items-center justify-center">
                        <span className={level.accentColor}>{level.icon}</span>
                      </div>
                      <div>
                        <p className="text-neo-fg font-bold text-lg leading-tight">
                          {level.name}
                        </p>
                        <p className={cn("text-xs font-semibold uppercase tracking-wide", level.accentColor)}>
                          {level.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-neo-muted text-xs font-semibold uppercase tracking-wide mb-1">
                          Eligibility
                        </p>
                        <p className="text-neo-fg text-sm">{level.eligibility}</p>
                      </div>
                      <div>
                        <p className="text-neo-muted text-xs font-semibold uppercase tracking-wide mb-1">
                          Criteria
                        </p>
                        <p className="text-neo-fg text-sm">{level.criteria}</p>
                      </div>
                      <div>
                        <p className="text-neo-muted text-xs font-semibold uppercase tracking-wide mb-1">
                          Deliverables
                        </p>
                        <ul className="space-y-1">
                          {level.deliverables.map((d, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-neo-fg text-sm"
                            >
                              <span className={cn("text-xs mt-0.5", level.accentColor)}>•</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-neo-muted text-xs font-semibold uppercase tracking-wide mb-1">
                          Mentorship
                        </p>
                        <p className="text-neo-fg text-sm">{level.mentorship}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Assessment & Progression */}
          <NeumorphicCard delay={0.2} className="mb-10 p-6">
            <div className="flex items-start gap-4">
              <div className="neo-inset rounded-full w-11 h-11 flex items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-neo-accent" />
              </div>
              <div>
                <h3 className="text-neo-fg font-bold text-lg mb-2">
                  Assessment & Progression
                </h3>
                {/* SAMPLE — replace with client-approved content */}
                <p className="text-neo-muted text-sm leading-relaxed">
                  Progression is merit-based and evidence-driven. At each level,
                  participants are assessed by a panel of mentors on the quality of
                  their deliverables, depth of research, and demonstrated growth.
                  There is no fixed timeline — participants advance when they are
                  ready and their work meets the criteria.
                </p>
              </div>
            </div>
          </NeumorphicCard>

          {/* Passion Projects CTA */}
          <div className="text-center">
            <NeumorphicButton onClick={scrollToForm} size="lg">
              Enquire About Passion Projects
              <ArrowRight size={18} />
            </NeumorphicButton>
          </div>
        </SectionWrapper>

        {/* Gradient separator bar */}
        <div className="container mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-2" />
        </div>

        {/* ================================================================
            SECTION 3 — ENQUIRY FORM
            ================================================================ */}
        <SectionWrapper id="lbfp-enquiry-form" variant="default">
          <div className="max-w-2xl mx-auto">
            {/* Section label */}
            <AnimatedText
              as="span"
              className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block text-center"
            >
              Section 03
            </AnimatedText>

            <AnimatedHeading className="text-neo-fg mb-3 text-center">
              Register Your <span className="text-gradient">Interest</span>
            </AnimatedHeading>

            <AnimatedText className="text-neo-muted text-center mb-8">
              Fill in your details below and our team will reach out with
              programme information and next steps.
            </AnimatedText>

            <NeumorphicCard className="p-8">
              {/* ——— Success state ——— */}
              <AnimatePresence>
                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center py-8"
                  >
                    <div className="neo-inset rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-neo-success" />
                    </div>
                    <h3 className="text-neo-fg font-bold text-2xl mb-2">
                      Enquiry Received!
                    </h3>
                    <p className="text-neo-muted text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you for your interest in the Leadership Bento
                      Forward Program. Our team will review your submission and
                      get back to you shortly.
                    </p>
                    <p className="mt-3 text-sm text-neo-accent flex justify-center items-center gap-1.5">
                      <Mail size={15} />
                      theconsistentacademy@gmail.com
                    </p>
                    <div className="mt-6">
                      <NeumorphicButton
                        variant="secondary"
                        onClick={() => setFormStatus("idle")}
                      >
                        Submit Another Enquiry
                      </NeumorphicButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ——— Form ——— */}
              {formStatus !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Full Name <span className="text-neo-accent">*</span>
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-3.5 text-neo-muted"
                        size={16}
                      />
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Email Address <span className="text-neo-accent">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3.5 text-neo-muted"
                        size={16}
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Phone Number <span className="text-neo-accent">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-3.5 text-neo-muted"
                        size={16}
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      City <span className="text-neo-accent">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3.5 text-neo-muted"
                        size={16}
                      />
                      <input
                        type="text"
                        name="city"
                        required
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Your city"
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                  </div>

                  {/* Programme Selection */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Programme Interest <span className="text-neo-accent">*</span>
                    </label>
                    <select
                      name="offering"
                      required
                      value={form.offering}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a programme</option>
                      <option value="Two-Day Workshop">Two-Day Workshop</option>
                      <option value="Passion Projects">Passion Projects</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>

                  {/* Background (optional) */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Your Background{" "}
                      <span className="text-neo-muted text-xs font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      name="background"
                      rows={3}
                      value={form.background}
                      onChange={handleChange}
                      placeholder="Tell us briefly about yourself — your current role, field, or stage of life"
                      className={inputClass}
                    />
                  </div>

                  {/* Message (optional) */}
                  <div>
                    <label className="block text-neo-fg text-sm font-semibold mb-1.5">
                      Message{" "}
                      <span className="text-neo-muted text-xs font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className="absolute left-3 top-3.5 text-neo-muted"
                        size={16}
                      />
                      <textarea
                        name="message"
                        rows={3}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Any specific questions or goals you'd like us to know about"
                        className={cn(inputClass, "pl-10")}
                      />
                    </div>
                  </div>

                  {/* Error feedback */}
                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="neo-inset rounded-neo-btn px-4 py-3 text-sm text-red-500"
                    >
                      ❌ {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <div className="pt-2 text-center">
                    <NeumorphicButton
                      type="submit"
                      size="lg"
                      disabled={formStatus === "loading"}
                    >
                      {formStatus === "loading" ? (
                        <>
                          <span className="animate-pulse">Submitting…</span>
                        </>
                      ) : (
                        <>
                          Submit Enquiry
                          <ArrowRight size={18} />
                        </>
                      )}
                    </NeumorphicButton>
                  </div>
                </form>
              )}
            </NeumorphicCard>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
};

export default LeadershipBentoForwardProgram;
