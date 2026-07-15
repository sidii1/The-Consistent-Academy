import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic2, Award, Users, TrendingUp, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface CCHeroProps {
  onScrollToAuth: () => void;
}

/* ── Stat card for the hero ── */
const StatPill: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}> = ({ icon, value, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 20px",
      borderRadius: "14px",
      background: "var(--cc-surface-inset)",
      boxShadow: "var(--cc-neu-inset-sm)",
      flex: "1 1 120px",
      minWidth: "110px",
    }}
  >
    <span style={{ color, flexShrink: 0 }}>{icon}</span>
    <div>
      <div
        className="cc-animate-count"
        style={{ fontSize: "1.2rem", fontWeight: 800, color, lineHeight: 1 }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.65rem", color: "var(--cc-text-faint)", marginTop: "2px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  </motion.div>
);


const CCHero: React.FC<CCHeroProps> = ({ onScrollToAuth }) => {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

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
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${x * 0.25}px, ${-y * 0.25}px)`;
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
      {/* ── Back to main site ── */}
      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          left: "1.5rem",
          zIndex: 10,
        }}
      >
        <Link to="/">
          <button className="cc-btn-back" type="button">
            <ArrowLeft size={13} />
            Back to TCA
          </button>
        </Link>
      </div>

      {/* ── Animated background orbs ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Primary purple orb — top left, large & visible */}
        <div
          ref={orb1Ref}
          className="cc-animate-shimmer"
          style={{
            position: "absolute",
            top: "-8%",
            left: "10%",
            width: "60vw",
            height: "60vw",
            maxWidth: "660px",
            maxHeight: "660px",
            borderRadius: "50%",
            background: "var(--cc-orb-purple)",
            transition: "transform 0.1s ease-out",
          }}
        />
        {/* Amber/gold orb — bottom right, warm visual contrast */}
        <div
          ref={orb2Ref}
          className="cc-animate-shimmer-amber"
          style={{
            position: "absolute",
            bottom: "0%",
            right: "5%",
            width: "45vw",
            height: "45vw",
            maxWidth: "500px",
            maxHeight: "500px",
            borderRadius: "50%",
            background: "var(--cc-orb-amber)",
            animationDelay: "-4s",
            transition: "transform 0.1s ease-out",
          }}
        />
        {/* Teal orb — top right, tertiary depth */}
        <div
          ref={orb3Ref}
          className="cc-animate-shimmer"
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: "25vw",
            height: "25vw",
            maxWidth: "280px",
            maxHeight: "280px",
            borderRadius: "50%",
            background: "var(--cc-orb-teal)",
            animationDelay: "-7s",
            transition: "transform 0.1s ease-out",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(139,127,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,127,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial vignette to push orbs inward */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 30%, var(--cc-bg) 80%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "820px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Badge label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "var(--cc-surface-inset)",
            boxShadow: "var(--cc-neu-inset-xs), var(--cc-glow-purple-sm)",
            marginBottom: "1.5rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--cc-accent-vivid)",
          }}
        >
          <Sparkles size={12} />
          College Public Speaking Club
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div
            style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              marginBottom: "1rem",
            }}
          >
            <span className="cc-text-gradient">Consistent</span>
            <br />
            <span style={{ color: "var(--cc-text)" }}>Communicators </span>
            <span style={{ color: "var(--cc-text)" }}>Club</span>
          </div>
        </motion.div>

        {/* Shimmer underline accent */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "2px",
            width: "180px",
            margin: "0 auto 1.5rem",
            borderRadius: "999px",
            background: "linear-gradient(90deg, transparent, var(--cc-accent), var(--cc-amber), var(--cc-accent), transparent)",
            transformOrigin: "center",
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            color: "var(--cc-text-muted)",
            lineHeight: 1.75,
            maxWidth: "560px",
            margin: "0 auto 2rem",
          }}
        >
          A systematic transformation process that equips students with{" "}
          <span style={{ color: "var(--cc-accent-bright)", fontWeight: 600 }}>
            lifelong communication skills
          </span>{" "}
          — from foundational fluency to placement-ready mastery.
        </motion.p>



        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="cc-hero-cta"
          style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}
        >
          <button
            onClick={onScrollToAuth}
            className="cc-btn-primary"
            style={{
              padding: "14px 36px",
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
              padding: "14px 36px",
              borderRadius: "14px",
              fontSize: "1rem",
            }}
          >
            Sign In
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CCHero;
