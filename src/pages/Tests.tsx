import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Baby,
  GraduationCap,
  Sparkles,
  Award,
  TrendingUp,
  User as UserIcon,
  Building2,
} from "lucide-react";

import { db, auth } from "@/lib/firebase";
import { saveTestResult } from "@/lib/saveTestResult"; // ← single source of truth
import { kidsTestData, adultsTestData } from "@/lib/tests/testData";
import { leadershipTestData } from "@/lib/tests/leadershipTestData";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { Navbar } from "@/components/layout/Navbar";
import TestInterface from "@/components/tests/TestInterface";
import LeadershipTestInterface from "@/components/tests/LeadershipTestInterface";

const Tests = () => {
  const [user, setUser] = useState<User | null>(null);

  // Auth form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTest, setSelectedTest] = useState<"kids" | "adults" | "leadership" | null>(null);

  useEffect(() => {
    signOut(auth);
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setAuthError("Please enter both email and password");
      return;
    }
    if (isRegister && !name.trim()) {
      setAuthError("Please enter your full name");
      return;
    }
    if (isRegister && !company.trim()) {
      setAuthError("Please enter your company name");
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", cred.user.uid), {
          name: name.trim(),
          company: company.trim(),
          email: email.toLowerCase().trim(),
          createdAt: new Date(),
        });
        setUser(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUser(cred.user);
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAuth();
  };

  const switchMode = () => {
    setIsRegister((p) => !p);
    setAuthError("");
    setName("");
    setCompany("");
  };

  /* ── Test interfaces ── */
  if (selectedTest && user) {
    if (selectedTest === "leadership") {
      return (
        <div className="min-h-screen pt-24 px-4">
          <LeadershipTestInterface
            testData={leadershipTestData}
            onBackToSelection={() => setSelectedTest(null)}
            onTestComplete={async ({ scores, dominantStyle, secondaryStyle }) => {
              try {
                await saveTestResult({
                  testType: "Leadership",
                  dominantStyle,
                  secondaryStyle,
                  scores,
                  score: 0,
                  totalQuestions: 60,
                  percentage: 0,
                });
              } catch (err) {
                console.error("❌ Failed to save leadership result:", err);
              }
            }}
          />
        </div>
      );
    }

    const testData = selectedTest === "kids" ? kidsTestData : adultsTestData;
    return (
      <div className="min-h-screen pt-24 px-4">
        <TestInterface
          testData={testData}
          onBackToSelection={() => setSelectedTest(null)}
          onTestComplete={async ({ attempted, correct, wrong }) => {
            try {
              await saveTestResult({
                testType: selectedTest === "kids" ? "Kids Grammar" : "Adults Grammar",
                score: correct,
                totalQuestions: attempted, // ← was "total", now matches rule + admin dashboard
                wrong,
                percentage: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
              });
            } catch (err) {
              console.error("❌ Failed to save test result:", err);
            }
          }}
        />
      </div>
    );
  }

  /* ── Input shared class ── */
  const inputClass =
    "w-full px-4 py-3 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground";

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!user ? (
              /* ── Auth Screen ── */
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome to Tests
                  </h1>
                  <p className="text-muted-foreground">
                    {isRegister ? "Create an account to get started" : "Sign in to continue"}
                  </p>
                </div>

                <NeumorphicCard>
                  <div className="p-6 space-y-5">

                    {/* Registration-only fields — animated */}
                    <AnimatePresence>
                      {isRegister && (
                        <motion.div
                          key="register-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4 overflow-hidden"
                        >
                          {/* Full Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-primary" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className={inputClass}
                            />
                          </div>

                          {/* Company */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-primary" />
                              Company / Organisation
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your company name"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className={inputClass}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={inputClass}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={inputClass}
                      />
                    </div>

                    {/* Error */}
                    {authError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive font-medium"
                      >
                        {authError}
                      </motion.p>
                    )}

                    {/* Submit */}
                    <NeumorphicButton
                      variant="primary"
                      onClick={handleAuth}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                          Processing...
                        </span>
                      ) : isRegister ? (
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Create Account
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </span>
                      )}
                    </NeumorphicButton>

                    {/* Toggle mode */}
                    <div className="text-center">
                      <button
                        onClick={switchMode}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {isRegister ? (
                          <span>Already have an account? <strong>Sign In</strong></span>
                        ) : (
                          <span>Don't have an account? <strong>Create One</strong></span>
                        )}
                      </button>
                    </div>
                  </div>
                </NeumorphicCard>
              </motion.div>
            ) : (
              /* ── Test Selection Screen ── */
              <motion.div
                key="test-selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
              >
                <div className="text-center mb-7">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
                  >
                    <Award className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Choose Your Test
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Select a test to begin your assessment
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* Kids Test */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <NeumorphicCard className="h-full hover:shadow-neu-xl transition-all duration-300">
                      <div className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-neu-lg">
                            <Baby className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">Kids Test</h2>
                            <p className="text-sm text-muted-foreground">Age 5-17 Years</p>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 mb-6">
                          {["25 Questions covering basic grammar concepts", "Fill in the blanks, analogies, synonyms, and more", "Age-appropriate difficulty level"].map((t) => (
                            <div key={t} className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{t}</p>
                            </div>
                          ))}
                        </div>
                        <NeumorphicButton variant="primary" onClick={() => setSelectedTest("kids")} className="w-full">
                          Start Kids Test
                        </NeumorphicButton>
                      </div>
                    </NeumorphicCard>
                  </motion.div>

                  {/* Adults Test */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <NeumorphicCard className="h-full hover:shadow-neu-xl transition-all duration-300">
                      <div className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-neu-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">Adults Test</h2>
                            <p className="text-sm text-muted-foreground">Advanced Learners</p>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 mb-6">
                          {["28 Questions covering advanced grammar", "Idioms, analogies, vocabulary, and sentence improvement", "Professional-level difficulty"].map((t) => (
                            <div key={t} className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{t}</p>
                            </div>
                          ))}
                        </div>
                        <NeumorphicButton variant="primary" onClick={() => setSelectedTest("adults")} className="w-full">
                          Start Adults Test
                        </NeumorphicButton>
                      </div>
                    </NeumorphicCard>
                  </motion.div>

                  {/* Leadership Test */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <NeumorphicCard className="h-full hover:shadow-neu-xl transition-all duration-300">
                      <div className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-neu-lg">
                            <Award className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-foreground">Leadership</h2>
                            <p className="text-sm text-muted-foreground">Style Assessment</p>
                          </div>
                        </div>
                        <div className="flex-1 space-y-2 mb-6">
                          {["60 Questions across 6 leadership dimensions", "Discover your dominant leadership style", "Psychometric self-assessment"].map((t) => (
                            <div key={t} className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">{t}</p>
                            </div>
                          ))}
                        </div>
                        <NeumorphicButton variant="primary" onClick={() => setSelectedTest("leadership")} className="w-full">
                          Start Leadership Test
                        </NeumorphicButton>
                      </div>
                    </NeumorphicCard>
                  </motion.div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => { signOut(auth); setUser(null); }}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Tests;