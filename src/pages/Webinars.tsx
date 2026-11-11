import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  Clock,
  Monitor,
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Mail,
  Phone,
  User,
  CreditCard,
  ArrowRight,
  MapPin,
  BookOpen,
  Video,
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
import { IS_TOUCH, reveal } from "@/lib/device";

/* ─────────────────────────── TYPES ─────────────────────────── */

interface Speaker {
  name: string;
  designation: string;
  bio: string;
  photo: string;
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  topic: string;
  speaker: Speaker;
  date: string;
  time: string;
  timezone: string;
  duration: string;
  platform: string;
  audience: string;
  prerequisites?: string;
  status: "upcoming" | "registration_open" | "completed";
  isSample: true;
}

type WebinarFormData = {
  name: string;
  email: string;
  phone: string;
};

/* ─────────────────────────── SAMPLE DATA ─────────────────────────── */

const webinars: Webinar[] = [
  {
    id: "public-speaking-101",
    title: "The Art of Confident Public Speaking",
    description:
      "Overcome stage fright, master body language, and captivate any audience with proven psychological techniques. This power-packed session will equip you with the frameworks that top communicators use in boardrooms and stages worldwide.",
    topic: "Public Speaking & Communication",
    speaker: {
      name: "Dr. Priya Sharma",
      designation: "Communication Coach & NLP Practitioner",
      bio:
        "Dr. Priya Sharma has over 14 years of experience training executives, students, and TEDx speakers in the art of confident communication. She holds a doctorate in Applied Linguistics and has coached speakers across 12 countries.",
      photo: "",
    },
    date: "December 15, 2026",
    time: "6:00 PM – 7:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Zoom",
    audience: "Professionals, students, and anyone who wants to speak confidently in public",
    prerequisites: "No prior experience required",
    status: "upcoming",
    isSample: true,
  },
  {
    id: "business-english-pro",
    title: "Mastering Business English for Professionals",
    description:
      "Level up your corporate communication with advanced vocabulary, polished email writing, and meeting etiquette. Learn how to influence decisions, navigate difficult conversations, and project authority in any professional setting.",
    topic: "Business English & Corporate Communication",
    speaker: {
      name: "Mr. Rahul Desai",
      designation: "Corporate Trainer & Business Communication Expert",
      bio:
        "Rahul Desai is a seasoned corporate trainer who has facilitated communication workshops for Fortune 500 teams and leading Indian conglomerates. With an MBA from IIM Bangalore, he blends business acumen with language expertise.",
      photo: "",
    },
    date: "November 24, 2026",
    time: "7:00 PM – 8:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Google Meet",
    audience: "Working professionals, managers, and MBA aspirants",
    prerequisites: "Intermediate English proficiency",
    status: "upcoming",
    isSample: true,
  },
  {
    id: "ielts-writing-advanced",
    title: "IELTS Writing Task 2: Advanced Strategies",
    description:
      "Deep-dive into examiner expectations, band 8+ essay structures, and the most common pitfalls that keep candidates from achieving their target score. Live essay analysis, real-time Q&A, and a personalized feedback session included.",
    topic: "IELTS Preparation — Writing",
    speaker: {
      name: "Ms. Vidya Wankhade",
      designation: "Founder, The Consistent Academy & IELTS Expert",
      bio:
        "Vidya Wankhade is the founder of The Consistent Academy and has helped over 2,000 students achieve band 7+ in IELTS. Her systematic approach to academic writing has made her one of the most sought-after IELTS coaches in Maharashtra.",
      photo: "",
    },
    date: "November 17, 2026",
    time: "5:00 PM – 6:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Zoom",
    audience: "IELTS aspirants targeting Band 7 or above",
    prerequisites: "Familiarity with IELTS Writing Task 2 format",
    status: "registration_open",
    isSample: true,
  },
  {
    id: "email-communication-workplace",
    title: "Effective Email Communication in the Workplace",
    description:
      "A deep exploration of professional email writing — tone, structure, subject lines, and how to write emails that get responses. Covered real-world scenarios from requesting approvals to handling conflict over email.",
    topic: "Workplace Communication",
    speaker: {
      name: "Ms. Vidya Wankhade",
      designation: "Founder, The Consistent Academy",
      bio:
        "Vidya Wankhade is the founder of The Consistent Academy and has helped over 2,000 students achieve measurable communication improvements in their professional lives.",
      photo: "",
    },
    date: "September 20, 2026",
    time: "6:00 PM – 7:00 PM",
    timezone: "IST",
    duration: "60 minutes",
    platform: "Zoom",
    audience: "Corporate employees and freshers",
    prerequisites: "None",
    status: "completed",
    isSample: true,
  },
  {
    id: "interview-skills-masterclass",
    title: "Interview Skills Masterclass",
    description:
      "From body language and first impressions to structuring STAR-format answers and salary negotiation — this masterclass covered everything candidates need to ace interviews at top companies.",
    topic: "Career & Interview Preparation",
    speaker: {
      name: "Mr. Rahul Desai",
      designation: "Corporate Trainer & Business Communication Expert",
      bio:
        "Rahul Desai is a seasoned corporate trainer with deep expertise in HR communication, interview coaching, and professional grooming for the corporate world.",
      photo: "",
    },
    date: "October 10, 2026",
    time: "5:30 PM – 7:00 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Google Meet",
    audience: "Job seekers, freshers, and professionals switching careers",
    prerequisites: "None",
    status: "completed",
    isSample: true,
  },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */

/** Generate initials avatar from a speaker's name */
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
};

