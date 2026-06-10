import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { LogOut, Mic2 } from "lucide-react";
import type { CCUser } from "@/lib/ccClub";

interface CCNavbarProps {
  user: CCUser;
}

const ROLE_CHIP_COLORS: Record<string, string> = {
  President:       "background: var(--cc-amber-soft); color: var(--cc-amber);",
  "Vice President":"background: var(--cc-amber-soft); color: var(--cc-amber);",
  "Team Leader":   "background: var(--cc-accent-soft); color: var(--cc-accent-bright);",
  "Event Team":    "background: var(--cc-accent-soft); color: var(--cc-accent-bright);",
  "Trainer Buddy": "background: var(--cc-accent-soft); color: var(--cc-accent-bright);",
  Student:         "background: hsl(210 15% 20%); color: var(--cc-text-muted);",
};

const CCNavbar: React.FC<CCNavbarProps> = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, hsl(210 18% 8%), hsl(210 15% 11%))",
        borderBottom: "1px solid var(--cc-border)",
        boxShadow: "0 2px 12px hsl(210 22% 4%)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "var(--cc-grad-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--cc-glow-teal)",
            }}
          >
            <Mic2 size={18} color="hsl(210 18% 8%)" strokeWidth={2.5} />
          </div>
          <div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
                color: "var(--cc-text)",
              }}
            >
              CC Club
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.65rem",
                color: "var(--cc-text-faint)",
                letterSpacing: "0.04em",
                marginTop: "-2px",
              }}
            >
              {user.college} · iFEEL Campus
            </span>
          </div>
        </div>

        {/* Right: User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--cc-text)",
              }}
            >
              {user.name}
            </span>
            <span
              className="cc-chip"
              style={{
                ...(ROLE_CHIP_COLORS[user.club_role]
                  ? Object.fromEntries(
                      ROLE_CHIP_COLORS[user.club_role]
                        .split(";")
                        .filter(Boolean)
                        .map((s) => s.split(":").map((x) => x.trim()) as [string, string])
                    )
                  : {}),
                fontSize: "0.62rem",
                padding: "2px 8px",
              }}
            >
              {user.club_role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: "hsl(210 15% 18%)",
              border: "1px solid var(--cc-border)",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              color: "var(--cc-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 200ms, background 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--cc-danger)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--cc-danger-soft)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--cc-text-muted)";
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(210 15% 18%)";
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CCNavbar;
