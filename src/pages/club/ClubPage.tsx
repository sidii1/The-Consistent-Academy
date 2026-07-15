import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCCUser, type CCUser } from "@/lib/ccClub";
import CCHero from "@/components/club/CCHero";
import CCAuthForm from "@/components/club/CCAuthForm";
import ClubDashboard from "./ClubDashboard";
import { Loader2 } from "lucide-react";

type AppState = "loading" | "unauthenticated" | "authenticated";

const ClubPage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("loading");
  const [ccUser, setCcUser] = useState<CCUser | null>(null);
  const authSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setAppState("unauthenticated");
        setCcUser(null);
        return;
      }

      // User is logged in — fetch their CC Club profile
      try {
        const profile = await getCCUser(firebaseUser.uid);
        if (profile) {
          setCcUser(profile);
          setAppState("authenticated");
        } else {
          // Firebase user exists but no CC Club profile — show auth form
          // (they may have a main TCA account but haven't joined CC Club)
          setAppState("unauthenticated");
          setCcUser(null);
        }
      } catch {
        setAppState("unauthenticated");
        setCcUser(null);
      }
    });

    return () => unsub();
  }, []);

  const scrollToAuth = () => {
    authSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Loading ──
  if (appState === "loading") {
    return (
      <div
        className="cc-club-scope"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          color: "var(--cc-text-muted)",
          fontSize: "0.9rem",
          flexDirection: "column",
        }}
      >
        <Loader2
          size={28}
          color="var(--cc-accent)"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span>Loading CC Club…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Authenticated ──
  if (appState === "authenticated" && ccUser) {
    return <ClubDashboard user={ccUser} />;
  }

  // ── Unauthenticated: Hero + Auth Form ──
  return (
    <div className="cc-club-scope">
      <CCHero onScrollToAuth={scrollToAuth} />
      <div ref={authSectionRef}>
        <CCAuthForm />
      </div>
    </div>
  );
};

export default ClubPage;
