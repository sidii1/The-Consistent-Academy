import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TeamMemberCard
 *
 * A versatile card component that renders in two distinct visual modes:
 *   - "spread":   Magazine-spread layout with alternating portrait left/right,
 *                 deep neumorphic shadow, SVG quote decoration, and LinkedIn badge.
 *   - "flip":     Tall trading-card with CSS 3-D flip on hover — front shows photo
 *                 and name; back reveals the full bio description.
 *
 * Design Rules (from DESIGN.md):
 *   - bg-neo-base (#E0E5EC) — same material plane as the page, no bg-white.
 *   - Shadows only define structure — no borders on neumorphic shells.
 *   - Light source is top-left → shadow-neo-flat (resting), shadow-neo-lifted (hover).
 */

/* ─────────────────────────── types ─────────────────────────── */

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  description?: string;
  photo: string;
  linkedin?: string | null;
  expertiseLink?: string | null;
  expertise?: string;
  role?: string;
  isSample?: boolean;
}

interface TeamMemberCardProps {
  member: TeamMember;
  variant: "spread" | "flip";
  /** Zero-based index used for stagger animation delay */
  index: number;
  /** Spread-only: flip the portrait to the right side */
  isAlternate?: boolean;
  /** Flip-only: small label shown in the footer of the card back */
  footerLabel?: string;
}

/* ─────────────────────────── helpers ─────────────────────────── */

/** Large decorative SVG quote-mark used behind advisory card text */
const QuoteDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute select-none pointer-events-none", className)}
    viewBox="0 0 120 90"
    fill="none"
    aria-hidden="true"
  >
    <text
      x="0"
      y="80"
      fontFamily="Georgia, serif"
      fontSize="120"
      fill="currentColor"
      opacity="0.07"
    >
      "
    </text>
  </svg>
);

/** Subtle wave-line SVG used as a decorative element on advisory cards */
const WaveDecoration = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute select-none pointer-events-none", className)}
    viewBox="0 0 200 30"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M0 15 C30 5, 60 25, 90 15 S150 5, 180 15 S210 25, 240 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.2"
    />
  </svg>
);

/* ─────────────────── ELE card (magazine-spread) ─────────────────── */

