import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { IS_TOUCH, reveal } from "@/lib/device";

/**
 * TeamMemberCard
 *
 *   - "spread": long horizontal panel — full-height portrait on one side,
 *               name / title / bio on the other. Used for the Board of Visionaries.
 *   - "flip":   tall card with a CSS 3-D flip — front is portrait + name,
 *               back is a scrollable bio. Used for the Experiential Learning Experts.
 *
 * Same neumorphic material as the rest of the site (bg-neo-base, shadow-neo-*),
 * no extra ornament: structure comes from spacing and type, not decoration.
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

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

const Portrait = ({ member, className }: { member: TeamMember; className?: string }) =>
  member.photo ? (
    <img
      src={member.photo}
      alt={member.name}
      className={cn("w-full h-full object-cover object-[50%_20%]", className)}
      loading="lazy"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-neo-accent">
      {initials(member.name)}
    </div>
  );

/* ─────────────────── long panel (Board of Visionaries) ─────────────────── */

const PanelCard = ({ member, index }: { member: TeamMember; index: number }) => (
  <motion.article
    className={cn(
      "relative bg-neo-base rounded-neo-card overflow-hidden shadow-neo-flat",
      "transition-shadow duration-500 hover:shadow-neo-lifted",
      "flex flex-col md:flex-row md:items-stretch",
    )}
    {...reveal({
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      transition: { duration: 0.6, delay: Math.min(index, 2) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
    })}
    aria-label={`Board member: ${member.name}`}
  >
    {/* Portrait — bleeds to the panel edge, full height */}
    <div className="relative h-72 md:h-auto md:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
      <Portrait member={member} className="absolute inset-0" />
    </div>

    {/* Copy */}
    <div className="flex-1 flex flex-col justify-center gap-4 p-6 sm:p-8 md:px-10 md:py-9">
      <header>
        <h3 className="text-2xl md:text-[1.7rem] font-bold text-neo-fg leading-tight">
          {member.name}
        </h3>
        <p className="mt-1.5 text-sm md:text-base font-medium text-neo-accent">
          {member.designation}
        </p>
      </header>

      <div className="h-px w-12 bg-neo-accent/40" aria-hidden="true" />

      <p className="text-neo-muted leading-relaxed text-sm md:text-[0.95rem] max-w-prose">
        {member.bio ?? member.description}
      </p>

      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start text-sm text-neo-accent hover:text-neo-accent-deep transition-colors"
          aria-label={`${member.name} on LinkedIn`}
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      )}
    </div>
  </motion.article>
);

/* ─────────────────── flip card (Experiential Learning Experts) ─────────────────── */

const FlipCard = ({
  member,
  index,
  footerLabel,
}: {
  member: TeamMember;
  index: number;
  footerLabel?: string;
}) => {
  // Touch devices can't hover — a tap toggles the flip instead.
  const [flipped, setFlipped] = useState(false);
  const face = "absolute inset-0 rounded-neo-card overflow-hidden bg-neo-base [backface-visibility:hidden]";
  const spin = "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]";

  return (
    <motion.div
      className="relative h-[26rem] w-full max-w-[280px] mx-auto"
      style={{ perspective: "1000px" }}
      {...reveal({
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.6, delay: (index % 4) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
      })}
      onClick={
        IS_TOUCH
          ? (e) => {
              const t = e.target as HTMLElement;
              if (t.closest("a") || t.closest("[data-bio-scroll]")) return;
              setFlipped((f) => !f);
            }
          : undefined
      }
      aria-label={`Team member: ${member.name}`}
    >
      <div className="group relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        <div
          className={cn(
            face,
            "shadow-neo-flat",
            spin,
            "group-hover:[transform:rotateY(180deg)]",
            flipped && "[transform:rotateY(180deg)]",
          )}
        >
          <div className="h-[68%] overflow-hidden">
            <Portrait member={member} />
          </div>
          <div className="px-5 pt-4">
            <h3 className="font-bold text-neo-fg text-lg leading-tight">{member.name}</h3>
            <p className="mt-1 text-sm text-neo-accent font-medium">{member.designation}</p>
          </div>
          <RotateCw
            size={14}
            className="absolute bottom-4 right-4 text-neo-muted/60"
            aria-hidden="true"
          />
        </div>

        {/* BACK */}
        <div
          className={cn(
            face,
            "shadow-neo-lifted flex flex-col p-5",
            spin,
            flipped ? "[transform:rotateY(360deg)]" : "[transform:rotateY(180deg)]",
            "group-hover:[transform:rotateY(360deg)]",
          )}
        >
          <h3 className="font-bold text-neo-fg text-lg leading-tight">{member.name}</h3>
          <p className="mt-1 text-sm text-neo-accent font-medium">
            {member.role ?? member.designation}
          </p>

          {/* Scrollable bio. data-lenis-prevent stops the page's smooth-scroll
              from swallowing the wheel; overscroll-contain stops scroll chaining. */}
          <div
            data-bio-scroll
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-neo-inner bg-neo-base shadow-neo-inset-sm p-3 pr-2 [scrollbar-width:thin]"
          >
            <p className="text-neo-muted text-[0.8rem] leading-relaxed">
              {member.description ?? member.bio}
            </p>
          </div>

          {footerLabel && (
            <span className="mt-3 text-[0.65rem] uppercase tracking-widest font-semibold text-neo-accent-light">
              {footerLabel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────── main export ─────────────────────────── */

export const TeamMemberCard = ({
  member,
  variant,
  index,
  footerLabel,
}: TeamMemberCardProps) =>
  variant === "spread" ? (
    <PanelCard member={member} index={index} />
  ) : (
    <FlipCard member={member} index={index} footerLabel={footerLabel} />
  );

export default TeamMemberCard;
