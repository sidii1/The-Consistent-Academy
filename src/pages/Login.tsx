import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdTokenResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }
      // Check custom claims to determine if admin
      const tokenResult = await getIdTokenResult(auth.currentUser!, true);
      if (tokenResult.claims.admin) {
        navigate("/admin/blogs");
      } else {
        navigate(redirect ? `/${redirect}` : "/");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-center mb-2">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg">
              {isRegistering ? (
                <UserPlus className="w-8 h-8 text-white" />
              ) : (
                <LogIn className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isRegistering
                ? "Register to get started"
                : "Sign in to continue"}
            </p>
          </div>

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
              className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all"
            />
          </div>

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
              className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition-all disabled:opacity-50"
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
              onClick={() => setIsRegistering(!isRegistering)}
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