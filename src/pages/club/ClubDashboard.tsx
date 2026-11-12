import React from "react";
import CCNavbar from "@/components/club/CCNavbar";
import CCStudentDashboard from "@/components/club/CCStudentDashboard";
import CCPresidentDashboard from "@/components/club/CCPresidentDashboard";
import CCTrainerDashboard from "@/components/club/CCTrainerDashboard";
import { APPROVAL_REQUIRED_ROLES, type CCUser } from "@/lib/ccClub";
import { Clock } from "lucide-react";

interface ClubDashboardProps {
  user: CCUser;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ user }) => {
  const isPresident = user.club_role === "President";
  const isTrainer = user.club_role === "Trainer";

  // Approval gate. Trainers must be explicitly approved; other privileged roles
  // (President) are blocked while they are flagged "pending". Legacy accounts
  // created before the gate existed have no flag and keep working.
  const awaitingApproval =
    user.approvalStatus === "pending" ||
    (isTrainer && user.approvalStatus !== "approved");

  if (APPROVAL_REQUIRED_ROLES.includes(user.club_role) && awaitingApproval) {
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
            className="cc-animate-glow-amber"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--cc-bg)",
              boxShadow: "var(--cc-neu-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={30} color="var(--cc-amber)" />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--cc-text)" }}>
            Approval Pending
          </h2>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--cc-text-muted)",
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            Your {user.club_role} account is awaiting admin approval. You'll be able to open the{" "}
            {user.club_role} Dashboard once an administrator approves it — check back soon.
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
