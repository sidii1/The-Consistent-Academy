import React from "react";
import CCNavbar from "@/components/club/CCNavbar";
import CCStudentDashboard from "@/components/club/CCStudentDashboard";
import CCPresidentDashboard from "@/components/club/CCPresidentDashboard";
import CCTrainerDashboard from "@/components/club/CCTrainerDashboard";
import type { CCUser } from "@/lib/ccClub";
import { Clock } from "lucide-react";

interface ClubDashboardProps {
  user: CCUser;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ user }) => {
  const isPresident = user.club_role === "President";
  const isTrainer = user.club_role === "Trainer";

  // Trainer approval gate — block unapproved trainers with a friendly waiting screen
  if (isTrainer && user.approvalStatus !== "approved") {
    return (
      <div className="cc-club-scope">
        <CCNavbar user={user} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "16px",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={28} color="hsl(38 80% 55%)" />
          </div>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--cc-text)",
            }}
          >
            Approval Pending
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--cc-text-muted)",
              maxWidth: "380px",
              lineHeight: 1.6,
            }}
          >
            Your Trainer account is awaiting admin approval. You will be able to
            access the Trainer Dashboard once an administrator approves your
            account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-club-scope">
      <CCNavbar user={user} />
      {isTrainer ? (
        <CCTrainerDashboard user={user} />
      ) : isPresident ? (
        <CCPresidentDashboard user={user} />
      ) : (
        <CCStudentDashboard user={user} />
      )}
    </div>
  );
};

export default ClubDashboard;
