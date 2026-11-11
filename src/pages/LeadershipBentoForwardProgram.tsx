import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reveal } from "@/lib/device";
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
  HandHeart,
  Briefcase,
  Presentation,
  Hammer,
  Search,
  Rocket,
  MessageCircle,
  Brain,
  Sparkles,
  Compass,
  Wifi,
  Building2,
  Tag,
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
import { PaymentModal } from "@/components/payments/PaymentModal";
import {
  PACKAGES,
  WORKSHOP_DATES,
  formatINR,
  applyDiscount,
  isEarlyBirdOpen,
  type DeliveryMode,
} from "../../shared/pricing";

/* ============================================================
   TYPES
   ============================================================ */

type LBFPFormData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  background: string;
  offering: string;
  mode: DeliveryMode;
  date: string;
  message: string;
};

const YEARLY_PACKAGE = "Yearly Package (TCA Future Leaders Annual Programme)";

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
// "Format" was removed; Mode (Online/Offline) and Dates are interactive cards in the JSX.
const workshopDetails = [
  { icon: <MapPin size={18} />, label: "Venue", value: "Offline: to be announced · Online: live" },
  { icon: <Clock size={18} />, label: "Timings", value: "09:00 AM – 05:30 PM (both days)" },
  { icon: <Users size={18} />, label: "Capacity", value: "20–30 participants per cohort" },
  { icon: <Award size={18} />, label: "Certification", value: "Certificate of Participation (TCA)" },
];

const passionProjectLevels = [
  {
    id: "volunteering", level: 1, name: "Volunteering", tagline: "Serve & Make a Difference",
    icon: <HandHeart size={22} />, color: "from-rose-400/20 to-pink-400/20", accentColor: "text-rose-600",
    objective: "Students identify a community need and contribute their time and effort towards addressing it. They participate in meaningful social initiatives and understand the importance of empathy and responsibility. The objective is to develop compassion, civic awareness, and a spirit of service. Students learn that even small actions can create a positive impact.",
  },
  {
    id: "internship", level: 2, name: "Internship", tagline: "Explore & Experience",
    icon: <Briefcase size={22} />, color: "from-sky-400/20 to-blue-400/20", accentColor: "text-sky-600",
    objective: "Students work alongside professionals, organisations, or skilled individuals to gain exposure to real-world work environments. They observe professional practices, understand workplace expectations, and undertake guided responsibilities. The objective is to develop workplace readiness, discipline, and professional awareness. Students gain practical insights into potential career paths.",
  },
  {
    id: "skill-sharing", level: 3, name: "Skill Sharing", tagline: "Learn & Teach",
    icon: <Presentation size={22} />, color: "from-emerald-400/20 to-teal-400/20", accentColor: "text-emerald-600",
    objective: "Students identify a skill they possess or wish to master and share their knowledge with others. They plan and conduct learning sessions, demonstrations, or workshops. The objective is to develop communication, mentoring, and instructional abilities. Students discover that teaching others strengthens their own learning.",
  },
  {
    id: "build-create", level: 4, name: "Build & Create", tagline: "Innovate & Develop",
    icon: <Hammer size={22} />, color: "from-amber-400/20 to-orange-400/20", accentColor: "text-amber-600",
    objective: "Students identify a problem, explore possible solutions, and develop a tangible product, model, resource, or creative solution. They follow a structured process of ideation, planning, prototyping, and improvement. The objective is to encourage creativity, design thinking, and problem-solving. Students transform ideas into practical outcomes.",
  },
  {
    id: "research-survey", level: 5, name: "Research & Survey", tagline: "Investigate & Discover",
    icon: <Search size={22} />, color: "from-indigo-400/20 to-violet-400/20", accentColor: "text-indigo-600",
    objective: "Students investigate a topic, social issue, or question that interests them through systematic research. They collect information using surveys, interviews, observations, and credible secondary sources. The objective is to develop scientific temperament, analytical thinking, and evidence-based reasoning. Students present their findings and suggest possible solutions.",
  },
  {
    id: "entrepreneurship", level: 6, name: "Entrepreneurship", tagline: "Imagine & Launch",
    icon: <Rocket size={22} />, color: "from-fuchsia-400/20 to-purple-400/20", accentColor: "text-fuchsia-600",
    objective: "Students identify a market need or opportunity and develop a business idea to address it. They explore product development, target audiences, budgeting, marketing, and basic financial planning. The objective is to nurture entrepreneurial thinking, initiative, and financial awareness. Students work towards presenting or launching a small business venture.",
  },
];

