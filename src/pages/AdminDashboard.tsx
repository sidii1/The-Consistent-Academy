import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, onSnapshot, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, FileSearch, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

type CollectionName = "contactRequests" | "careerApplications" | "leadershipTestResults" | "testResults";

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
  
  type FirestoreRecord = { id: string; [key: string]: any };

const [data, setData] = useState<Record<CollectionName, FirestoreRecord[]>>({
  contactRequests: [],
  careerApplications: [],
  leadershipTestResults: [],
  testResults: []
});
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const navigate = useNavigate();

  // Validate Admin logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthChecked(true);
      if (!currentUser) {
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
      } catch (err) {
        console.error("Error checking admin claim:", err);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch all collections
 useEffect(() => {
  if (!user) return;
  const unsubscribe = fetchAllData();
  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [user]);

  const fetchAllData = () => {
  setLoading(true);

  const unsubscribers: (() => void)[] = [];

  TABS.forEach((tab) => {
    const unsubscribe = onSnapshot(
      collection(db, tab.id),
      (snapshot) => {
        const docsData: FirestoreRecord[] = snapshot.docs.map(
          (d: QueryDocumentSnapshot<DocumentData>) => ({
            id: d.id,
            ...d.data(),
          })
        );

        // Sort by timestamp (latest first)
        docsData.sort((a, b) => extractTime(b) - extractTime(a));

        setData((prev) => ({
          ...prev,
          [tab.id]: docsData,
        }));

        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${tab.id}:`, error);
        toast.error(`Failed to load ${tab.label}`);
        setLoading(false);
      }
    );

    unsubscribers.push(unsubscribe);
  });

  // Cleanup listeners when component unmounts
  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
};

const extractTime = (obj: any): number => {
  const possibleFields = [
    "createdAt",
    "timestamp",
    "submittedAt",
    "date",
    "updatedAt",
  ];

  for (const field of possibleFields) {
    const value = obj?.[field];

    if (value?.seconds) {
      return value.seconds;
    }

    if (value instanceof Date) {
      return value.getTime() / 1000;
    }

    if (typeof value === "string") {
      const parsed = new Date(value).getTime();
      if (!isNaN(parsed)) return parsed / 1000;
    }
  }

  return 0;
};

  if (!authChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  const currentData = data[activeTab] || [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-24 px-4 md:px-6 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Master Dashboard
                </h1>
                <p className="text-muted-foreground">View and manage all system data.</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button 
                onClick={() => navigate("/admin/blogs")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary font-semibold hover:bg-primary hover:text-white transition-all shadow-neu-sm hover:shadow-neu-lg"
              >
                Go to Blogs Admin
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 shrink-0 flex flex-nowrap lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 flex items-center justify-between ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-neu-lg scale-105 ml-2 lg:ml-4"
                      : "bg-card text-muted-foreground shadow-neu hover:shadow-neu-md hover:text-foreground"
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {data[tab.id]?.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/20" : "bg-primary/10 text-primary"
                    }`}>
                      {data[tab.id].length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List Content */}
            <div className="flex-1">
              <div className="bg-card rounded-3xl p-6 shadow-neu-xl min-h-[60vh]">
                <div className="mb-6 pb-4 border-b border-primary/10 flex justify-between items-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {TABS.find(t => t.id === activeTab)?.label} ({currentData.length})
                  </h2>
                  <button onClick={fetchAllData} className="text-sm text-primary hover:underline font-medium">
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p>Loading data...</p>
                  </div>
                ) : currentData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <FileSearch className="w-16 h-16 opacity-20 mb-4" />
                    <p>No records found in this collection.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {currentData.map((doc, idx) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.02 }}
                          className="p-5 rounded-2xl bg-secondary/10 border border-primary/5 shadow-neu-inset-sm flex flex-col justify-between hover:shadow-neu hover:bg-secondary/20 transition-all cursor-pointer"
                          onClick={() => setSelectedRecord(doc)}
                        >
                          <div>
                            <div className="font-semibold text-foreground truncate mb-1">
                              {doc.name ||
  doc.fullName ||
  doc.email ||
  doc.title ||
  doc.subject ||
  `Record #${doc.id.slice(0, 6)}`}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {doc.message ||
  doc.phone ||
  (doc.score !== undefined ? `Score: ${doc.score}` : "Click to view details")}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center text-xs font-medium border-t border-primary/10 pt-3">
                            <span className="text-primary truncate mr-2">ID: {doc.id}</span>
                            <span className="shrink-0 bg-primary/10 px-2 py-1 rounded text-primary hover:bg-primary hover:text-white transition-colors">
                              View Details
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Details Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-full flex flex-col bg-card rounded-3xl overflow-hidden shadow-neu-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-primary/10 bg-gradient-to-r from-card to-secondary/20">
                <h3 className="text-lg font-bold text-foreground">Record Details</h3>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="bg-secondary/10 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap text-foreground/80 border border-primary/10 shadow-neu-inset-sm">
                  {JSON.stringify(selectedRecord, null, 2)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminDashboard;
