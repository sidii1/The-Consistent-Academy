import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Sparkles, Zap } from "lucide-react";
import { LEVEL_NAMES } from "@/lib/ccClub";

interface CCProgressTimelineProps {
  currentLevel: 1 | 2 | 3 | 4;
}

const LEVEL_META = [
  {
    goal: "Remove fear, build basic speaking habit",
    color: "var(--cc-accent)",
    glow: "var(--cc-glow-purple-sm)",
    icon: "🌱",
  },
  {
    goal: "Build structured speaking & confidence",
    color: "hsl(165 55% 48%)",
    glow: "0 0 18px hsl(165 55% 48% / 0.4)",
    icon: "🌿",
  },
  {
    goal: "Develop influence and professional speaking",
    color: "var(--cc-amber)",
    glow: "0 0 20px hsl(38 88% 65% / 0.4)",
    icon: "🔥",
  },
  {
    goal: "Create impactful, real-world communicators",
    color: "hsl(38 88% 65%)",
    glow: "0 0 20px hsl(38 88% 65% / 0.4)",
    icon: "⭐",
  },
];

const CCProgressTimeline: React.FC<CCProgressTimelineProps> = ({ currentLevel }) => {
  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        background: "var(--cc-bg)",
        boxShadow: "var(--cc-neu-md)",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--cc-text)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={16} color="var(--cc-accent-bright)" />
          Your Progress
        </h3>
        <p style={{ fontSize: "0.78rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>
          4 speeches per level · 80% attendance required
        </p>
      </div>

      {/* Desktop: horizontal | Mobile: vertical via flex-wrap */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {[1, 2, 3, 4].map((lvl, idx) => {
          const meta = LEVEL_META[idx];
          const isCompleted = lvl < currentLevel;
          const isCurrent = lvl === currentLevel;
          const isLocked = lvl > currentLevel;

          return (
            <motion.div
              key={lvl}
              className="cc-animate-node"
              style={{ animationDelay: `${idx * 0.08}s`, opacity: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: isCurrent
                    ? "var(--cc-bg)"
                    : "var(--cc-surface-inset)",
                  boxShadow: isCurrent
                    ? `var(--cc-neu-sm), 0 0 18px ${meta.color}28`
                    : "var(--cc-neu-inset-xs)",
                  opacity: isLocked ? 0.55 : 1,
                  transition: "box-shadow 400ms ease, opacity 200ms",
                  border: isCurrent ? `1px solid ${meta.color}22` : "none",
                }}
              >
                {/* Node icon */}
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: isCurrent ? "var(--cc-surface-inset)" : "var(--cc-surface-deep)",
                    boxShadow: isCurrent ? "var(--cc-neu-inset-sm)" : "var(--cc-neu-inset-xs)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} color="var(--cc-success)" />
                  ) : isLocked ? (
                    <Lock size={18} color="var(--cc-text-faint)" />
                  ) : (
                    <span>{meta.icon}</span>
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: isCurrent ? meta.color : isCompleted ? "var(--cc-success)" : "var(--cc-text-faint)",
                      }}
                    >
                      Level {lvl}
                    </span>
                    <span
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "var(--cc-text)",
                      }}
                    >
                      — {LEVEL_NAMES[lvl]}
                    </span>
                    {isCurrent && (
                      <span className="cc-chip" style={{ fontSize: "0.62rem", color: "var(--cc-amber)" }}>
                        <Zap size={9} fill="currentColor" /> Current
                      </span>
                    )}
                    {isCompleted && (
                      <span className="cc-chip cc-chip-done" style={{ fontSize: "0.62rem" }}>
                        ✓ Complete
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--cc-text-muted)",
                      marginTop: "3px",
                    }}
                  >
                    {meta.goal}
                  </p>
                </div>

                {/* Speech count */}
                <div
                  style={{
                    flexShrink: 0,
                    textAlign: "center",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: "var(--cc-surface-deep)",
                    boxShadow: "var(--cc-neu-inset-xs)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: isCompleted
                        ? "var(--cc-success)"
                        : isCurrent
                        ? meta.color
                        : "var(--cc-text-faint)",
                    }}
                  >
                    4
                  </div>
                  <div
                    style={{ fontSize: "0.62rem", color: "var(--cc-text-faint)", lineHeight: 1.2 }}
                  >
                    speeches
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CCProgressTimeline;