const passionJourney = [
  { word: "SERVE", desc: "Volunteering – Develop empathy and social responsibility." },
  { word: "EXPLORE", desc: "Internship – Experience the professional world." },
  { word: "SHARE", desc: "Skill Sharing – Learn, teach, and mentor." },
  { word: "CREATE", desc: "Build & Create – Turn ideas into solutions." },
  { word: "INVESTIGATE", desc: "Research & Survey – Discover through evidence." },
  { word: "INNOVATE", desc: "Entrepreneurship – Build ideas into ventures." },
];

/* ——— Leadership Lab Forward (flagship) ——— */
const llfHighlights = [
  "Two days of intensive experiential learning.",
  "Interactive individual and team challenges.",
  "Public speaking and storytelling activities.",
  "Critical thinking and problem-solving exercises.",
  "Leadership simulations and collaborative tasks.",
  "Introduction to Passion Projects and portfolio building.",
  "Personal reflection and goal-setting activities.",
  "Certificate of Participation.",
];

const llfResults = [
  { title: "Develop Communication Confidence", text: "Express ideas clearly, participate actively in discussions, and speak confidently before an audience." },
  { title: "Build Critical Thinking", text: "Question, analyse, and evaluate information while approaching challenges logically." },
  { title: "Cultivate Leadership", text: "Develop initiative, accountability, decision-making abilities, and the capacity to influence others positively." },
  { title: "Strengthen Collaboration", text: "Understand the importance of teamwork, active listening, empathy, and constructive feedback." },
  { title: "Encourage Creativity and Innovation", text: "Think beyond conventional solutions and approach problems from different perspectives." },
  { title: "Promote Purposeful Learning", text: "Explore Passion Projects as a way of discovering personal interests, addressing real-world problems, and creating meaningful outcomes." },
  { title: "Build Self-Awareness", text: "Identify personal strengths, recognise areas for improvement, and establish individual development goals." },
];

const llfGlance = [
  { value: "2 Days", label: "Programme duration" },
  { value: "10 Hours", label: "Experiential learning" },
  { value: "8–12", label: "Target classes" },
  { value: "5 Skills", label: "Core development areas" },
];

const llfSkills = ["Communication", "Critical Thinking", "Leadership", "Passion Projects", "Creativity"];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

/* ——— Leadership Lab Forward visual ———
   Drop a licensed photo at public/leadership/llf-hero.jpg and it is used automatically;
   until then a neumorphic skill-tile composition is shown. */
const llfTiles = [
  { icon: <MessageCircle size={26} />, label: "Communication", tint: "text-violet-600" },
  { icon: <Brain size={26} />, label: "Critical Thinking", tint: "text-sky-600" },
  { icon: <Users size={26} />, label: "Leadership", tint: "text-emerald-600" },
  { icon: <Compass size={26} />, label: "Passion Projects", tint: "text-amber-600" },
  { icon: <Sparkles size={26} />, label: "Creativity", tint: "text-fuchsia-600" },
];

