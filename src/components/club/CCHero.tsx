import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic2, Award, Users, TrendingUp, ChevronDown, Star } from "lucide-react";

interface CCHeroProps {
  onScrollToAuth: () => void;
}

const stats = [
  { icon: Mic2, value: "16", label: "Speeches" },
  { icon: Award, value: "4", label: "Certifications" },
  { icon: Users, value: "4", label: "Levels" },
  { icon: TrendingUp, value: "100%", label: "Placement Ready" },
];

const CCHero: React.FC<CCHeroProps> = ({ onScrollToAuth }) => {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "5rem 1.5rem 4rem",
        background: "var(--cc-bg)",
      }}
    >
        {/* Animated background orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Amethyst orb — top left */}
        <div
          ref={orb1Ref}
          className="cc-animate-shimmer"
          style={{
            position: "absolute",
            top: "-10%",
            left: "15%",
            width: "55vw",
            height: "55vw",
            maxWidth: "600px",
            maxHeight: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
            transition: "transform 0.1s ease-out",
          }}
        />
        {/* Bright Lavender orb — bottom right */}
        <div
          ref={orb2Ref}
          className="cc-animate-shimmer"
          style={{
            position: "absolute",
            bottom: "5%",
            right: "10%",
            width: "40vw",
            height: "40vw",
            maxWidth: "450px",
            maxHeight: "450px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
            animationDelay: "-4s",
            transition: "transform 0.1s ease-out",
          }}
        />
        {/* Grid overlay — purple tint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "820px",
          width: "100%",
          textAlign: "center",
        }}
      >


        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "1rem",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="cc-text-gradient">Consistent</span>
                <br />
                <span style={{ color: "var(--cc-text)" }}>Communicators </ span>
                <span style={{ color: "var(--cc-text)" }}>Club</ span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--cc-text-muted)",
            lineHeight: 1.7,
            maxWidth: "580px",
            margin: "0 auto 2.5rem",
          }}
        >
          A systematic transformation process that equips students with{" "}
          <span style={{ color: "var(--cc-accent-bright)", fontWeight: 600 }}>
            lifelong communication skills
          </span>{" "}
          — from foundational fluency to placement-ready mastery.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="cc-surface"
              style={{
                borderRadius: "16px",
                padding: "16px 22px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "130px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--cc-bg)",
                  boxShadow: "var(--cc-neu-inset-deep)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color="var(--cc-accent-bright)" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "var(--cc-text)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--cc-text-muted)",
                    fontWeight: 500,
                    marginTop: "2px",
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}
        >
          <button
            onClick={onScrollToAuth}
            className="cc-btn-primary"
            style={{
              padding: "14px 32px",
              borderRadius: "14px",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
          >
            Join the Club →
          </button>
          <button
            onClick={onScrollToAuth}
            className="cc-btn-ghost"
            style={{
              padding: "14px 32px",
              borderRadius: "14px",
              fontSize: "1rem",
            }}
          >
            Sign In
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={onScrollToAuth}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--cc-text-faint)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Sign in / Join
        </span>
        <ChevronDown size={20} />
      </motion.button>
    </section>
  );
};

export default CCHero;
