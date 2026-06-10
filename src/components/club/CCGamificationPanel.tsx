import React, { useEffect, useRef, useState } from "react";
import { Trophy, Star, Zap, Shield, Award } from "lucide-react";
import type { CCUser } from "@/lib/ccClub";
import { LEVEL_NAMES, ROLE_POINTS } from "@/lib/ccClub";

interface CCGamificationPanelProps {
  user: CCUser;
}

const LEVEL_BADGES = [
  { level: 1, label: "Foundation", color: "var(--cc-accent)", bg: "var(--cc-accent-soft)", icon: "🌱" },
  { level: 2, label: "Developer",  color: "hsl(165 55% 48%)", bg: "hsl(165 30% 16%)", icon: "🌿" },
  { level: 3, label: "Advanced",   color: "var(--cc-amber)", bg: "var(--cc-amber-soft)", icon: "🔥" },
  { level: 4, label: "Master",     color: "hsl(38 88% 65%)", bg: "hsl(38 50% 16%)", icon: "⭐" },
];

const ROLE_BADGE_META: Record<string, { icon: string; color: string; bg: string }> = {
  President:       { icon: "👑", color: "var(--cc-amber)", bg: "var(--cc-amber-soft)" },
  "Vice President":{ icon: "🥈", color: "hsl(200 70% 55%)", bg: "hsl(200 50% 18%)" },
  "Team Leader":   { icon: "⚡", color: "var(--cc-accent-bright)", bg: "var(--cc-accent-soft)" },
  "Event Team":    { icon: "🎉", color: "hsl(280 60% 65%)", bg: "hsl(280 40% 18%)" },
  "Trainer Buddy": { icon: "🧑‍🏫", color: "var(--cc-accent)", bg: "var(--cc-accent-soft)" },
  Student:         { icon: "📚", color: "var(--cc-text-muted)", bg: "hsl(210 15% 20%)" },
};

// Animated counter hook
const useAnimatedCount = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return count;
};

const CCGamificationPanel: React.FC<CCGamificationPanelProps> = ({ user }) => {
  const animatedScore = useAnimatedCount(user.total_points);
  const rolePts = ROLE_POINTS[user.club_role] ?? 0;
  const roleBadge = ROLE_BADGE_META[user.club_role] ?? ROLE_BADGE_META.Student;

  // Determine which level badges are earned (all levels up to and including current)
  const earnedLevelBadges = LEVEL_BADGES.filter((b) => b.level < user.current_level);

  return (
    <div
      className="cc-surface"
      style={{ borderRadius: "20px", padding: "1.75rem", border: "1px solid var(--cc-border)" }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--cc-text)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <Trophy size={16} color="var(--cc-amber)" />
        Achievements & Score
      </h3>

      {/* Score counter */}
      <div
        className="cc-inset"
        style={{
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
          className="cc-text-amber-gradient cc-animate-score"
        >
          {animatedScore}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--cc-text-muted)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginTop: "6px",
          }}
        >
          Total Points
        </div>

        {/* Score breakdown */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "1rem",
          }}
        >
          {[
            { label: "Attendance", icon: "📅", color: "var(--cc-accent-bright)" },
            { label: "Tests",      icon: "📝", color: "hsl(280 60% 65%)" },
            { label: "Speeches",   icon: "🎤", color: "var(--cc-amber)" },
            { label: `Role (+${rolePts})`, icon: "🏅", color: "hsl(38 88% 65%)" },
          ].map(({ label, icon, color }) => (
            <span
              key={label}
              style={{
                fontSize: "0.7rem",
                padding: "4px 10px",
                borderRadius: "999px",
                background: "hsl(210 15% 18%)",
                color,
                fontWeight: 600,
              }}
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {/* Badges section */}
      <div>
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--cc-text-faint)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Earned Badges
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {/* Role badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "12px",
              background: roleBadge.bg,
              border: `1px solid ${roleBadge.color}40`,
            }}
          >
            <span style={{ fontSize: "1rem" }}>{roleBadge.icon}</span>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: roleBadge.color }}>
                {user.club_role}
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--cc-text-faint)" }}>Role Badge</div>
            </div>
          </div>

          {/* Current level (in-progress) badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "12px",
              background: "var(--cc-accent-soft)",
              border: "1px solid var(--cc-accent)",
            }}
          >
            <Zap size={16} color="var(--cc-accent-bright)" fill="var(--cc-accent-bright)" />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--cc-accent-bright)" }}>
                Level {user.current_level} — {LEVEL_NAMES[user.current_level]}
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--cc-text-faint)" }}>In Progress</div>
            </div>
          </div>

          {/* Completed level badges */}
          {earnedLevelBadges.map((b) => (
            <div
              key={b.level}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "12px",
                background: b.bg,
                border: `1px solid ${b.color}50`,
              }}
            >
              <span style={{ fontSize: "1rem" }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: b.color }}>
                  Level {b.level} — {b.label}
                </div>
                <div style={{ fontSize: "0.62rem", color: "var(--cc-text-faint)" }}>Completed ✓</div>
              </div>
            </div>
          ))}

          {earnedLevelBadges.length === 0 && user.current_level === 1 && (
            <div
              style={{
                padding: "8px 14px",
                borderRadius: "12px",
                background: "hsl(210 15% 18%)",
                color: "var(--cc-text-faint)",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Star size={13} />
              Complete Level 1 to earn your first badge!
            </div>
          )}
        </div>
      </div>

      {/* Role points note */}
      {rolePts > 0 && (
        <div
          style={{
            marginTop: "1rem",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "var(--cc-amber-soft)",
            border: "1px solid hsl(38 60% 28%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Shield size={14} color="var(--cc-amber)" />
          <p style={{ fontSize: "0.75rem", color: "var(--cc-amber)" }}>
            As <strong>{user.club_role}</strong>, you earn{" "}
            <strong>{rolePts} leadership points/week</strong> for smooth club execution.
          </p>
        </div>
      )}
    </div>
  );
};

export default CCGamificationPanel;