const LlfVisual = () => {
  const [useFallback, setUseFallback] = useState(false);
  if (!useFallback) {
    return (
      <img
        src="/leadership/llf-hero2.jpg"
        alt="Students collaborating during a Leadership Lab Forward session"
        className="w-full h-64 md:h-80 object-cover rounded-neo-card"
        onError={() => setUseFallback(true)}
      />
    );
  }
  return (
    <div className="neo-inset rounded-neo-card p-5 md:p-6 grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {llfTiles.map((t, i) => (
        <motion.div
          key={t.label}
          {...reveal({
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: i * 0.08 },
          })}
          className={cn(
            "neo-surface rounded-neo-btn p-4 flex flex-col items-center justify-center text-center gap-2 min-h-[110px]",
            i === 4 && "col-span-2 md:col-span-1"
          )}
        >
          <span className={t.tint}>{t.icon}</span>
          <span className="text-neo-fg text-xs font-semibold leading-tight">{t.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const packageIncludes: Record<string, string[]> = {
  "pkg-llf": [
    "Communication and public speaking.",
    "Critical and creative thinking.",
    "Leadership and teamwork.",
    "Decision-making and problem-solving.",
    "Introduction to Passion Projects.",
  ],
  "pkg-passion": [
    "Volunteering.",
    "Internship.",
    "Skill Sharing.",
    "Build & Create.",
    "Research & Survey.",
    "Entrepreneurship.",
    "Mentoring, guidance, and project documentation.",
    "Final project presentation and portfolio development.",
  ],
  "pkg-annual": [
    "Two-Day Leadership Lab Forward Workshop.",
    "Complete Passion Projects Programme.",
    "One-Year CC Club (Consistent Communicators Club) membership.",
    "Access to all TCA online courses.",
    "Continued learning, mentoring, and development opportunities.",
  ],
};

const packageMeta: Record<string, { label: string; unit: string }> = {
  "pkg-llf": { label: "Package 01 · Entry Programme", unit: "Per student · 10 hours of experiential learning" },
  "pkg-passion": { label: "Package 02 · Project-Based Development", unit: "Per student · Programme fee" },
  "pkg-annual": { label: "Package 03 · Premium Annual Membership", unit: "Per student · Annual programme fee" },
};

const LeadershipBentoForwardProgram = () => {
  // ——— Workshop Day tab state ———
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // ——— Payment modal ———
  const [payProduct, setPayProduct] = useState<string | null>(null);

  // ——— Form state ———
  const emptyForm: LBFPFormData = {
    name: "",
    email: "",
    phone: "",
    city: "",
    background: "",
    offering: YEARLY_PACKAGE,
    mode: "Online",
    date: "",
    message: "",
  };
  const [form, setForm] = useState<LBFPFormData>(emptyForm);
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

  const setMode = (mode: DeliveryMode) => setForm((prev) => ({ ...prev, mode }));
  const setDate = (date: string) => setForm((prev) => ({ ...prev, date }));
  const dateLabel = (v: string) =>
    WORKSHOP_DATES.find((d) => d.value === v)?.label ?? "";

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
    const payload = { ...form, offering: YEARLY_PACKAGE, date: dateLabel(form.date) };

    try {
      // 1. Save to Firestore first
      await addDoc(collection(db, "lbfpEnquiries"), {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        city: payload.city,
        background: payload.background,
        offering: payload.offering,
        mode: payload.mode,
        preferredDate: payload.date,
        message: payload.message,
        emailStatus: "pending",
        createdAt: serverTimestamp(),
      });

      // 2. Send email via API — failure does NOT block success
      try {
        const res = await fetch("/api/lbfp-enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
      setForm({ ...emptyForm, mode: form.mode, date: form.date });
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
    "w-full px-4 py-2.5 rounded-neo-btn bg-neo-base shadow-neo-inset text-neo-fg text-sm placeholder:text-neo-placeholder focus:outline-none focus:shadow-neo-focus transition-shadow duration-200";

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
            className="pointer-events-none absolute -top-3 -left-32 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-100 right-0 w-[320px] h-[320px] rounded-full bg-accent/10 blur-3xl"
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Programme badge
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
            </motion.div> */}

            <AnimatedHeading className="text-neo-fg mb-5 " delay={0.1}>
              Leadership{" "}
              <span className="text-gradient">Bento Forward</span> Program
            </AnimatedHeading>

            <AnimatedText
              className="text-neo-muted text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
              delay={0.2}
            >
              The LBFP is a cohort-based programme that equips emerging leaders
              with the mindsets, skills, and frameworks to drive real impact —
              through an immersive two-day workshop and long-form passion
              projects.
            </AnimatedText>
          </div>
        

        {/* ================================================================
            SECTION 1 — TWO-DAY WORKSHOP
            ================================================================ */}
        <SectionWrapper id="workshop" variant="default">

          <div className="max-w-6xl mx-auto">

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
            {...reveal({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-50px" },
              transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
            })}
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
            {...reveal({
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-50px" },
              transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
            })}
            className="mb-10"
          >
            <h3 className="text-neo-fg font-bold text-xl mb-5">
              Workshop Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mode: Online / Offline */}
              <div className="neo-surface rounded-neo-btn p-4">
                <p className="text-neo-muted text-xs font-medium uppercase tracking-wide mb-2">
                  Mode
                </p>
                <div className="flex gap-2">
                  {(["Online", "Offline"] as DeliveryMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-neo-btn text-sm font-semibold transition-all duration-300",
                        form.mode === m
                          ? "neo-inset text-neo-accent"
                          : "neo-surface-sm text-neo-muted hover:text-neo-fg"
                      )}
                    >
                      {m === "Online" ? <Wifi size={14} /> : <Building2 size={14} />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates dropdown */}
              <div className="neo-surface rounded-neo-btn p-4">
                <p className="text-neo-muted text-xs font-medium uppercase tracking-wide mb-2">
                  Dates
                </p>
                <select
                  value={form.date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-neo-btn bg-neo-base shadow-neo-inset text-neo-fg text-sm focus:outline-none focus:shadow-neo-focus"
                  aria-label="Select workshop dates"
                >
                  <option value="">Select your preferred dates</option>
                  {WORKSHOP_DATES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {workshopDetails.map((detail, i) => (
                <motion.div
                  key={detail.label}
                  {...reveal({
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: {
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                  })}
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
          </motion.div>

          {/* Workshop CTA */}
          <div className="text-center">
            <NeumorphicButton onClick={() => setPayProduct("pkg-llf")} size="lg">
              Enrol in the Workshop · {formatINR(PACKAGES[0].price)}
              <ArrowRight size={18} />
            </NeumorphicButton>
          </div>

        </div>

        </SectionWrapper>

        {/* ================================================================
            SECTION 2 — LEADERSHIP LAB FORWARD (FLAGSHIP)
            ================================================================ */}
        <SectionWrapper id="leadership-lab-forward" variant="default">
          <div className="max-w-6xl mx-auto">
            <AnimatedText
              as="span"
              className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block"
            >
              Section 02
            </AnimatedText>

            <NeumorphicCard className="p-6 md:p-10">
              <span className="inline-flex neo-inset rounded-full px-4 py-1.5 text-neo-accent text-xs font-bold uppercase tracking-widest mb-4">
                TCA Flagship Programme
              </span>
              <h2 className="text-neo-fg font-bold text-3xl md:text-5xl tracking-tight">
                Leadership Lab <span className="text-gradient">Forward</span>
              </h2>
              <p className="text-neo-accent-mid font-semibold text-lg mt-2 mb-6">
                Learn. Lead. Create Impact.
              </p>

              <LlfVisual />

              <p className="text-neo-fg font-semibold mt-5">
                A two-day experiential journey for students of Classes 8–12.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {llfSkills.map((s) => (
                  <span key={s} className="neo-surface-sm rounded-full px-3 py-1 text-xs font-medium text-neo-muted">
                    {s}
                  </span>
                ))}
              </div>

              {/* Programme at a glance */}
              <h3 className="text-neo-fg font-bold text-lg mt-8 mb-4">Programme at a glance</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {llfGlance.map((g) => (
                  <div key={g.label} className="neo-inset rounded-neo-btn p-4">
                    <p className="text-neo-fg font-bold text-2xl">{g.value}</p>
                    <p className="text-neo-muted text-xs mt-1">{g.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Highlights */}
                <div className="neo-surface rounded-neo-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="neo-inset rounded-full w-10 h-10 flex items-center justify-center">
                      <Star size={18} className="text-neo-accent" />
                    </div>
                    <div>
                      <h3 className="text-neo-fg font-bold text-lg leading-tight">Programme Highlights</h3>
                      <p className="text-neo-muted text-xs">Format: Two-Day Conclave · Grades 8–12</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {llfHighlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-neo-muted">
                        <CheckCircle2 size={14} className="text-neo-accent mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className="neo-surface rounded-neo-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="neo-inset rounded-full w-10 h-10 flex items-center justify-center">
                      <Target size={18} className="text-neo-accent" />
                    </div>
                    <div>
                      <h3 className="text-neo-fg font-bold text-lg leading-tight">Programme Results</h3>
                      <p className="text-neo-muted text-xs">By the end, students will be able to:</p>
                    </div>
                  </div>
                  <ol className="space-y-3">
                    {llfResults.map((r, i) => (
                      <li key={r.title} className="flex items-start gap-3 text-sm">
                        <span className="neo-inset rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold text-neo-accent shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-neo-muted">
                          <strong className="text-neo-fg">{r.title}:</strong> {r.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="text-center mt-8">
                <NeumorphicButton onClick={() => setPayProduct("pkg-llf")} size="lg">
                  Enrol · {formatINR(PACKAGES[0].price)}
                  <ArrowRight size={18} />
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          </div>
        </SectionWrapper>

        {/* ================================================================
            SECTION 3 — PASSION PROJECTS (six levels)
            ================================================================ */}
        <div className="max-w-[95%] mx-auto">
          <SectionWrapper id="passion-projects" variant="purple" className="!overflow-x-clip !overflow-y-visible">
            <div className="max-w-6xl mx-auto">
              <AnimatedText
                as="span"
                className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block"
              >
                Section 03
              </AnimatedText>

              <AnimatedHeading className="text-neo-fg mb-4">
                TCA – Passion <span className="text-gradient">Projects</span>
              </AnimatedHeading>
              <p className="text-neo-accent-mid font-semibold mb-3">
                Six Levels of Experiential Learning | From Ideas to Impact
              </p>

              <AnimatedText className="text-neo-muted text-lg max-w-3xl mb-10">
                Passion Projects at The Consistent Academy empower students to explore their
                interests, develop practical skills, identify real-world challenges, and create
                meaningful contributions to society.
              </AnimatedText>

              {/* Six levels */}
              <h3 className="text-neo-fg font-bold text-xl mb-5">The Six Levels of Passion Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                {passionProjectLevels.map((level, index) => (
                  <motion.div
                    key={level.id}
                    {...reveal({
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-50px" },
                      transition: { duration: 0.6, delay: (index % 2) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
                    })}
                    className="neo-surface rounded-neo-card p-6 relative overflow-hidden"
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-60 rounded-neo-card pointer-events-none",
                        level.color
                      )}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="neo-inset rounded-full w-11 h-11 flex items-center justify-center">
                          <span className={level.accentColor}>{level.icon}</span>
                        </div>
                        <div>
                          <p className={cn("text-xs font-bold uppercase tracking-wide", level.accentColor)}>
                            Level {level.level}
                          </p>
                          <p className="text-neo-fg font-bold text-lg leading-tight">
                            {level.name} – {level.tagline}
                          </p>
                        </div>
                      </div>
                      <p className="text-neo-muted text-sm leading-relaxed">{level.objective}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Journey */}
              <h3 className="text-neo-fg font-bold text-xl mb-5">The Passion Projects Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                {passionJourney.map((j, i) => (
                  <div key={j.word} className="neo-surface rounded-neo-btn p-4 text-center">
                    <span className="neo-inset rounded-full w-8 h-8 inline-flex items-center justify-center text-xs font-bold text-neo-accent mb-2">
                      {i + 1}
                    </span>
                    <p className="text-neo-fg font-bold text-sm tracking-wide">{j.word}</p>
                    <p className="text-neo-muted text-xs mt-1 leading-snug">{j.desc}</p>
                  </div>
                ))}
              </div>

              {/* Philosophy */}
              <NeumorphicCard delay={0.15} className="mb-10 p-6">
                <div className="flex items-start gap-4">
                  <div className="neo-inset rounded-full w-11 h-11 flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-neo-accent" />
                  </div>
                  <div>
                    <h3 className="text-neo-fg font-bold text-lg mb-2">The TCA Philosophy</h3>
                    <p className="text-neo-muted text-sm leading-relaxed mb-3">
                      Don't just learn about the world. Experience it, question it, contribute to it,
                      and create something meaningful.
                    </p>
                    <p className="text-neo-fg text-sm font-semibold mb-1.5">
                      Every Passion Project should leave the student with three things:
                    </p>
                    <ul className="space-y-1.5 text-neo-muted text-sm">
                      {["A skill developed.", "An experience documented.", "An impact demonstrated."].map((t) => (
                        <li key={t} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-neo-accent mt-0.5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </NeumorphicCard>

              <div className="text-center">
                <NeumorphicButton onClick={() => setPayProduct("pkg-passion")} size="lg">
                  Enrol in Passion Projects · {formatINR(PACKAGES[1].price)}
                  <ArrowRight size={18} />
                </NeumorphicButton>
              </div>
            </div>
          </SectionWrapper>
        </div>

        {/* ================================================================
            SECTION 4 — PACKAGES & PRICING
            ================================================================ */}
        <SectionWrapper id="packages" variant="default">
          <div className="max-w-6xl mx-auto">
            <AnimatedText
              as="span"
              className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3 block text-center"
            >
              Section 04
            </AnimatedText>
            <AnimatedHeading className="text-neo-fg mb-3 text-center">
              Leadership &amp; Future-Ready <span className="text-gradient">Learning Packages</span>
            </AnimatedHeading>
            <AnimatedText className="text-neo-muted text-center max-w-2xl mx-auto mb-10">
              A structured development journey from self-discovery to real-world impact — more than
              workshops: a complete student-development ecosystem.
            </AnimatedText>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {PACKAGES.map((pkg, i) => {
                const featured = pkg.id === "pkg-annual";
                const meta = packageMeta[pkg.id];
                return (
                  <motion.div
                    key={pkg.id}
                    {...reveal({
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-50px" },
                      transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
                    })}
                    className={cn(
                      "rounded-neo-card p-6 flex flex-col relative",
                      featured ? "neo-surface shadow-neo-lifted ring-2 ring-neo-accent/30" : "neo-surface"
                    )}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 neo-inset rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-neo-accent bg-neo-base">
                        Most complete
                      </span>
                    )}
                    <p className="text-neo-accent text-[11px] font-bold uppercase tracking-widest">{meta.label}</p>
                    <h3 className="text-neo-fg font-bold text-2xl mt-2 leading-tight">{pkg.name}</h3>
                    <p className="text-neo-muted text-sm mt-1">{pkg.tagline}</p>

                    <p className="text-neo-fg font-bold text-4xl mt-5">{formatINR(pkg.price)}</p>
                    <p className="text-neo-muted text-xs mt-1 mb-5">{meta.unit}</p>

                    <p className="text-neo-fg text-xs font-bold uppercase tracking-wide mb-2">
                      {featured ? "Includes" : "Programme includes"}
                    </p>
                    <ul className="space-y-1.5 mb-6">
                      {packageIncludes[pkg.id].map((inc) => (
                        <li key={inc} className="flex items-start gap-2 text-sm text-neo-muted">
                          <CheckCircle2 size={14} className="text-neo-accent mt-0.5 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>

                    {/* Discounts */}
                    <div className="neo-inset rounded-neo-btn p-3 mb-6 mt-auto">
                      <p className="flex items-center gap-1.5 text-neo-fg text-xs font-bold uppercase tracking-wide mb-2">
                        <Tag size={12} /> Discounts
                      </p>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-neo-muted text-left">
                            <th className="font-medium pb-1">Category</th>
                            <th className="font-medium pb-1 text-right">Off</th>
                            <th className="font-medium pb-1 text-right">Payable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pkg.discounts.map((d) => (
                            <tr key={d.type} className="text-neo-fg">
                              <td className="py-0.5">{d.label}</td>
                              <td className="py-0.5 text-right">{d.bps / 100}%</td>
                              <td className="py-0.5 text-right font-semibold">
                                {formatINR(applyDiscount(pkg.price, d.bps))}
                                {d.type === "sibling" && <span className="text-neo-muted font-normal"> each</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <NeumorphicButton onClick={() => setPayProduct(pkg.id)} size="lg" className="w-full">
                      Enrol Now
                      <ArrowRight size={18} />
                    </NeumorphicButton>
                  </motion.div>
                );
              })}
            </div>

            {/* Policy + instalments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <NeumorphicCard className="p-6">
                <h3 className="text-neo-fg font-bold text-lg mb-3">Discount Policy</h3>
                <ul className="space-y-2 text-sm text-neo-muted">
                  <li><strong className="text-neo-fg">Early Bird:</strong> registration and advance payment before the announced deadline{isEarlyBirdOpen() ? "" : " (now closed)"}.</li>
                  <li><strong className="text-neo-fg">Twins / Siblings:</strong> both children must enrol in the same programme; the discount applies to both.</li>
                  <li><strong className="text-neo-fg">School Discount:</strong> minimum 10 students from one school, based on confirmed registrations and advance payments.</li>
                  <li><strong className="text-neo-fg">Institutional Partnership:</strong> custom quotation for 20+ students — <a href="/contact" className="text-neo-accent underline">contact us</a>.</li>
                  <li>Discounts are not cumulative — only one can be availed. Taxes, if applicable, are communicated separately.</li>
                </ul>
              </NeumorphicCard>
              <NeumorphicCard delay={0.1} className="p-6">
                <h3 className="text-neo-fg font-bold text-lg mb-3">Annual Programme Payment Options</h3>
                <p className="text-neo-fg font-bold text-3xl">{formatINR(PACKAGES[2].price)}</p>
                <p className="text-neo-muted text-sm mt-1 mb-3">Standard annual programme fee.</p>
                <p className="text-neo-muted text-sm">
                  The annual package is a significant commitment, so flexible instalment options are
                  being finalised. To discuss an instalment plan, please{" "}
                  <a href="/contact" className="text-neo-accent underline">get in touch</a>.
                </p>
              </NeumorphicCard>
            </div>
          </div>
        </SectionWrapper>
      </div>

        {/* ================================================================
            SECTION 5 — REGISTRATION FORM
            ================================================================ */}
        <SectionWrapper id="lbfp-enquiry-form" variant="default" className="!pt-8 md:!pt-8">
          <div className="max-w-5xl mx-auto">

            <AnimatedHeading className="text-neo-fg mb-3 text-center">
              Register Your <span className="text-gradient">Child Now !</span>
            </AnimatedHeading>

            <AnimatedText className="text-neo-muted text-center mb-10 max-w-2xl mx-auto">
              Fill in your details and our team will reach out with programme information and next steps.
            </AnimatedText>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              {/* ——— Left: programme summary ——— */}
              <NeumorphicCard className="lg:col-span-2 p-6 lg:sticky lg:top-28">
                <span className="inline-flex neo-inset rounded-full px-3 py-1 text-neo-accent text-[11px] font-bold uppercase tracking-widest mb-3">
                  Yearly Package
                </span>
                <h3 className="text-neo-fg font-bold text-xl leading-tight">{PACKAGES[2].name}</h3>
                <p className="text-neo-muted text-sm mt-1">{PACKAGES[2].tagline}</p>
                <p className="text-neo-fg font-bold text-3xl mt-4">{formatINR(PACKAGES[2].price)}</p>
                <p className="text-neo-muted text-xs mb-4">Per student · Annual programme fee</p>
                <ul className="space-y-2 mb-5">
                  {packageIncludes["pkg-annual"].map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-xs text-neo-muted">
                      <CheckCircle2 size={13} className="text-neo-accent mt-0.5 shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
                <NeumorphicButton variant="secondary" className="w-full" onClick={() => setPayProduct("pkg-annual")}>
                  Skip the form · Enrol &amp; Pay
                  <ArrowRight size={16} />
                </NeumorphicButton>
              </NeumorphicCard>

              {/* ——— Right: form ——— */}
              <NeumorphicCard className="lg:col-span-3 p-6 md:p-8">
                {/* Success state */}
                <AnimatePresence>
                  {formStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="text-center py-6"
                    >
                      <div className="neo-inset rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-neo-success" />
                      </div>
                      <h3 className="text-neo-fg font-bold text-2xl mb-2">Enquiry Received!</h3>
                      <p className="text-neo-muted text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for your interest in the Leadership Bento Forward Program. Our team will
                        review your submission and get back to you shortly.
                      </p>
                      <p className="mt-3 text-sm text-neo-accent flex justify-center items-center gap-1.5">
                        <Mail size={15} />
                        theconsistentacademy@gmail.com
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3 justify-center">
                        <NeumorphicButton onClick={() => setPayProduct("pkg-annual")}>
                          Ready to enrol? Pay now
                        </NeumorphicButton>
                        <NeumorphicButton variant="secondary" onClick={() => setFormStatus("idle")}>
                          Submit Another Enquiry
                        </NeumorphicButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {formStatus !== "success" && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Full Name <span className="text-neo-accent">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-neo-muted" size={15} />
                          <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" className={cn(inputClass, "pl-9")} />
                        </div>
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Email Address <span className="text-neo-accent">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 text-neo-muted" size={15} />
                          <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" className={cn(inputClass, "pl-9")} />
                        </div>
                      </div>
                      {/* Phone */}
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Phone Number <span className="text-neo-accent">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-neo-muted" size={15} />
                          <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={cn(inputClass, "pl-9")} />
                        </div>
                      </div>
                      {/* City */}
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          City <span className="text-neo-accent">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-neo-muted" size={15} />
                          <input type="text" name="city" required value={form.city} onChange={handleChange} placeholder="Your city" className={cn(inputClass, "pl-9")} />
                        </div>
                      </div>
                    </div>

                    {/* Mode + Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Mode <span className="text-neo-accent">*</span>
                        </span>
                        <div className="flex gap-2">
                          {(["Online", "Offline"] as DeliveryMode[]).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMode(m)}
                              aria-pressed={form.mode === m}
                              className={cn(
                                "flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-neo-btn text-sm font-semibold transition-all duration-300",
                                form.mode === m ? "neo-inset text-neo-accent" : "neo-surface-sm text-neo-muted hover:text-neo-fg"
                              )}
                            >
                              {m === "Online" ? <Wifi size={14} /> : <Building2 size={14} />}
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Preferred Dates <span className="text-neo-muted font-normal">(optional)</span>
                        </label>
                        <select name="date" value={form.date} onChange={handleChange} className={inputClass}>
                          <option value="">Select dates</option>
                          {WORKSHOP_DATES.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Programme (fixed to the Yearly Package) */}
                    <div>
                      <span className="block text-neo-fg text-xs font-semibold mb-1.5">Programme</span>
                      <div className="neo-inset rounded-neo-btn px-4 py-2.5 text-sm text-neo-fg font-semibold flex items-center justify-between gap-2">
                        <span>{YEARLY_PACKAGE}</span>
                        <CheckCircle2 size={16} className="text-neo-accent shrink-0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Student Background <span className="text-neo-muted font-normal">(optional)</span>
                        </label>
                        <textarea name="background" rows={3} value={form.background} onChange={handleChange} placeholder="Class, school, interests" className={cn(inputClass, "resize-none")} />
                      </div>
                      <div>
                        <label className="block text-neo-fg text-xs font-semibold mb-1.5">
                          Message <span className="text-neo-muted font-normal">(optional)</span>
                        </label>
                        <textarea name="message" rows={3} value={form.message} onChange={handleChange} placeholder="Questions or goals" className={cn(inputClass, "resize-none")} />
                      </div>
                    </div>

                    {formStatus === "error" && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="neo-inset rounded-neo-btn px-4 py-3 text-sm text-red-500">
                        ❌ {errorMessage}
                      </motion.div>
                    )}

                    <div className="pt-1 text-center">
                      <NeumorphicButton type="submit" size="lg" disabled={formStatus === "loading"}>
                        {formStatus === "loading" ? (
                          <span className="animate-pulse">Submitting…</span>
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
          </div>
        </SectionWrapper>
      </main>

      <Footer />

      <PaymentModal
        open={payProduct !== null}
        onOpenChange={(o) => !o && setPayProduct(null)}
        productId={payProduct ?? PACKAGES[0].id}
        defaultMode={form.mode}
        defaultDate={form.date}
      />
    </div>
  );
};

export default LeadershipBentoForwardProgram;
