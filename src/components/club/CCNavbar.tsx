import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { LogOut, Mic2 } from "lucide-react";
import type { CCUser } from "@/lib/ccClub";

interface CCNavbarProps {
  user: CCUser;
}

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
        background: "var(--cc-bg)",
        boxShadow: "var(--cc-neu-sm)",
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
              background: "var(--cc-bg)",
              boxShadow: "var(--cc-neu-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mic2 size={18} color="var(--cc-accent)" strokeWidth={2.5} />
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
                fontSize: "0.62rem",
                padding: "2px 8px",
                background: "var(--cc-surface-inset)",
                color:
                  user.club_role === "President" || user.club_role === "Vice President"
                    ? "var(--cc-amber)"
                    : user.club_role === "Trainer"
                    ? "hsl(160 60% 50%)"
                    : "var(--cc-accent-bright)",
              }}
            >
              {user.club_role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: "var(--cc-bg)",
              border: "none",
              boxShadow: "var(--cc-neu-sm)",
              borderRadius: "10px",
              padding: "8px",
              cursor: "pointer",
              color: "var(--cc-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 200ms, box-shadow 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--cc-danger)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--cc-neu-inset-sm)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--cc-text-muted)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--cc-neu-sm)";
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