/** Tailwind colour classes by status */
const statusConfig = {
  upcoming: {
    label: "Upcoming",
    textClass: "text-neo-success",
    bgClass: "bg-neo-base",
    dotClass: "bg-neo-success",
  },
  registration_open: {
    label: "Registration Open",
    textClass: "text-neo-accent",
    bgClass: "bg-neo-base",
    dotClass: "bg-neo-accent",
  },
  completed: {
    label: "Completed",
    textClass: "text-neo-muted",
    bgClass: "bg-neo-base",
    dotClass: "bg-neo-muted",
  },
};

/* ─────────────────────────── SUB-COMPONENTS ─────────────────────────── */

/** Speaker avatar — neumorphic inset circle with initials fallback */
const SpeakerAvatar = ({
  speaker,
  size = "md",
}: {
  speaker: Speaker;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-20 text-xl",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full neo-inset
        flex items-center justify-center
        flex-shrink-0
      `}
    >
      {speaker.photo ? (
        <img
          src={speaker.photo}
          alt={speaker.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="font-bold text-neo-accent select-none">
          {getInitials(speaker.name)}
        </span>
      )}
    </div>
  );
};

/** Pill badge for webinar status */
const StatusBadge = ({ status }: { status: Webinar["status"] }) => {
  const cfg = statusConfig[status];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        rounded-full neo-inset-sm text-xs font-semibold
        ${cfg.textClass}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
};

/** Expandable registration form below a card */
const RegistrationForm = ({
  webinar,
  onClose,
}: {
  webinar: Webinar;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<WebinarFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /* 1. Save to Firestore — primary action */
      await addDoc(collection(db, "webinarRegistrations"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        webinarId: webinar.id,
        webinarTitle: webinar.title,
        createdAt: serverTimestamp(),
        emailStatus: "pending",
      });

      /* 2. Fire-and-forget email via API — failure is non-blocking */
      fetch("/api/webinar-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          webinarId: webinar.id,
          webinarTitle: webinar.title,
        }),
      }).catch((emailErr) => {
        /* Email failure is intentionally non-fatal */
        console.warn("Webinar registration email notification failed:", emailErr);
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Webinar registration error:", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="w-16 h-16 rounded-full neo-inset flex items-center justify-center">
          <CheckCircle className="text-neo-success" size={32} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-neo-fg mb-1">
            You're Registered! 🎉
          </h4>
          <p className="text-neo-muted text-sm max-w-sm">
            We've recorded your interest for{" "}
            <strong className="text-neo-fg">{webinar.title}</strong>. We'll
            reach out with joining details closer to the date.
          </p>
        </div>
        <NeumorphicButton variant="ghost" size="sm" onClick={onClose}>
          Close
        </NeumorphicButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Pre-filled webinar field */}
      <div>
        <label className="block text-xs font-semibold text-neo-muted uppercase tracking-widest mb-1.5">
          Webinar
        </label>
        <div className="w-full px-4 py-3 rounded-neo-btn neo-inset text-neo-fg font-medium text-sm">
          {webinar.title}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-neo-muted uppercase tracking-widest mb-1.5">
          Full Name <span className="text-neo-accent">*</span>
        </label>
        <div className="relative">
          <User
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neo-muted"
            size={16}
          />
          <input
            type="text"
            name="name"
            required
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            className="
              w-full pl-10 pr-4 py-3 rounded-neo-btn
              neo-inset-sm
              text-neo-fg placeholder:text-neo-placeholder
              text-sm focus:outline-none focus:shadow-neo-focus
              transition-shadow duration-300
            "
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-neo-muted uppercase tracking-widest mb-1.5">
          Email Address <span className="text-neo-accent">*</span>
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neo-muted"
            size={16}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="
              w-full pl-10 pr-4 py-3 rounded-neo-btn
              neo-inset-sm
              text-neo-fg placeholder:text-neo-placeholder
              text-sm focus:outline-none focus:shadow-neo-focus
              transition-shadow duration-300
            "
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold text-neo-muted uppercase tracking-widest mb-1.5">
          Phone Number <span className="text-neo-accent">*</span>
        </label>
        <div className="relative">
          <Phone
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neo-muted"
            size={16}
          />
          <input
            type="tel"
            name="phone"
            required
            placeholder="+91 99999 99999"
            value={form.phone}
            onChange={handleChange}
            className="
              w-full pl-10 pr-4 py-3 rounded-neo-btn
              neo-inset-sm
              text-neo-fg placeholder:text-neo-placeholder
              text-sm focus:outline-none focus:shadow-neo-focus
              transition-shadow duration-300
            "
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 neo-inset-sm rounded-neo-btn px-4 py-2">
          {error}
        </p>
      )}

      {/* Action row */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* Primary register CTA */}
        <NeumorphicButton
          type="submit"
          size="md"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            "Registering…"
          ) : (
            <>
              Register My Interest
              <ArrowRight size={16} />
            </>
          )}
        </NeumorphicButton>

        {/* Pay & Register — visually distinct, non-functional, outlined style */}
        <div className="relative group flex-1">
          <button
            type="button"
            disabled
            className="
              w-full h-11 px-6 rounded-neo-btn
              neo-surface border-2 border-dashed
              border-neo-accent/40
              text-neo-accent font-semibold text-sm
              flex items-center justify-center gap-2
              opacity-70 cursor-not-allowed
              transition-all duration-300
            "
            style={{
              borderColor: "rgba(156,55,252,0.35)",
            }}
          >
            <CreditCard size={16} />
            Pay &amp; Register
          </button>
          {/* Tooltip hint */}
          <div
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              hidden group-hover:block
              neo-surface rounded-neo-inner px-3 py-1.5
              text-xs text-neo-muted whitespace-nowrap z-20
              pointer-events-none
            "
          >
            Payment coming soon — register your interest now
          </div>
          {/* Touch screens can't hover the tooltip above — show the hint inline. */}
          {IS_TOUCH && (
            <p className="mt-2 text-center text-xs text-neo-muted">
              Payment coming soon — register your interest now
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

/** Expanded detail panel that slides open below a card */
const WebinarDetailPanel = ({
  webinar,
  onClose,
}: {
  webinar: Webinar;
  onClose: () => void;
}) => {
  const isCompleted = webinar.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="overflow-hidden"
    >
      <div className="neo-inset rounded-neo-card p-6 md:p-8 mt-4 space-y-6">
        {/* Speaker section */}
        <div className="flex items-start gap-4">
          <SpeakerAvatar speaker={webinar.speaker} size="lg" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-neo-fg text-lg leading-tight">
              {webinar.speaker.name}
            </h4>
            <p className="text-neo-accent text-sm font-medium mt-0.5">
              {webinar.speaker.designation}
            </p>
            <p className="text-neo-muted text-sm mt-2 leading-relaxed">
              {webinar.speaker.bio}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgb(163 177 198 / 0.4), transparent)",
          }}
        />

        {/* Full description */}
        <div>
          <p className="text-xs font-semibold text-neo-muted uppercase tracking-widest mb-2">
            About This Webinar
          </p>
          <p className="text-neo-fg text-sm leading-relaxed">
            {webinar.description}
          </p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <Calendar size={15} />,
              label: "Date",
              value: webinar.date,
            },
            {
              icon: <Clock size={15} />,
              label: "Time",
              value: `${webinar.time} ${webinar.timezone}`,
            },
            {
              icon: <Clock size={15} />,
              label: "Duration",
              value: webinar.duration,
            },
            {
              icon: <Video size={15} />,
              label: "Platform",
              value: webinar.platform,
            },
            {
              icon: <BookOpen size={15} />,
              label: "Topic",
              value: webinar.topic,
            },
            {
              icon: <Users size={15} />,
              label: "Audience",
              value: webinar.audience,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 neo-surface-sm rounded-neo-inner p-3"
            >
              <span className="text-neo-accent mt-0.5 flex-shrink-0">{icon}</span>
              <div>
                <p className="text-xs text-neo-muted uppercase tracking-wider font-semibold">
                  {label}
                </p>
                <p className="text-neo-fg text-sm font-medium mt-0.5">{value}</p>
              </div>
            </div>
          ))}
          {webinar.prerequisites && (
            <div className="flex items-start gap-3 neo-surface-sm rounded-neo-inner p-3 sm:col-span-2">
              <span className="text-neo-accent mt-0.5 flex-shrink-0">
                <MapPin size={15} />
              </span>
              <div>
                <p className="text-xs text-neo-muted uppercase tracking-wider font-semibold">
                  Prerequisites
                </p>
                <p className="text-neo-fg text-sm font-medium mt-0.5">
                  {webinar.prerequisites}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgb(163 177 198 / 0.4), transparent)",
          }}
        />

        {/* Registration / Completed state */}
        {isCompleted ? (
          <div className="flex items-center gap-3 neo-inset-sm rounded-neo-btn px-5 py-4">
            <CheckCircle className="text-neo-muted flex-shrink-0" size={20} />
            <div>
              <p className="text-neo-muted font-semibold text-sm">
                This webinar has been completed.
              </p>
              <p className="text-neo-muted text-xs mt-0.5 opacity-70">
                Stay tuned for upcoming sessions.
              </p>
            </div>
          </div>
        ) : (
          <RegistrationForm webinar={webinar} onClose={onClose} />
        )}

        {/* Close */}
        <div className="flex justify-center pt-2">
          <NeumorphicButton variant="ghost" size="sm" onClick={onClose}>
            <ChevronDown size={16} />
            Collapse
          </NeumorphicButton>
        </div>
      </div>
    </motion.div>
  );
};

/** Individual webinar card */
const WebinarCard = ({
  webinar,
  index,
  isSelected,
  onSelect,
}: {
  webinar: Webinar;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const isCompleted = webinar.status === "completed";

  return (
    <div>
      <motion.div
        className={`
          rounded-neo-card overflow-hidden cursor-pointer
          transition-shadow duration-300
          ${isSelected ? "neo-inset" : "neo-surface hover:shadow-neo-lifted"}
        `}
        {...reveal({
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        })}
        onClick={onSelect}
      >
        {/* Accent strip — gradient top bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: isCompleted
              ? "linear-gradient(90deg, #A0AEC0, #CBD5E0)"
              : "linear-gradient(90deg, #9C37FC, #B06FE0)",
          }}
        />

        <div className="p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <StatusBadge status={webinar.status} />
            <div className="flex items-center gap-1.5 text-xs text-neo-muted neo-inset-sm rounded-full px-3 py-1">
              <Monitor size={12} />
              {webinar.platform}
            </div>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-lg leading-snug mb-3 ${
              isCompleted ? "text-neo-muted" : "text-neo-fg"
            }`}
          >
            {webinar.title}
          </h3>

          {/* Speaker row */}
          <div className="flex items-center gap-3 mb-4">
            <SpeakerAvatar speaker={webinar.speaker} size="sm" />
            <div className="min-w-0">
              <p className="text-neo-fg text-sm font-semibold truncate">
                {webinar.speaker.name}
              </p>
              <p className="text-neo-muted text-xs truncate">
                {webinar.speaker.designation}
              </p>
            </div>
          </div>

          {/* Date + time chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="flex items-center gap-1.5 text-xs text-neo-muted neo-inset-sm rounded-full px-3 py-1">
              <Calendar size={12} />
              {webinar.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neo-muted neo-inset-sm rounded-full px-3 py-1">
              <Clock size={12} />
              {webinar.time}
            </span>
          </div>

          {/* Short description excerpt */}
          <p className="text-neo-muted text-sm leading-relaxed line-clamp-2 mb-5">
            {webinar.description}
          </p>

          {/* CTA row */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${
                isCompleted ? "text-neo-muted" : "text-neo-accent"
              }`}
            >
              {isCompleted ? "View Details" : "Learn More & Register"}
            </span>
            <motion.div
              animate={{ rotate: isSelected ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="neo-inset-sm rounded-full w-8 h-8 flex items-center justify-center"
            >
              <ChevronDown
                size={16}
                className={isCompleted ? "text-neo-muted" : "text-neo-accent"}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Slide-down detail panel */}
      <AnimatePresence>
        {isSelected && (
          <WebinarDetailPanel
            webinar={webinar}
            onClose={onSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────── PAGE ─────────────────────────── */

type TabKey = "upcoming" | "past";

const Webinars = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null);

  const upcomingWebinars = webinars.filter(
    (w) => w.status === "upcoming" || w.status === "registration_open"
  );
  const pastWebinars = webinars.filter((w) => w.status === "completed");

  const displayedWebinars =
    activeTab === "upcoming" ? upcomingWebinars : pastWebinars;

  const handleCardSelect = (id: string) => {
    setSelectedWebinarId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-neo-base overflow-x-hidden">
      <SEO
        title="Webinars | The Consistent Academy"
        description="Join live webinars on public speaking, IELTS writing, business English, and more. Learn from expert trainers at The Consistent Academy."
        canonical="/webinars"
      />
      <Navbar />

      <main>
        {/* ── HERO ───────────────────────────────────────────── */}
        <div className="pt-28 pb-4">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <AnimatedText className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-4">
              Live Learning Sessions
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              Expert{" "}
              <span className="text-gradient">Webinars</span>{" "}
             
            </AnimatedHeading>
            <AnimatedText
              className="text-neo-muted text-lg mt-5 leading-relaxed max-w-2xl mx-auto"
              delay={0.2}
            >
              Learn directly from seasoned trainers across communication,
              English proficiency, and professional skills — from the comfort
              of your screen.
            </AnimatedText>
          </div>
        </div>

        {/* ── SAMPLE CONTENT BANNER ──────────────────────────── */}
        <SectionWrapper>
          {/* ── TAB SWITCHER ─────────────────────────────────── */}
          <div className="flex justify-center">
            <div className="neo-inset rounded-full p-1.5 flex gap-1">
              {(["upcoming", "past"] as TabKey[]).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedWebinarId(null);
                  }}
                  className={`
                    relative px-7 py-2.5 rounded-full font-semibold text-sm
                    transition-all duration-300 capitalize
                    focus:outline-none focus-visible:shadow-neo-focus
                    ${
                      activeTab === tab
                        ? "neo-surface text-neo-fg shadow-neo-flat"
                        : "text-neo-muted hover:text-neo-fg"
                    }
                  `}
                  whileTap={{
                    scale: 0.97,
                    transition: { type: "spring", stiffness: 600, damping: 25 },
                  }}
                >
                  {tab === "upcoming" ? (
                    <>
                      Upcoming
                      <span
                        className="
                          ml-2 inline-flex items-center justify-center
                          w-5 h-5 rounded-full text-[10px] font-bold
                          bg-neo-base text-neo-accent neo-inset-sm
                        "
                      >
                        {upcomingWebinars.length}
                      </span>
                    </>
                  ) : (
                    <>
                      Past
                      <span
                        className="
                          ml-2 inline-flex items-center justify-center
                          w-5 h-5 rounded-full text-[10px] font-bold
                          bg-neo-base text-neo-muted neo-inset-sm
                        "
                      >
                        {pastWebinars.length}
                      </span>
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── WEBINAR CARDS GRID ───────────────────────────── */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {displayedWebinars.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full neo-inset mx-auto flex items-center justify-center mb-4">
                      <Video className="text-neo-muted" size={28} />
                    </div>
                    <p className="text-neo-muted text-lg font-medium">
                      No {activeTab === "upcoming" ? "upcoming" : "past"} webinars yet.
                    </p>
                    <p className="text-neo-muted text-sm mt-1 opacity-70">
                      Check back soon!
                    </p>
                  </div>
                ) : (
                  <div
                    className={`
                      grid gap-6
                      ${
                        activeTab === "past"
                          ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto opacity-80"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }
                    `}
                  >
                    {displayedWebinars.map((webinar, i) => (
                      <WebinarCard
                        key={webinar.id}
                        webinar={webinar}
                        index={i}
                        isSelected={selectedWebinarId === webinar.id}
                        onSelect={() => handleCardSelect(webinar.id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </SectionWrapper>

        {/* ── INTEREST CTA STRIP ───────────────────────────────── */}
        <SectionWrapper>
          <NeumorphicCard className="text-center max-w-2xl mx-auto py-12">
            <div className="w-14 h-14 rounded-full neo-inset mx-auto flex items-center justify-center mb-5">
              <Mail className="text-neo-accent" size={24} />
            </div>
            <AnimatedHeading className="text-3xl md:text-4xl mb-3">
              Want to be{" "}
              <span className="text-gradient">notified?</span>
            </AnimatedHeading>
            <AnimatedText
              className="text-neo-muted text-base leading-relaxed mb-6"
              delay={0.1}
            >
              Click on any upcoming webinar card above and register your interest
              — we'll send you joining details directly to your inbox before the
              session starts.
            </AnimatedText>
            <NeumorphicButton
              variant="primary"
              size="md"
              onClick={() => {
                setActiveTab("upcoming");
                window.scrollTo({ top: 300, behavior: "smooth" });
              }}
            >
              Browse Upcoming Webinars
              <ArrowRight size={16} />
            </NeumorphicButton>
          </NeumorphicCard>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
};

export default Webinars;