const AdvisoryCard = ({
  member,
  index,
  isAlternate,
}: {
  member: TeamMember;
  index: number;
  isAlternate: boolean;
}) => {
  const delay = 0.1 + index * 0.15;

  return (
    <motion.div
      className={cn(
        // Neumorphic shell — raised from the #E0E5EC surface
        "relative bg-neo-base rounded-neo-card overflow-hidden",
        "shadow-neo-flat",
        // Smooth lift on hover
        "transition-all duration-500 ease-out",
        "hover:shadow-neo-lifted hover:-translate-y-1",
        // Two-column layout on desktop, stacked on mobile
        "flex flex-col md:flex-row",
        isAlternate && "md:flex-row-reverse",
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={`Team member: ${member.name}`}
    >
      {/* ── Portrait column ── */}
      <div className="relative flex-shrink-0 md:w-72 flex items-center justify-center p-8 pb-4 md:pb-8">
        {/* Violet gradient ring effect around portrait */}
        <div
          className="relative"
          style={{
            /* Layered box-shadow creates the violet "ring" glow */
            filter: "drop-shadow(0 0 18px rgba(156, 55, 252, 0.28))",
          }}
        >
          {/* Deep neumorphic portrait container */}
          <div
            className="w-44 h-44 md:w-48 md:h-48 rounded-full bg-neo-base shadow-neo-lifted overflow-hidden"
            style={{
              /* Extra violet ring layered via outline-equivalent box-shadow */
              boxShadow:
                "12px 12px 20px rgba(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6), 0 0 0 4px rgba(156,55,252,0.18), 0 0 0 8px rgba(156,55,252,0.08)",
            }}
          >
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neo-accent">
                {member.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
            )}
          </div>

          {/* LinkedIn badge — floated top-right of the portrait */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "absolute top-0 right-0 translate-x-1/4 -translate-y-1/4",
                "w-10 h-10 rounded-full flex items-center justify-center",
                "bg-neo-base shadow-neo-flat-sm",
                "transition-shadow duration-300 hover:shadow-neo-lifted",
                "text-neo-accent hover:text-neo-accent-deep",
              )}
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          )}
        </div>

        {/* Expertise chip — below portrait */}
        {(member.expertise ?? member.role) && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center px-4">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-neo-btn text-xs font-medium",
                "bg-neo-base shadow-neo-inset-sm text-neo-accent",
                "tracking-wide",
              )}
            >
              {member.expertise ?? member.role}
            </span>
          </div>
        )}
      </div>

      {/* ── Content column ── */}
      <div className="relative flex-1 flex flex-col justify-center p-8 pl-6 md:pl-10 overflow-hidden">
        {/* Large decorative quote mark in background */}
        <QuoteDecoration className="text-neo-accent top-0 -left-4 w-32 h-24 opacity-80" />

        {/* Wave line decoration */}
        <WaveDecoration
          className={cn(
            "text-neo-accent bottom-6 w-48 h-8",
            isAlternate ? "left-6" : "right-6",
          )}
        />

        {/* Vertical accent stripe along the inside edge */}
        <div
          className={cn(
            "absolute top-8 bottom-8 w-1 rounded-full",
            "bg-gradient-to-b from-[#9C37FC] via-[#B06FE0] to-transparent",
            isAlternate ? "right-6" : "left-6",
          )}
        />

        <div className={cn("relative z-10", isAlternate ? "pr-10" : "pl-10")}>
          {/* Name */}
          <h3 className="text-xl md:text-2xl font-bold text-neo-fg mb-1 leading-tight">
            {member.name}
          </h3>

          {/* Designation */}
          <p className="text-sm font-semibold text-neo-accent mb-4 tracking-wide">
            {member.designation}
          </p>

          {/* Bio */}
          <p className="text-neo-muted leading-relaxed text-sm md:text-base">
            {member.bio ?? member.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────── Advisory board trading-card (flip effect) ─────────────────── */

const FlipCard = ({
  member,
  index,
  footerLabel,
}: {
  member: TeamMember;
  index: number;
  footerLabel?: string;
}) => {
  const delay = 0.1 + index * 0.12;

  return (
    <motion.div
      className="relative h-96 w-full max-w-[260px] mx-auto"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-label={`Team member: ${member.name}`}
    >
      {/*
       * Inner flip wrapper — CSS 3-D transform-style: preserve-3d.
       * On hover this element rotates 180° around the Y axis, revealing the back face.
       */}
      <div
        className={cn(
          "relative w-full h-full",
          // Smooth spring-like transition driven by CSS for best performance
          "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
          // The group class lets children react to the hover state
          "group",
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className={cn(
            "absolute inset-0 rounded-neo-card overflow-hidden",
            "bg-neo-base shadow-neo-flat",
            // The front face starts visible (backface hidden to avoid bleed-through)
            "[backface-visibility:hidden]",
            // On group hover → rotate card to show back
            "group-hover:[transform:rotateY(180deg)]",
            "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
          )}
        >
          {/* Left vertical accent stripe */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-neo-card"
            style={{
              background: "linear-gradient(180deg, #9C37FC 0%, #B06FE0 60%, transparent 100%)",
            }}
          />

          {/* Portrait — fills top 60% */}
          <div className="relative h-[60%] overflow-hidden bg-neo-base shadow-neo-inset-sm">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-neo-accent">
                {member.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
            )}
            {/* Subtle gradient overlay at bottom of portrait */}
            <div
              className="absolute bottom-0 inset-x-0 h-10"
              style={{
                background: "linear-gradient(to bottom, transparent, #E0E5EC)",
              }}
            />
          </div>

          {/* Card body */}
          <div className="px-5 pt-4 pb-5 pl-7">
            <h3 className="font-bold text-neo-fg text-base leading-tight mb-1">
              {member.name}
            </h3>
            <p className="text-xs text-neo-accent font-semibold tracking-wide mb-3">
              {member.designation}
            </p>

            {/* Role chip */}
            {(member.role ?? member.expertise) && (
              <span
                className={cn(
                  "inline-block text-[0.65rem] font-medium px-2.5 py-1",
                  "rounded-neo-btn bg-neo-base shadow-neo-inset-sm",
                  "text-neo-muted tracking-wide leading-none",
                )}
              >
                {member.role ?? member.expertise}
              </span>
            )}
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-3 right-4 text-[0.6rem] text-neo-muted opacity-60 select-none">
            hover to learn more →
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className={cn(
            "absolute inset-0 rounded-neo-card overflow-hidden",
            "bg-neo-base shadow-neo-lifted",
            // Back face starts rotated 180° (invisible), flips to visible on hover
            "[transform:rotateY(180deg)]",
            "[backface-visibility:hidden]",
            "group-hover:[transform:rotateY(360deg)]",
            "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
            "flex flex-col",
          )}
        >
          {/* Top accent bar */}
          <div
            className="h-2 flex-shrink-0"
            style={{
              background: "linear-gradient(90deg, #9C37FC 0%, #B06FE0 60%, #C29CE4 100%)",
            }}
          />

          {/* Back content */}
          <div className="flex-1 flex flex-col justify-between p-6">
            <div>
              {/* Name on back */}
              <h3 className="font-bold text-neo-fg text-base mb-0.5">{member.name}</h3>
              <p className="text-xs text-neo-accent font-semibold tracking-wide mb-4">
                {member.role ?? member.expertise}
              </p>

              {/* Inset bio area — carved into the surface */}
              <div className="bg-neo-base shadow-neo-inset-sm rounded-neo-inner p-3">
                <p className="text-neo-muted text-xs leading-relaxed">
                  {member.description ?? member.bio}
                </p>
              </div>
            </div>

            {/* Back footer */}
            <div className="flex items-center justify-between mt-4">
              <span
                className={cn(
                  "text-[0.6rem] uppercase tracking-widest font-semibold",
                  "text-neo-accent-light",
                )}
              >
                {footerLabel}
              </span>
              {member.expertiseLink && (
                <a
                  href={member.expertiseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neo-accent text-xs hover:text-neo-accent-deep transition-colors"
                >
                  Learn more →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────── main export ─────────────────────────── */

/**
 * TeamMemberCard — renders either a magazine-spread card or a flip-card
 * depending on the `variant` prop.
 */
export const TeamMemberCard = ({
  member,
  variant,
  index,
  isAlternate = false,
  footerLabel,
}: TeamMemberCardProps) => {
  if (variant === "spread") {
    return (
      <AdvisoryCard member={member} index={index} isAlternate={isAlternate} />
    );
  }
  return <FlipCard member={member} index={index} footerLabel={footerLabel} />;
};

export default TeamMemberCard;
