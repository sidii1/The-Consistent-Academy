import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileSearch, ArrowRight, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

// --- Types ---
type CollectionName = "contactRequests" | "careerApplications" | "leadershipTestResults" | "testResults";

interface FirestoreRecord {
  id: string;
  [key: string]: any;
}

const TABS: { id: CollectionName; label: string }[] = [
  { id: "contactRequests", label: "Contact Requests" },
  { id: "careerApplications", label: "Career Applications" },
  { id: "leadershipTestResults", label: "Leadership Test" },
  { id: "testResults", label: "Other Tests" },
];

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<CollectionName>("contactRequests");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<FirestoreRecord | null>(null);
  const [data, setData] = useState<Record<CollectionName, FirestoreRecord[]>>({
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

    const unsubscribers = TABS.map((tab) => {
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