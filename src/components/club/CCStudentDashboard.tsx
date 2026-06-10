import React, { useState, useCallback } from "react";
import { getCCSpeeches, type CCUser, type CCSpeech } from "@/lib/ccClub";
import CCProgressTimeline from "./CCProgressTimeline";
import CCSpeechTracker from "./CCSpeechTracker";
import CCGamificationPanel from "./CCGamificationPanel";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface CCStudentDashboardProps {
  user: CCUser;
}

const CCStudentDashboard: React.FC<CCStudentDashboardProps> = ({ user }) => {
  const [speeches, setSpeeches] = useState<CCSpeech[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSpeeches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCCSpeeches(user.uid);
      setSpeeches(data);
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    loadSpeeches();
  }, [loadSpeeches]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--cc-text-muted)" }}>
        <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
        Loading your dashboard...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
      }}
    >
      {/* Welcome banner */}
      <div
        style={{
          borderRadius: "20px",
          padding: "1.5rem 1.75rem",
          background: "linear-gradient(135deg, hsl(165 40% 14%), hsl(210 15% 13%))",
          border: "1px solid var(--cc-accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              fontWeight: 800,
              color: "var(--cc-text)",
              marginBottom: "4px",
            }}
          >
            Welcome back, <span className="cc-text-gradient">{user.name}</span> 👋
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
            {user.college} · Level {user.current_level} Student
          </p>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            background: "var(--cc-accent-soft)",
            border: "1px solid var(--cc-accent)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--cc-accent-bright)",
              lineHeight: 1,
            }}
          >
            {user.total_points}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--cc-text-muted)", marginTop: "2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Points
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <CCProgressTimeline currentLevel={user.current_level} />

      {/* Main grid: Speech tracker (wider) + Gamification */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <CCSpeechTracker
          uid={user.uid}
          currentLevel={user.current_level}
          speeches={speeches}
          onSpeechSubmitted={loadSpeeches}
        />
        <CCGamificationPanel user={user} />
      </div>
    </div>
  );
};

export default CCStudentDashboard;
