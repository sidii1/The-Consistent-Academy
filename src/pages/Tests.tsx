import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDoc,
  collection,
  serverTimestamp,
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
  TrendingUp
} from "lucide-react";

import { db, auth } from "@/lib/firebase";
import { kidsTestData, adultsTestData } from "@/lib/testData";
import { leadershipTestData } from "@/lib/leadershipTestData";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { Navbar } from "@/components/layout/Navbar";
import TestInterface from "@/components/TestInterface";
import LeadershipTestInterface from "@/components/LeadershipTestInterface";

/* ------------------------------------------------ */
/* -------------------- MAIN PAGE ------------------ */
/* ------------------------------------------------ */

const Tests = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [selectedTest, setSelectedTest] = useState<"kids" | "adults" | "leadership" | null>(null);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    signOut(auth);
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setAuthError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const cred = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      setUser(cred.user);
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  // Test Interface with Firebase Integration
  if (selectedTest && user) {
    // Leadership test uses different interface
    if (selectedTest === "leadership") {
      return (
        <div className="min-h-screen pt-24 px-4">
          <LeadershipTestInterface
            testData={leadershipTestData}
            onBackToSelection={() => setSelectedTest(null)}
            onTestComplete={async ({ scores, dominantStyle, secondaryStyle }) => {
              console.log("🔥 LEADERSHIP TEST COMPLETE", {
                dominantStyle,
                secondaryStyle,
                scores,
                user: user.email,
              });

              try {
                const docRef = await addDoc(collection(db, "leadershipResults"), {
                  userId: user.uid,
                  testType: "leadership",
                  dominantStyle,
                  secondaryStyle,
                  scores,
                  createdAt: serverTimestamp(),
                });
                console.log("✅ Leadership results saved, doc ID:", docRef.id);
              } catch (err) {
                console.error("❌ Firestore write FAILED:", err);
              }
            }}
          />
        </div>
      );
    }

    // Grammar tests
    const testData = selectedTest === "kids" ? kidsTestData : adultsTestData;
    
    return (
      <div className="min-h-screen pt-24 px-4">
      <TestInterface
        testData={testData}
        onBackToSelection={() => setSelectedTest(null)}
onTestComplete={async ({ attempted, correct, wrong }) => {
  console.log("🔥 TEST COMPLETE CALLBACK FIRED", {
    attempted,
    correct,
    wrong,
    user: user.email,
    testType: selectedTest,
  });

  try {
    const docRef = await addDoc(collection(db, "testResults"), {
  userId: user.uid,
  testType: selectedTest,
  score: correct,
  total: attempted,
  percentage: Math.round((correct / attempted) * 100),
  createdAt: serverTimestamp(),
});


    console.log("✅ Firestore write success, doc ID:", docRef.id);
  } catch (err) {
    console.error("❌ Firestore write FAILED:", err);
  }
}}

      />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!user ? (
            // Login/Register Screen
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
                <div className="p-6 md:p-6 space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {authError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      {authError}
                    </motion.p>
                  )}

                  {/* Submit Button */}
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

                  {/* Toggle Auth Mode */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setAuthError("");
                      }}
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
            // Test Selection Screen
            <motion.div
              key="test-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              {/* Welcome Header */}
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

              {/* Test Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Kids Test Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
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

                      <div className="flex-1 space-y-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              <strong className="text-foreground">25 Questions</strong> covering basic grammar concepts
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Fill in the blanks, analogies, synonyms, and more
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Age-appropriate difficulty level
                            </p>
                          </div>
                        </div>
                      </div>

                      <NeumorphicButton
                        variant="primary"
                        onClick={() => setSelectedTest("kids")}
                        className="w-full"
                      >
                        Start Kids Test
                      </NeumorphicButton>
                    </div>
                  </NeumorphicCard>
                </motion.div>

                {/* Adults Test Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
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

                      <div className="flex-1 space-y-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              <strong className="text-foreground">28 Questions</strong> covering advanced grammar
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Idioms, analogies, vocabulary, and sentence improvement
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Professional-level difficulty
                            </p>
                          </div>
                        </div>
                      </div>

                      <NeumorphicButton
                        variant="primary"
                        onClick={() => setSelectedTest("adults")}
                        className="w-full"
                      >
                        Start Adults Test
                      </NeumorphicButton>
                    </div>
                  </NeumorphicCard>
                </motion.div>

                {/* Leadership Test Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
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

                      <div className="flex-1 space-y-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              <strong className="text-foreground">60 Questions</strong> across 6 leadership dimensions
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Discover your dominant leadership style
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Psychometric self-assessment
                            </p>
                          </div>
                        </div>
                      </div>

                      <NeumorphicButton
                        variant="primary"
                        onClick={() => setSelectedTest("leadership")}
                        className="w-full"
                      >
                        Start Leadership Test
                      </NeumorphicButton>
                    </div>
                  </NeumorphicCard>
                </motion.div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    signOut(auth);
                    setUser(null);
                  }}
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
