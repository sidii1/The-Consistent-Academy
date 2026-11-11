import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Mic2, Users, Trophy } from "lucide-react";

/**
 * CC Club landing: "Consistent Communicator's Path" illustration, the weekly
 * offline meeting, and the five levels of development.
 * Styled with the club's warm-clay neumorphic tokens (see DESIGN.md Part II).
 */

const LEVELS = [
  {
    n: 1,
    name: "Base Camp",
    subtitle: "Foundation of Confident Speaking",
    body: "Develop the confidence to speak, express thoughts, and participate in conversations. Learners work on basic fluency, vocabulary, pronunciation, sentence formation, and overcoming hesitation.",
    milestone: "I can speak.",
    color: "hsl(55 55% 55%)",
  },
  {
    n: 2,
    name: "The Ascent",
    subtitle: "Clarity, Fluency & Effective Communication",
    body: "Move beyond speaking to communicating with clarity and purpose. Learners develop structured expression, active listening, conversational skills, and the ability to communicate effectively in everyday and formal situations.",
    milestone: "I can communicate clearly and effectively.",
    color: "hsl(30 80% 60%)",
  },
  {
    n: 3,
    name: "High Camp",
    subtitle: "Persuasion, Argumentation & Performance",
    body: "Develop the ability to present convincing arguments, defend opinions, participate in debates, and respond confidently under pressure. Learners strengthen critical thinking, persuasive language, and spontaneous speaking.",
    milestone: "I can persuade, argue, and perform under pressure.",
    color: "hsl(12 65% 58%)",
  },
  {
    n: 4,
    name: "The Summit",
    subtitle: "Leadership Communication & Influence",
    body: "Master the art of inspiring and influencing audiences. Learners develop advanced public speaking, storytelling, presentation skills, audience engagement, and leadership presence.",
    milestone: "I can inspire, lead, and influence audiences.",
    color: "hsl(340 38% 58%)",
  },
  {
    n: 5,
    name: "Beyond the Summit",
    subtitle: "Communication Excellence & Mentorship",
    body: "Achieve an exceptional level of communication competence through advanced speaking opportunities, competitive platforms, mentoring, and leadership roles. Learners become role models who guide others and represent the Consistent Communicators Club.",
    milestone: "I can compete at an exceptional level, mentor others, and represent the CC Club.",
    color: "hsl(285 30% 60%)",
  },
];

const MEETING_PARTS = [
  { icon: <Mic2 size={16} />, title: "Prepared Speeches", text: "2-minute speeches by students." },
  { icon: <Users size={16} />, title: "Speaking Activities", text: "Group discussions, role plays, extempore and games." },
  { icon: <Trophy size={16} />, title: "Competitions", text: "Inter-departmental / inter-college speech competitions." },
];

const CCJourney: React.FC = () => (
  <section style={{ padding: "72px 20px", maxWidth: 1100, margin: "0 auto" }}>
    {/* Heading */}
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <span style={{ color: "var(--cc-accent-bright)", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
        The Journey
      </span>
      <h2 style={{ color: "var(--cc-text)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, margin: "8px 0 0" }}>
        The Consistent Communicator&apos;s Path
      </h2>
      <p style={{ color: "var(--cc-text-muted)", maxWidth: 620, margin: "12px auto 0", fontSize: "0.95rem" }}>
        Five levels, from your first spoken sentence to mentoring others at the summit.
      </p>
    </div>

    {/* Path illustration — dark line-art, so it sits on a light "paper" well */}
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        background: "#F1E6D8",
        borderRadius: 28,
        padding: "20px",
        boxShadow: "var(--cc-neu-lg)",
        marginBottom: 48,
      }}
    >
      <img
        src="/consistent%20communicator's%20path.png"
        alt="Consistent Communicator's Path: Base Camp, The Ascent, High Camp, The Summit and Beyond the Summit"
        style={{ width: "100%", maxWidth: 760, display: "block", margin: "0 auto", height: "auto" }}
        loading="lazy"
      />
    </motion.div>

    {/* Weekly offline meeting */}
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ background: "var(--cc-surface-raised)", borderRadius: 24, padding: "28px", boxShadow: "var(--cc-neu-md)", marginBottom: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
        <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--cc-surface-inset)", boxShadow: "var(--cc-neu-inset-sm)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--cc-accent-bright)" }}>
          <CalendarCheck size={20} />
        </span>
        <div>
          <h3 style={{ color: "var(--cc-text)", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>One Offline Meeting Every Week</h3>
          <p style={{ color: "var(--cc-text-muted)", fontSize: "0.85rem", margin: "2px 0 0" }}>
            An in-person club meeting on campus, once a week, every week.
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {MEETING_PARTS.map((m) => (
          <div key={m.title} style={{ background: "var(--cc-surface-inset)", boxShadow: "var(--cc-neu-inset-sm)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--cc-accent-bright)", fontWeight: 700, fontSize: "0.9rem" }}>
              {m.icon} {m.title}
            </div>
            <p style={{ color: "var(--cc-text-muted)", fontSize: "0.8rem", margin: "6px 0 0" }}>{m.text}</p>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Five levels */}
    <h3 style={{ color: "var(--cc-text)", fontSize: "1.4rem", fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
      Five Levels of Development
    </h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
      {LEVELS.map((l, i) => (
        <motion.div
          key={l.n}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          style={{ background: "var(--cc-surface-raised)", borderRadius: 22, padding: "22px 22px 20px", boxShadow: "var(--cc-neu-md)", borderTop: `3px solid ${l.color}` }}
        >
          <div style={{ color: l.color, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Level {l.n}
          </div>
          <h4 style={{ color: "var(--cc-text)", fontSize: "1.15rem", fontWeight: 800, margin: "4px 0 2px", textTransform: "uppercase" }}>{l.name}</h4>
          <div style={{ color: "var(--cc-accent-bright)", fontSize: "0.82rem", fontWeight: 600, marginBottom: 10 }}>{l.subtitle}</div>
          <p style={{ color: "var(--cc-text-muted)", fontSize: "0.85rem", lineHeight: 1.55, margin: "0 0 14px" }}>{l.body}</p>
          <div style={{ background: "var(--cc-surface-inset)", boxShadow: "var(--cc-neu-inset-sm)", borderRadius: 12, padding: "9px 12px", color: "var(--cc-text)", fontSize: "0.82rem", fontWeight: 600 }}>
            <span style={{ color: l.color }}>Milestone: </span>
            {l.milestone}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CCJourney;
