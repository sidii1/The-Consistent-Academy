import React from "react";
import CCNavbar from "@/components/club/CCNavbar";
import CCStudentDashboard from "@/components/club/CCStudentDashboard";
import CCPresidentDashboard from "@/components/club/CCPresidentDashboard";
import type { CCUser } from "@/lib/ccClub";

interface ClubDashboardProps {
  user: CCUser;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ user }) => {
  const isPresident = user.club_role === "President";

  return (
    <div className="cc-club-scope">
      <CCNavbar user={user} />
      {isPresident ? (
        <CCPresidentDashboard user={user} />
      ) : (
        <CCStudentDashboard user={user} />
      )}
    </div>
  );
};

export default ClubDashboard;
