import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileSearch, ArrowRight, X, RefreshCw, Mic2, Users, CheckCircle2, XCircle, Clock, Edit3, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import {
  getAllCCUsers,
  getCCSpeeches,
  evaluateCCSpeech,
  type CCUser,
  type CCSpeech,
  LEVEL_NAMES,
} from "@/lib/ccClub";

// --- Types ---
type CollectionName = "contactRequests" | "careerApplications" | "leadershipTestResults" | "testResults" | "cc_club";

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

// ─── CC Club Admin Panel ───
interface CCUserWithSpeeches extends CCUser {
  speeches?: CCSpeech[];
}

const SpeechStatusChip: React.FC<{ status: CCSpeech["status"] }> = ({ status }) => {
  const map = {
    "Not Started": { color: "#6b7280", bg: "#1f2937", icon: <Clock size={11} /> },
    "Pending Review": { color: "#38bdf8", bg: "#0c2a3e", icon: <Clock size={11} /> },
    "Well Done": { color: "#34d399", bg: "#052e20", icon: <CheckCircle2 size={11} /> },
    Redo: { color: "#f87171", bg: "#2e0a0a", icon: <XCircle size={11} /> },
  } as const;
  const cfg = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, background: cfg.bg, color: cfg.color, fontSize: "0.68rem", fontWeight: 700 }}>
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

  // Evaluation state
  const [evalNotes, setEvalNotes] = useState<Record<string, string>>({});
  const [savingEval, setSavingEval] = useState<string | null>(null);

  // Point editing
  const [editingPoints, setEditingPoints] = useState<Record<string, number>>({});
  const [savingPoints, setSavingPoints] = useState<string | null>(null);

  useEffect(() => {
    getAllCCUsers().then((list) => {
      setUsers(list);
      setLoadingUsers(false);
    }).catch(() => { toast.error("Failed to load CC Club members"); setLoadingUsers(false); });
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
      const notes = evalNotes[speech.speech_id] || "";
      const score = status === "Well Done" ? 10 : 0;
      await evaluateCCSpeech(selectedUser.uid, speech.speech_id, status, score, notes);
      setSpeeches((prev) => prev.map((s) => s.speech_id === speech.speech_id ? { ...s, status, evaluator_notes: notes } : s));
      toast.success(`Marked as "${status}".`);
    } catch { toast.error("Evaluation failed."); }
    finally { setSavingEval(null); }
  };

  const handleSavePoints = async (u: CCUser) => {
    const newPts = editingPoints[u.uid];
    if (newPts === undefined) return;
    setSavingPoints(u.uid);
    try {
      await updateDoc(doc(db, "cc_users", u.uid), { total_points: newPts, updated_at: new Date() });
      setUsers((prev) => prev.map((m) => m.uid === u.uid ? { ...m, total_points: newPts } : m));
      if (selectedUser?.uid === u.uid) setSelectedUser((s) => s ? { ...s, total_points: newPts } : s);
      toast.success(`Points updated to ${newPts}.`);
      const { [u.uid]: _, ...rest } = editingPoints;
      setEditingPoints(rest);
    } catch { toast.error("Failed to update points."); }
    finally { setSavingPoints(null); }
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
      <div style={{ width: "280px", flexShrink: 0 }}>
        <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {users.length} Members
        </p>
        {loadingUsers ? (
          <div style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
            <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {users.map((u) => (
              <button key={u.uid} type="button" onClick={() => selectUser(u)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  padding: "10px 12px", borderRadius: 12,
                  background: selectedUser?.uid === u.uid ? "hsl(165 40% 16%)" : "hsl(210 15% 15%)",
                  border: `1px solid ${selectedUser?.uid === u.uid ? "hsl(165 50% 30%)" : "hsl(210 15% 22%)"}`,
                  cursor: "pointer", textAlign: "left", transition: "all 200ms",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: selectedUser?.uid === u.uid ? "hsl(165 70% 55%)" : "hsl(210 20% 82%)" }}>{u.name}</span>
                <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{u.club_role} · Lvl {u.current_level}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Star size={11} color="hsl(38 88% 55%)" fill="hsl(38 88% 55%)" />
                  <span style={{ fontSize: "0.7rem", color: "hsl(38 88% 55%)", fontWeight: 600 }}>{u.total_points} pts</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedUser ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* User header */}
          <div style={{ padding: "14px 16px", borderRadius: 14, background: "hsl(210 15% 14%)", border: "1px solid hsl(210 15% 22%)", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "hsl(210 20% 88%)" }}>{selectedUser.name}</h3>
                <p style={{ fontSize: "0.78rem", color: "#6b7280" }}>{selectedUser.email} · {selectedUser.college} · {selectedUser.club_role}</p>
              </div>
              {/* Point editor */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Points:</span>
                <input
                  type="number"
                  min={0}
                  style={{ ...inputBase, width: 70 }}
                  value={editingPoints[selectedUser.uid] ?? selectedUser.total_points}
                  onChange={(e) => setEditingPoints((p) => ({ ...p, [selectedUser.uid]: Number(e.target.value) }))}
                />
                {editingPoints[selectedUser.uid] !== undefined && (
                  <button
                    onClick={() => handleSavePoints(selectedUser)}
                    disabled={savingPoints === selectedUser.uid}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "hsl(165 60% 35%)", color: "hsl(210 18% 8%)", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem" }}
                  >
                    <Save size={12} /> {savingPoints === selectedUser.uid ? "..." : "Save"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Speeches */}
          <p style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
            Speech Evaluations
          </p>
          {loadingSpeeches ? (
            <div style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
              <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading speeches...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {speeches.map((s) => (
                <div key={s.speech_id} style={{ padding: "12px 14px", borderRadius: 12, background: "hsl(210 15% 14%)", border: "1px solid hsl(210 15% 22%)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "hsl(210 20% 85%)" }}>{s.speech_id} — {s.title}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <SpeechStatusChip status={s.status} />
                        {s.submission_url && (
                          <a href={s.submission_url} target="_blank" rel="noreferrer" style={{ fontSize: "0.7rem", color: "hsl(165 70% 52%)", textDecoration: "underline" }}>View Recording ↗</a>
                        )}
                      </div>
                    </div>
                    {(s.status === "Pending Review" || s.status === "Redo") && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button disabled={savingEval === s.speech_id} onClick={() => handleEvaluate(s, "Well Done")}
                          style={{ padding: "6px 12px", borderRadius: 8, background: "hsl(145 45% 18%)", color: "hsl(145 60% 50%)", border: "1px solid hsl(145 40% 28%)", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 5 }}>
                          <CheckCircle2 size={12} /> {savingEval === s.speech_id ? "..." : "Well Done"}
                        </button>
                        <button disabled={savingEval === s.speech_id} onClick={() => handleEvaluate(s, "Redo")}
                          style={{ padding: "6px 12px", borderRadius: 8, background: "hsl(0 40% 18%)", color: "hsl(0 65% 60%)", border: "1px solid hsl(0 40% 28%)", cursor: "pointer", fontWeight: 700, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 5 }}>
                          <XCircle size={12} /> Redo
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Notes input for pending speeches */}
                  {(s.status === "Pending Review" || s.status === "Redo") && (
                    <input
                      type="text"
                      placeholder="Evaluator feedback (optional)..."
                      value={evalNotes[s.speech_id] ?? s.evaluator_notes}
                      onChange={(e) => setEvalNotes((n) => ({ ...n, [s.speech_id]: e.target.value }))}
                      style={{ ...inputBase, width: "100%", boxSizing: "border-box" }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#4b5563", gap: 8 }}>
          <Users size={36} />
          <p style={{ fontSize: "0.88rem" }}>Select a member to evaluate their speeches or edit points.</p>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<CollectionName>("contactRequests");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<FirestoreRecord | null>(null);
  const [data, setData] = useState<Record<Exclude<CollectionName, "cc_club">, FirestoreRecord[]>>({
    contactRequests: [],
    careerApplications: [],
    leadershipTestResults: [],
    testResults: []
  });

  const navigate = useNavigate();

  // Helper: Extract timestamp for sorting
  const extractTime = (obj: any): number => {
    const possibleFields = ["createdAt", "timestamp", "submittedAt", "date", "updatedAt"];
    for (const field of possibleFields) {
      const value = obj?.[field];
      if (value?.seconds) return value.seconds;
      if (value instanceof Date) return value.getTime() / 1000;
      if (typeof value === "string") {
        const parsed = new Date(value).getTime();
        if (!isNaN(parsed)) return parsed / 1000;
      }
    }
    return 0;
  };

  // Auth & Admin Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthChecked(true);
        navigate("/");
        return;
      }
      try {
        const token = await currentUser.getIdTokenResult();
        if (!token.claims.admin) {
          toast.error("Access denied. Admin only.");
          navigate("/");
          return;
        }
        setUser(currentUser);
        setAuthChecked(true);
      } catch (err) {
        console.error("Error checking admin claim:", err);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Data Fetching
  useEffect(() => {
    if (!user) return;

    const regularTabs = TABS.filter((t) => t.id !== "cc_club");
    const unsubscribers = regularTabs.map((tab) => {
      return onSnapshot(
        collection(db, tab.id),
        (snapshot) => {
          const docsData: FirestoreRecord[] = snapshot.docs.map(
            (d: QueryDocumentSnapshot<DocumentData>) => ({
              id: d.id,
              ...d.data(),
            })
          );
          docsData.sort((a, b) => extractTime(b) - extractTime(a));
          
          setData((prev) => ({ ...prev, [tab.id]: docsData }));
          setLoading(false);
        },
        (error) => {
          console.error(`Error fetching ${tab.id}:`, error);
          toast.error(`Failed to load ${tab.label}`);
        }
      );
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [user]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verifying credentials...</div>
      </div>
    );
  }

  if (!user) return null;

  const currentData = data[activeTab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-28 px-4 pb-12">
        {/* Header Section */}
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
          {/* FIXED SIDEBAR TABS */}
          <aside className="w-full lg:w-72 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = data[tab.id]?.length || 0;
              
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
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 min-h-[600px]">
            {activeTab === "cc_club" ? (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Mic2 size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold">CC Club Admin</h2>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Speech Evaluation & Points</span>
                </div>
                <CCClubAdminPanel />
              </div>
            ) : (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold capitalize">
                  {activeTab.replace(/([A-Z])/g, ' $1')}
                </h2>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{currentData.length} records</span>
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
                    {currentData.map((doc, idx) => (
                      <motion.div
                        key={doc.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => setSelectedRecord(doc)}
                        className="group p-5 rounded-2xl bg-secondary/5 border border-border hover:border-primary/30 hover:bg-secondary/10 transition-all cursor-pointer"
                      >
                        <div className="mb-3">
                          <h4 className="font-bold text-foreground truncate">
                            {doc.name || doc.fullName || doc.email || `ID: ${doc.id.slice(0, 8)}`}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 italic">
                            {doc.subject || doc.message || (doc.score !== undefined ? `Score: ${doc.score}` : "View entry")}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                          <span className="text-[10px] font-mono text-muted-foreground">ID: {doc.id.slice(0, 12)}</span>
                          <span className="text-xs font-semibold text-primary group-hover:underline">Details →</span>
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