import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdTokenResult,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, User, Building2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    if (isRegistering && !name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (isRegistering && !company.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save name + company to Firestore users collection
        await setDoc(doc(db, "users", uid), {
          name: name.trim(),
          company: company.trim(),
          email: email.toLowerCase().trim(),
          createdAt: new Date(),
        });

        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }

      const tokenResult = await getIdTokenResult(auth.currentUser!, true);
      if (tokenResult.claims.admin) {
        navigate(redirect === "admin" ? "/admin" : "/admin/blogs");
      } else {
        navigate(redirect ? `/${redirect}` : "/");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering((prev) => !prev);
    setName("");
    setCompany("");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/50";

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 rounded-3xl shadow-neu-xl space-y-5"
          >
            {/* Icon + Title */}
            <div className="text-center mb-2">
              <motion.div
                key={isRegistering ? "reg" : "login"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
              >
                {isRegistering ? (
                  <UserPlus className="w-8 h-8 text-white" />
                ) : (
                  <LogIn className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {isRegistering ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isRegistering ? "Register to get started" : "Sign in to continue"}
              </p>
            </div>

            {/* Registration-only fields */}
            <AnimatePresence>
              {isRegistering && (
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
                      <User className="w-4 h-4 text-primary" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegistering}
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
                      required={isRegistering}
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
                required
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
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition-all disabled:opacity-50 font-semibold"
            >
              {isLoading
                ? "Please wait..."
                : isRegistering
                ? "Create Account"
                : "Login"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-semibold hover:underline"
              >
                {isRegistering ? "Login" : "Register"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Login;