import React, { useEffect, useRef, useState } from "react";
import { Trophy, Star, Zap, Shield } from "lucide-react";
import type { CCUser } from "@/lib/ccClub";
import { LEVEL_NAMES, ROLE_POINTS } from "@/lib/ccClub";

interface CCGamificationPanelProps {
  user: CCUser;
}

const LEVEL_BADGES = [
  { level: 1, label: "Foundation", color: "var(--cc-accent)", bg: "var(--cc-surface-deep)", icon: "🌱" },
  { level: 2, label: "Developer",  color: "hsl(165 55% 48%)", bg: "var(--cc-surface-deep)", icon: "🌿" },
  { level: 3, label: "Advanced",   color: "var(--cc-amber)", bg: "var(--cc-surface-deep)", icon: "🔥" },
  { level: 4, label: "Master",     color: "hsl(38 88% 65%)", bg: "var(--cc-surface-deep)", icon: "⭐" },
];

const ROLE_BADGE_META: Record<string, { icon: string; color: string; bg: string }> = {
  President:       { icon: "👑", color: "var(--cc-amber)", bg: "var(--cc-surface-deep)" },
  "Vice President":{ icon: "🥈", color: "hsl(200 70% 55%)", bg: "var(--cc-surface-deep)" },
  "Team Leader":   { icon: "⚡", color: "var(--cc-accent-bright)", bg: "var(--cc-surface-deep)" },
  "Event Team":    { icon: "🎉", color: "hsl(280 60% 65%)", bg: "var(--cc-surface-deep)" },
  Student:         { icon: "📚", color: "var(--cc-text-muted)", bg: "var(--cc-surface-deep)" },
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

  const earnedLevelBadges = LEVEL_BADGES.filter((b) => b.level < user.current_level);

  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  return (
    <>
      <style>
        {`
          @keyframes floatBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .cc-floating-badge {
            animation: floatBob 3s ease-in-out infinite;
          }
        `}
      </style>
      <div
        style={{
          position: "fixed",
          top: "45%",
          right: 0,
          transform: "translateY(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "1.5rem",
        }}
      >
        {/* Semi-circle for Points */}
        <div
          style={{
            width: "160px",
            height: "320px",
            background: "var(--cc-surface-inset)",
            boxShadow: "var(--cc-neu-lg), -8px 0 20px rgba(0,0,0,0.15)",
            borderTopLeftRadius: "160px",
            borderBottomLeftRadius: "160px",
            borderRight: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "10px",
          }}
        >
          <Trophy size={30} color="var(--cc-amber)" style={{ marginBottom: "12px" }} />
          <div
            style={{
              fontSize: "3.2rem",
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
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginTop: "8px",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            Total<br />Points
          </div>
        </div>

        {/* Floating Badges */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-end", paddingRight: "15px" }}>
          
          {/* Role Badge */}
          <div
            className="cc-floating-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px 10px 14px",
              borderRadius: "999px",
              background: roleBadge.bg,
              boxShadow: "var(--cc-neu-md), 0 4px 12px rgba(0,0,0,0.1)",
              animationDelay: "0s",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{roleBadge.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: roleBadge.color, lineHeight: 1.2 }}>
                {user.club_role}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--cc-text-faint)", marginTop: "1px" }}>
                Role Badge {rolePts > 0 && `(+${rolePts}/wk)`}
              </div>
            </div>
          </div>

          {/* Current Level Badge */}
          <div
            className="cc-floating-badge"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px 10px 14px",
              borderRadius: "999px",
              background: "var(--cc-surface-deep)",
              boxShadow: "var(--cc-neu-md), inset 0 0 10px rgba(139,127,255,0.05)",
              animationDelay: "0.6s",
            }}
          >
            <div style={{ width: "24px", display: "flex", justifyContent: "center" }}>
              <Zap size={20} color="var(--cc-accent-bright)" fill="var(--cc-accent-bright)" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cc-accent-bright)", lineHeight: 1.2 }}>
                Level {user.current_level}
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--cc-text-faint)", marginTop: "1px" }}>
                In Progress
              </div>
            </div>
          </div>

          {/* Completed Level Badges */}
          {earnedLevelBadges.map((b, i) => (
            <div
              key={b.level}
              className="cc-floating-badge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 18px 10px 14px",
                borderRadius: "999px",
                background: b.bg,
                boxShadow: "var(--cc-neu-md), 0 4px 12px rgba(0,0,0,0.1)",
                animationDelay: `${1.2 + i * 0.6}s`,
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>{b.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: b.color, lineHeight: 1.2 }}>
                  Level {b.level}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--cc-success)", marginTop: "1px" }}>
                  Completed ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CCGamificationPanel;

