import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileSearch,
  ArrowRight,
  X,
  RefreshCw,
  Download,
  Printer,
  Building2,
  ChevronDown,
  LayoutList,
  Mic2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Navbar } from "@/components/layout/Navbar";
import {
  getAllCCUsers,
  getCCSpeeches,
  evaluateCCSpeech,
  updateCCUser,
  deleteCCUser,
  type CCUser,
  type CCSpeech,
  type CCRole,
} from "@/lib/ccClub";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type RegularTab = "contactRequests" | "careerApplications" | "leadershipTestResults" | "testResults";
type CollectionName = RegularTab | "cc_club";

interface FirestoreRecord {
  id: string;
  [key: string]: any;
}

const TABS: { id: CollectionName; label: string }[] = [
  { id: "contactRequests", label: "Contact Requests" },
  { id: "careerApplications", label: "Career Applications" },
  { id: "leadershipTestResults", label: "Leadership Test" },
  { id: "testResults", label: "Other Tests" },
  { id: "cc_club", label: "🌿 CC Club Admin" },
];

const REGULAR_TABS: RegularTab[] = [
  "contactRequests",
  "careerApplications",
  "leadershipTestResults",
  "testResults",
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const deriveLevel = (item: FirestoreRecord): string => {
  if (item.level) return item.level;
  const pct =
    item.percentage ??
    (item.score && item.totalQuestions
      ? Math.round((item.score / item.totalQuestions) * 100)
      : null);
  if (pct === null) return "N/A";
  if (pct >= 75) return "Advanced";
  if (pct >= 45) return "Intermediate";
  return "Basic";
};

const levelColor = (level: string) => {
  if (level === "Advanced") return "#16a34a";
  if (level === "Intermediate") return "#d97706";
  return "#dc2626";
};

// ─────────────────────────────────────────────────────────────
// CC CLUB ADMIN PANEL
// ─────────────────────────────────────────────────────────────

const SpeechStatusChip: React.FC<{ status: CCSpeech["status"] }> = ({ status }) => {
  const map: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    "Not Started":    { color: "#6b7280", bg: "#1f2937", icon: <Clock size={11} /> },
    "Pending Review": { color: "#38bdf8", bg: "#0c2a3e", icon: <Clock size={11} /> },
    "Well Done":      { color: "#34d399", bg: "#052e20", icon: <CheckCircle2 size={11} /> },
    Redo:             { color: "#f87171", bg: "#2e0a0a", icon: <XCircle size={11} /> },
  };
  const cfg = map[status] ?? map["Not Started"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        fontSize: "0.68rem",
        fontWeight: 700,
      }}
    >
      {cfg.icon} {status}
    </span>
  );
};

const CCClubAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<CCUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<CCUser | null>(null);
  const [speeches, setSpeeches] = useState<CCSpeech[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSpeeches, setLoadingSpeeches] = useState(false);
  const [evalNotes, setEvalNotes] = useState<Record<string, string>>({});
  const [savingEval, setSavingEval] = useState<string | null>(null);
  const [editingPoints, setEditingPoints] = useState<Record<string, number>>({});
  const [savingPoints, setSavingPoints] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<string | null>(null);

  const handleRoleChange = async (u: CCUser, newRole: CCRole) => {
    setUpdatingRole(u.uid);
    try {
      let updatedBadges = [...(u.badges || [])];
      if (newRole !== "Student") {
        const badgeName = `${newRole} Badge`;
        if (!updatedBadges.includes(badgeName)) {
          updatedBadges.push(badgeName);
        }
      }
      await updateCCUser(u.uid, {
        club_role: newRole,
        badges: updatedBadges,
      });
      setUsers((prev) =>
        prev.map((m) => (m.uid === u.uid ? { ...m, club_role: newRole, badges: updatedBadges } : m))
      );
      if (selectedUser?.uid === u.uid) {
        setSelectedUser((s) => (s ? { ...s, club_role: newRole, badges: updatedBadges } : s));
      }
      toast.success(`Role updated to ${newRole}.`);
    } catch {
      toast.error("Failed to update role.");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteProfile = async (u: CCUser) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the profile of ${u.name}? This action cannot be undone.`)) {
      return;
    }
    setDeletingProfile(u.uid);
    try {
      await deleteCCUser(u.uid);
      setUsers((prev) => prev.filter((m) => m.uid !== u.uid));
      setSelectedUser(null);
      toast.success(`Profile of ${u.name} deleted successfully.`);
    } catch {
      toast.error("Failed to delete profile.");
    } finally {
      setDeletingProfile(null);
    }
  };

  useEffect(() => {
    getAllCCUsers()
      .then((list) => { setUsers(list); setLoadingUsers(false); })
      .catch(() => { toast.error("Failed to load CC Club members"); setLoadingUsers(false); });
  }, []);

  const selectUser = useCallback(async (u: CCUser) => {
    setSelectedUser(u);
    setSpeeches([]);
    setLoadingSpeeches(true);
    try {
      const data = await getCCSpeeches(u.uid);
      setSpeeches(data);
    } finally {
      setLoadingSpeeches(false);
    }
  }, []);

  const handleEvaluate = async (speech: CCSpeech, status: "Well Done" | "Redo") => {
    if (!selectedUser) return;
    setSavingEval(speech.speech_id);
    try {
      const notes = evalNotes[speech.speech_id] ?? "";
      const score = status === "Well Done" ? 10 : 0;
      await evaluateCCSpeech(selectedUser.uid, speech.speech_id, status, score, notes);
      setSpeeches((prev) =>
        prev.map((s) =>
          s.speech_id === speech.speech_id ? { ...s, status, evaluator_notes: notes } : s
        )
      );
      toast.success(`Marked as "${status}".`);
    } catch {
      toast.error("Evaluation failed.");
    } finally {
      setSavingEval(null);
    }
  };

  const handleSavePoints = async (u: CCUser) => {
    const newPts = editingPoints[u.uid];
    if (newPts === undefined) return;
    setSavingPoints(u.uid);
    try {
      await updateDoc(doc(db, "cc_users", u.uid), {
        total_points: newPts,
        updated_at: new Date(),
      });
      setUsers((prev) => prev.map((m) => (m.uid === u.uid ? { ...m, total_points: newPts } : m)));
      if (selectedUser?.uid === u.uid) {
        setSelectedUser((s) => (s ? { ...s, total_points: newPts } : s));
      }
      toast.success(`Points updated to ${newPts}.`);
      const next = { ...editingPoints };
      delete next[u.uid];
      setEditingPoints(next);
    } catch {
      toast.error("Failed to update points.");
    } finally {
      setSavingPoints(null);
    }
  };

  const inputBase: React.CSSProperties = {
    background: "hsl(210 15% 18%)",
    border: "1px solid hsl(210 15% 28%)",
    color: "hsl(210 20% 88%)",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "0.82rem",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", gap: "1.5rem", minHeight: "500px" }}>
      {/* User list */}
      <div style={{ width: "260px", flexShrink: 0 }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            marginBottom: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {users.length} Members
        </p>
        {loadingUsers ? (
          <div style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading...
          </div>
        ) : users.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "#6b7280" }}>No CC Club members yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: "560px", overflowY: "auto" }}>
            {users.map((u) => (
              <button
                key={u.uid}
                type="button"
                onClick={() => selectUser(u)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: selectedUser?.uid === u.uid ? "hsl(165 40% 16%)" : "hsl(210 15% 15%)",
                  border: `1px solid ${selectedUser?.uid === u.uid ? "hsl(165 50% 30%)" : "hsl(210 15% 22%)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: selectedUser?.uid === u.uid ? "hsl(165 70% 55%)" : "hsl(210 20% 82%)",
                  }}
                >
                  {u.name}
                </span>
                <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                  {u.club_role} · Lvl {u.current_level}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Star size={11} color="hsl(38 88% 55%)" fill="hsl(38 88% 55%)" />
                  <span style={{ fontSize: "0.7rem", color: "hsl(38 88% 55%)", fontWeight: 600 }}>
                    {u.total_points} pts
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedUser ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* User header + point editor */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "hsl(210 15% 14%)",
              border: "1px solid hsl(210 15% 22%)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "hsl(210 20% 88%)" }}>
                  {selectedUser.name}
                </h3>
                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 6 }}>
                  {selectedUser.email} · {selectedUser.college}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Role:</span>
                  <select
                    value={selectedUser.club_role}
                    onChange={(e) => handleRoleChange(selectedUser, e.target.value as CCRole)}
                    disabled={updatingRole === selectedUser.uid}
                    style={{ ...inputBase, padding: "4px 8px" }}
                  >
                    {["Student", "President", "Vice President", "Team Leader", "Event Team", "Trainer Buddy"].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {updatingRole === selectedUser.uid && (
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Updating...</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Points:</span>
                  <input
                    type="number"
                    min={0}
                    style={{ ...inputBase, width: 70 }}
                    value={editingPoints[selectedUser.uid] ?? selectedUser.total_points}
                    onChange={(e) =>
                      setEditingPoints((p) => ({ ...p, [selectedUser.uid]: Number(e.target.value) }))
                    }
                  />
                  {editingPoints[selectedUser.uid] !== undefined && (
                    <button
                      onClick={() => handleSavePoints(selectedUser)}
                      disabled={savingPoints === selectedUser.uid}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "hsl(165 60% 35%)",
                        color: "hsl(210 18% 8%)",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                      }}
                    >
                      <Save size={12} /> {savingPoints === selectedUser.uid ? "..." : "Save"}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteProfile(selectedUser)}
                  disabled={deletingProfile === selectedUser.uid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "hsl(0 72% 35%)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    transition: "background 200ms",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "hsl(0 72% 42%)")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "hsl(0 72% 35%)")}
                >
                  {deletingProfile === selectedUser.uid ? "Deleting..." : "Delete Profile"}
                </button>
              </div>
            </div>
          </div>

          {/* Speech evaluations */}
          <p
            style={{
              fontSize: "0.72rem",
              color: "#6b7280",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Speech Evaluations
          </p>

          {loadingSpeeches ? (
            <div style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
              <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading speeches...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "440px", overflowY: "auto" }}>
              {speeches.map((s) => (
                <div
                  key={s.speech_id}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "hsl(210 15% 14%)",
                    border: "1px solid hsl(210 15% 22%)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: s.status === "Pending Review" || s.status === "Redo" ? 8 : 0,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "hsl(210 20% 85%)" }}>
                        {s.speech_id} — {s.title}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <SpeechStatusChip status={s.status} />
                        {s.submission_url && (
                          <a
                            href={s.submission_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: "0.7rem", color: "hsl(165 70% 52%)", textDecoration: "underline" }}
                          >
                            View Recording ↗
                          </a>
                        )}
                      </div>
                    </div>
                    {(s.status === "Pending Review" || s.status === "Redo") && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          disabled={savingEval === s.speech_id}
                          onClick={() => handleEvaluate(s, "Well Done")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            background: "hsl(145 45% 18%)",
                            color: "hsl(145 60% 50%)",
                            border: "1px solid hsl(145 40% 28%)",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <CheckCircle2 size={12} /> {savingEval === s.speech_id ? "..." : "Well Done"}
                        </button>
                        <button
                          disabled={savingEval === s.speech_id}
                          onClick={() => handleEvaluate(s, "Redo")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            background: "hsl(0 40% 18%)",
                            color: "hsl(0 65% 60%)",
                            border: "1px solid hsl(0 40% 28%)",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <XCircle size={12} /> Redo
                        </button>
                      </div>
                    )}
                  </div>
                  {(s.status === "Pending Review" || s.status === "Redo") && (
                    <input
                      type="text"
                      placeholder="Evaluator feedback (optional)..."
                      value={evalNotes[s.speech_id] ?? s.evaluator_notes}
                      onChange={(e) =>
                        setEvalNotes((n) => ({ ...n, [s.speech_id]: e.target.value }))
                      }
                      style={{ ...inputBase, width: "100%", boxSizing: "border-box" }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#4b5563",
            gap: 8,
          }}
        >
          <Users size={36} />
          <p style={{ fontSize: "0.88rem" }}>
            Select a member to evaluate their speeches or edit points.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<CollectionName>("contactRequests");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<FirestoreRecord | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const [data, setData] = useState<Record<RegularTab, FirestoreRecord[]>>({
    contactRequests: [],
    careerApplications: [],
    leadershipTestResults: [],
    testResults: [],
  });

  const navigate = useNavigate();

  const extractTime = (obj: any): number => {
    for (const field of ["createdAt", "timestamp", "submittedAt", "date", "updatedAt"]) {
      const v = obj?.[field];
      if (v?.seconds) return v.seconds;
      if (v instanceof Date) return v.getTime() / 1000;
      if (typeof v === "string") {
        const p = new Date(v).getTime();
        if (!isNaN(p)) return p / 1000;
      }
    }
    return 0;
  };

  const companyList = useMemo(() => {
    const companies = new Set(
      data.testResults.map((r) => r.company || "Unknown").filter(Boolean)
    );
    return ["All", ...Array.from(companies).sort()];
  }, [data.testResults]);

  const filteredTestResults = useMemo(() => {
    if (selectedCompany === "All") return data.testResults;
    return data.testResults.filter((r) => (r.company || "Unknown") === selectedCompany);
  }, [data.testResults, selectedCompany]);

  const exportXLSX = () => {
    const rows = filteredTestResults.map((item) => ({
      Name: item.name || "N/A",
      Email: item.email || "N/A",
      Company: item.company || "N/A",
      Test: item.testType || "Grammar",
      Score: `${item.score || 0}/${item.totalQuestions || item.total || 0}`,
      Percentage: `${item.percentage || 0}%`,
      Level: deriveLevel(item),
      Date: item.createdAt?.seconds
        ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Test Results");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const label = selectedCompany === "All" ? "All_Companies" : selectedCompany.replace(/\s+/g, "_");
    saveAs(file, `Test_Report_${label}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const printReport = () => {
    const rows = filteredTestResults;
    if (rows.length === 0) { toast.error("No results to print for this selection."); return; }

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const adv = rows.filter((r) => deriveLevel(r) === "Advanced");
    const int = rows.filter((r) => deriveLevel(r) === "Intermediate");
    const bas = rows.filter((r) => deriveLevel(r) === "Basic");

    const tableRows = (items: FirestoreRecord[], showLevel = false) =>
      items.map((item, i) => {
        const level = deriveLevel(item);
        const color = levelColor(level);
        const score = item.score ?? 0;
        const total = item.totalQuestions || item.total || 0;
        const pct = item.percentage ?? (total ? Math.round((score / total) * 100) : 0);
        return `<tr>
          <td>${i + 1}</td>
          <td><strong>${item.name || "—"}</strong></td>
          <td>${item.email || "—"}</td>
          <td>${item.company || "—"}</td>
          <td style="text-align:center">${score}/${total}</td>
          <td style="text-align:center">${pct}%</td>
          ${showLevel ? `<td style="text-align:center"><span style="background:${color}22;color:${color};border:1px solid ${color}66;padding:2px 10px;border-radius:20px;font-weight:700;font-size:11px;">${level}</span></td>` : ""}
          <td>${item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "—"}</td>
        </tr>`;
      }).join("");

    const adultsRows = rows.filter((r) => r.testType === "adults");
    const isAdultsOnly = adultsRows.length > 0 && rows.every((r) => r.testType === "adults");

    const levelSection = (label: string, emoji: string, headerBg: string, items: FirestoreRecord[]) => {
      if (items.length === 0) return "";
      return `
      <div class="company-section">
        <div class="company-header" style="background:${headerBg}">
          <span class="company-name">${emoji} ${label}</span>
          <span class="company-count">${items.length} employee${items.length !== 1 ? "s" : ""}</span>
        </div>
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Company</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
          <tbody>${tableRows(items, false)}</tbody>
        </table>
      </div>`;
    };

    const grouped: Record<string, FirestoreRecord[]> = {};
    rows.forEach((item) => {
      const co = item.company || "Unknown";
      if (!grouped[co]) grouped[co] = [];
      grouped[co].push(item);
    });
    const companySections = Object.entries(grouped).map(([co, items]) => `
      <div class="company-section">
        <div class="company-header">
          <span class="company-name">🏢 ${co}</span>
          <span class="company-count">${items.length} employee${items.length !== 1 ? "s" : ""}</span>
        </div>
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Company</th><th>Score</th><th>%</th><th>Level</th><th>Date</th></tr></thead>
          <tbody>${tableRows(items, true)}</tbody>
        </table>
      </div>`).join("");

    const bodySections = isAdultsOnly
      ? `<div class="section-intro">Results are grouped by proficiency level.</div>
         ${levelSection("Advanced", "🏆", "#15803d", adv)}
         ${levelSection("Intermediate", "📈", "#b45309", int)}
         ${levelSection("Basic", "📘", "#b91c1c", bas)}`
      : companySections;

    const subtitleLabel = isAdultsOnly
      ? "Adults Test — Level Report"
      : `${selectedCompany === "All" ? "All Companies" : selectedCompany}`;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Test Report — ${subtitleLabel}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;background:#fff;padding:32px 40px}
  .report-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a1a2e;padding-bottom:20px;margin-bottom:28px}
  .report-title{font-family:'DM Serif Display',serif;font-size:28px;line-height:1.1}
  .report-subtitle{font-size:13px;color:#555;margin-top:4px}
  .report-meta{text-align:right;font-size:11px;color:#666;line-height:1.8}
  .report-meta strong{color:#1a1a2e}
  .summary-strip{display:flex;gap:16px;margin-bottom:28px}
  .summary-card{flex:1;padding:12px 16px;border-radius:10px;background:#f4f4f8;border-left:4px solid #1a1a2e}
  .summary-card.green{border-color:#16a34a;background:#f0fdf4}
  .summary-card.amber{border-color:#d97706;background:#fffbeb}
  .summary-card.red{border-color:#dc2626;background:#fef2f2}
  .summary-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}
  .summary-value{font-size:22px;font-weight:700;margin-top:2px}
  .section-intro{font-size:11px;color:#888;margin-bottom:16px;font-style:italic}
  .company-section{margin-bottom:32px}
  .company-header{display:flex;justify-content:space-between;align-items:center;background:#1a1a2e;color:#fff;padding:8px 16px;border-radius:8px 8px 0 0}
  .company-name{font-weight:700;font-size:13px}
  .company-count{font-size:11px;opacity:.7}
  table{width:100%;border-collapse:collapse;border:1px solid #e2e2ec}
  thead tr{background:#f8f8fc}
  th{padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#666;border-bottom:2px solid #e2e2ec;white-space:nowrap}
  td{padding:9px 10px;border-bottom:1px solid #ebebf2;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:nth-child(even) td{background:#fafafe}
  .report-footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:10px;color:#999}
  .confidential{font-weight:700;color:#dc2626;letter-spacing:1px;text-transform:uppercase}
  @media print{body{padding:16px 20px}.company-section{page-break-inside:avoid}@page{margin:12mm;size:A4 landscape}}
</style>
</head><body>
  <div class="report-header">
    <div>
      <div class="report-title">Employee Test Report</div>
      <div class="report-subtitle">${subtitleLabel} &mdash; ${today}</div>
    </div>
    <div class="report-meta">
      <div><strong>Generated:</strong> ${today}</div>
      <div><strong>Total Records:</strong> ${rows.length}</div>
      <div><strong>${isAdultsOnly ? "Test" : "Companies"}:</strong> ${isAdultsOnly ? "Adults (Grammar)" : Object.keys(grouped).length}</div>
    </div>
  </div>
  <div class="summary-strip">
    <div class="summary-card"><div class="summary-label">Total Tested</div><div class="summary-value">${rows.length}</div></div>
    <div class="summary-card green"><div class="summary-label">Advanced</div><div class="summary-value">${adv.length}</div></div>
    <div class="summary-card amber"><div class="summary-label">Intermediate</div><div class="summary-value">${int.length}</div></div>
    <div class="summary-card red"><div class="summary-label">Basic</div><div class="summary-value">${bas.length}</div></div>
  </div>
  ${bodySections}
  <div class="report-footer">
    <span class="confidential">Confidential — For Manager Use Only</span>
    <span>Printed on ${today}</span>
  </div>
  <script>window.onload=()=>window.print();</script>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
    else toast.error("Popup blocked. Please allow popups for this site.");
  };

  const printByLevel = () => {
    const rows = filteredTestResults;
    if (rows.length === 0) { toast.error("No results to print."); return; }

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const levels = [
      { label: "Advanced",     emoji: "🏆", bg: "#15803d", filter: "Advanced" },
      { label: "Intermediate", emoji: "📈", bg: "#b45309", filter: "Intermediate" },
      { label: "Basic",        emoji: "📘", bg: "#b91c1c", filter: "Basic" },
    ];

    const tableRows = (items: FirestoreRecord[]) =>
      items.map((item, i) => {
        const score = item.score ?? 0;
        const total = item.totalQuestions || item.total || 0;
        const pct = item.percentage ?? (total ? Math.round((score / total) * 100) : 0);
        return `<tr>
          <td>${i + 1}</td>
          <td><strong>${item.name || "—"}</strong></td>
          <td>${item.email || "—"}</td>
          <td>${item.company || "—"}</td>
          <td>${item.testType || "—"}</td>
          <td style="text-align:center">${score}/${total}</td>
          <td style="text-align:center">${pct}%</td>
          <td>${item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "—"}</td>
        </tr>`;
      }).join("");

    const levelSections = levels.map(({ label, emoji, bg, filter }) => {
      const items = rows.filter((r) => deriveLevel(r) === filter);
      if (items.length === 0) return "";
      return `
        <div class="level-section">
          <div class="level-header" style="background:${bg}">
            <span class="level-name">${emoji} ${label}</span>
            <span class="level-count">${items.length} employee${items.length !== 1 ? "s" : ""}</span>
          </div>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Company</th><th>Test</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
            <tbody>${tableRows(items)}</tbody>
          </table>
        </div>`;
    }).join("");

    const adv = rows.filter((r) => deriveLevel(r) === "Advanced").length;
    const int = rows.filter((r) => deriveLevel(r) === "Intermediate").length;
    const bas = rows.filter((r) => deriveLevel(r) === "Basic").length;
    const companyLabel = selectedCompany === "All" ? "All Companies" : selectedCompany;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Level Report — ${companyLabel}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;background:#fff;padding:32px 40px}
  .report-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a1a2e;padding-bottom:20px;margin-bottom:28px}
  .report-title{font-family:'DM Serif Display',serif;font-size:28px;line-height:1.1}
  .report-subtitle{font-size:13px;color:#555;margin-top:4px}
  .report-meta{text-align:right;font-size:11px;color:#666;line-height:1.8}
  .report-meta strong{color:#1a1a2e}
  .summary-strip{display:flex;gap:16px;margin-bottom:28px}
  .summary-card{flex:1;padding:12px 16px;border-radius:10px;background:#f4f4f8;border-left:4px solid #1a1a2e}
  .summary-card.green{border-color:#16a34a;background:#f0fdf4}
  .summary-card.amber{border-color:#d97706;background:#fffbeb}
  .summary-card.red{border-color:#dc2626;background:#fef2f2}
  .summary-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}
  .summary-value{font-size:22px;font-weight:700;margin-top:2px}
  .level-section{margin-bottom:32px}
  .level-header{display:flex;justify-content:space-between;align-items:center;color:#fff;padding:10px 16px;border-radius:8px 8px 0 0}
  .level-name{font-weight:700;font-size:14px;letter-spacing:0.3px}
  .level-count{font-size:11px;opacity:.75}
  table{width:100%;border-collapse:collapse;border:1px solid #e2e2ec}
  thead tr{background:#f8f8fc}
  th{padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#666;border-bottom:2px solid #e2e2ec;white-space:nowrap}
  td{padding:9px 10px;border-bottom:1px solid #ebebf2;vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:nth-child(even) td{background:#fafafe}
  .report-footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:10px;color:#999}
  .confidential{font-weight:700;color:#dc2626;letter-spacing:1px;text-transform:uppercase}
  @media print{body{padding:16px 20px}.level-section{page-break-inside:avoid}@page{margin:12mm;size:A4 landscape}}
</style>
</head><body>
  <div class="report-header">
    <div>
      <div class="report-title">Level-wise Test Report</div>
      <div class="report-subtitle">${companyLabel} &mdash; ${today}</div>
    </div>
    <div class="report-meta">
      <div><strong>Generated:</strong> ${today}</div>
      <div><strong>Total Records:</strong> ${rows.length}</div>
      <div><strong>Scope:</strong> ${companyLabel}</div>
    </div>
  </div>
  <div class="summary-strip">
    <div class="summary-card"><div class="summary-label">Total Tested</div><div class="summary-value">${rows.length}</div></div>
    <div class="summary-card green"><div class="summary-label">Advanced</div><div class="summary-value">${adv}</div></div>
    <div class="summary-card amber"><div class="summary-label">Intermediate</div><div class="summary-value">${int}</div></div>
    <div class="summary-card red"><div class="summary-label">Basic</div><div class="summary-value">${bas}</div></div>
  </div>
  ${levelSections}
  <div class="report-footer">
    <span class="confidential">Confidential — For Manager Use Only</span>
    <span>Printed on ${today}</span>
  </div>
  <script>window.onload=()=>window.print();</script>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
    else toast.error("Popup blocked. Please allow popups for this site.");
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { setAuthChecked(true); navigate("/"); return; }
      try {
        const token = await currentUser.getIdTokenResult();
        if (!token.claims.admin) { toast.error("Access denied."); navigate("/"); return; }
        setUser(currentUser);
        setAuthChecked(true);
      } catch { navigate("/"); }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const unsubscribers = REGULAR_TABS.map((tabId) =>
      onSnapshot(
        collection(db, tabId),
        (snapshot) => {
          const docs: FirestoreRecord[] = snapshot.docs.map(
            (d: QueryDocumentSnapshot<DocumentData>) => ({ id: d.id, ...d.data() })
          );
          docs.sort((a, b) => extractTime(b) - extractTime(a));
          setData((prev) => ({ ...prev, [tabId]: docs }));
          setLoading(false);
        },
        (error) => {
          console.error(`Error fetching ${tabId}:`, error);
          toast.error(`Failed to load ${tabId}`);
        }
      )
    );
    return () => unsubscribers.forEach((u) => u());
  }, [user]);

  useEffect(() => { setSelectedCompany("All"); }, [activeTab]);

  if (!authChecked)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verifying credentials...</div>
      </div>
    );

  if (!user) return null;

  const currentData =
    activeTab === "testResults"
      ? filteredTestResults
      : activeTab === "cc_club"
      ? []
      : data[activeTab as RegularTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-12">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-muted-foreground text-sm">Centralized system management</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/blogs")}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm"
          >
            <span>Manage Blogs</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <aside className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tab.id === "cc_club" ? 0 : data[tab.id as RegularTab]?.length || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center justify-between min-w-[160px] lg:min-w-0 px-4 py-3.5 rounded-xl font-medium transition-all
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary"
                      : "bg-card text-muted-foreground hover:bg-secondary/50 border border-transparent"}
                  `}
                >
                  <span className="truncate mr-2">{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    }`}>{count}</span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main content */}
          <section className="flex-1 min-h-[600px]">
            {activeTab === "cc_club" ? (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Mic2 size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold">CC Club Admin</h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Speech Evaluation &amp; Points
                  </span>
                </div>
                <CCClubAdminPanel />
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <h2 className="text-xl font-semibold capitalize">
                    {(activeTab as string).replace(/([A-Z])/g, " $1")}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">{currentData.length} records</span>

                    {activeTab === "testResults" && companyList.length > 1 && (
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <select
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          className="pl-8 pr-8 py-2 rounded-xl border border-border bg-card text-sm font-medium appearance-none cursor-pointer hover:border-primary/50 focus:border-primary outline-none transition-all"
                        >
                          {companyList.map((co) => (
                            <option key={co} value={co}>{co}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {activeTab === "testResults" && (
                      <>
                        <button
                          onClick={printByLevel}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/40 transition-all text-sm font-medium"
                        >
                          <LayoutList size={14} /> By Level
                        </button>
                        <button
                          onClick={printReport}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/40 transition-all text-sm font-medium"
                        >
                          <Printer size={14} /> Print Report
                        </button>
                        <button
                          onClick={exportXLSX}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium shadow-sm"
                        >
                          <Download size={14} /> Export XLSX
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                    <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
                    <p>Syncing with Firestore...</p>
                  </div>
                ) : currentData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                    <FileSearch className="w-12 h-12 mb-3 opacity-20" />
                    <p>No entries found</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {currentData.map((docItem, idx) => (
                        <motion.div
                          key={docItem.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => setSelectedRecord(docItem)}
                          className="group p-5 rounded-2xl bg-secondary/5 border border-border hover:border-primary/30 hover:bg-secondary/10 transition-all cursor-pointer"
                        >
                          <div className="mb-3">
                            <h4 className="font-bold text-foreground truncate">
                              {docItem.name || docItem.fullName || docItem.email || `ID: ${docItem.id.slice(0, 8)}`}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1 italic">
                              {docItem.subject || docItem.message || (docItem.score !== undefined ? `Score: ${docItem.score}` : "View entry")}
                            </p>
                          </div>

                          {activeTab === "testResults" && (
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {docItem.company && (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border font-medium">
                                  {docItem.company}
                                </span>
                              )}
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                                deriveLevel(docItem) === "Advanced"
                                  ? "bg-green-500/10 text-green-600 border-green-500/30"
                                  : deriveLevel(docItem) === "Intermediate"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                  : "bg-red-500/10 text-red-600 border-red-500/30"
                              }`}>
                                {deriveLevel(docItem)}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-border/50">
                            <span className="text-[10px] font-mono text-muted-foreground">
                              ID: {docItem.id.slice(0, 12)}
                            </span>
                            <span className="text-xs font-semibold text-primary group-hover:underline">
                              Details →
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="font-bold">Record Inspection</h3>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <pre className="p-4 rounded-xl bg-secondary/30 font-mono text-xs overflow-x-auto leading-relaxed border border-border text-foreground">
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;