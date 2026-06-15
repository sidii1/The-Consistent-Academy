import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createCCUser, getCCUser, type CCRole } from "@/lib/ccClub";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building2, Shield, Eye, EyeOff, Mic2 } from "lucide-react";

const ROLES: CCRole[] = [
  "Student",
  "President",
  "Vice President",
  "Team Leader",
  "Event Team",
  "Trainer Buddy",
];

const COLLEGES = ["iFEEL"];

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, icon, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label
      style={{
        fontSize: "0.78rem",
        fontWeight: 600,
        color: "var(--cc-text-muted)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {icon} {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "var(--cc-surface-inset)",
  boxShadow: "var(--cc-neu-inset-sm)",
  border: "none",
  color: "var(--cc-text)",
  fontSize: "0.92rem",
  outline: "none",
  transition: "box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const CCAuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("iFEEL");
  const [role, setRole] = useState<CCRole>("Student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // Login flow
        await signInWithEmailAndPassword(auth, email, password);
        const uid = auth.currentUser!.uid;
        const ccUser = await getCCUser(uid);
        if (!ccUser) {
          toast.error("No CC Club profile found for this account. Please sign up.");
          await auth.signOut();
          setIsLoading(false);
          return;
        }
        toast.success(`Welcome back, ${ccUser.name}!`);
        // onAuthStateChanged in ClubPage will handle the redirect
      } else {
        // Signup flow
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createCCUser(cred.user.uid, {
          name: name.trim(),
          email: email.toLowerCase(),
          college: college,
          club_role: role,
          current_level: 1,
          total_points: 0,
          badges: role !== "Student" ? [`${role} Badge`] : [],
        });
        toast.success(`Welcome to CC Club, ${name.trim()}! 🎉`);
        // onAuthStateChanged in ClubPage will handle the redirect
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, "")
          : "Authentication failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="cc-auth-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        background: "var(--cc-bg)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: "460px" }}
      >
        {/* Card — neumorphic extruded surface */}
        <div
          style={{
            borderRadius: "24px",
            padding: "2.5rem",
            background: "var(--cc-bg)",
            boxShadow: "var(--cc-neu-lg)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                background: "var(--cc-bg)",
                boxShadow: "var(--cc-neu-md), var(--cc-glow-purple-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <Mic2 size={26} color="var(--cc-accent)" strokeWidth={2.5} />
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--cc-text)",
                marginBottom: "4px",
              }}
            >
              {isLogin ? "Welcome Back" : "Join CC Club"}
            </h2>
            <p style={{ color: "var(--cc-text-muted)", fontSize: "0.88rem" }}>
              {isLogin
                ? "Sign in to access your dashboard"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Toggle tabs — inset well */}
          <div
            style={{
              display: "flex",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "1.75rem",
              gap: "4px",
              background: "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-inset-sm)",
            }}
          >
            {(["Sign In", "Sign Up"] as const).map((tab) => {
              const active = (tab === "Sign In") === isLogin;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setIsLogin(tab === "Sign In")}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "9px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
                    background: active ? "var(--cc-grad-accent)" : "transparent",
                    color: active ? "#F0EDFF" : "var(--cc-text-muted)",
                    boxShadow: active ? "var(--cc-neu-sm)" : "none",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-extra"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "1.1rem" }}
                >
                  {/* Name */}
                  <Field label="Full Name" icon={<User size={13} />}>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-md), var(--cc-glow-purple-sm)")}
                      onBlur={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-sm)")}
                    />
                  </Field>

                  {/* College */}
                  <Field label="College" icon={<Building2 size={13} />}>
                    <select
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-md), var(--cc-glow-purple-sm)")}
                      onBlur={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-sm)")}
                    >
                      {COLLEGES.map((c) => (
                        <option key={c} value={c} style={{ background: "var(--cc-bg)" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Role */}
                  <Field label="Role" icon={<Shield size={13} />}>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as CCRole)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-md), var(--cc-glow-purple-sm)")}
                      onBlur={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-sm)")}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} style={{ background: "var(--cc-bg)" }}>
                          {r} {r === "Student" ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <Field label="Email" icon={<Mail size={13} />}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-md), var(--cc-glow-purple-sm)")}
                onBlur={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-sm)")}
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={<Lock size={13} />}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-md), var(--cc-glow-purple-sm)")}
                  onBlur={(e) => (e.target.style.boxShadow = "var(--cc-neu-inset-sm)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--cc-text-faint)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="cc-btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
              }}
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Sign In →"
                : "Create Account →"}
            </button>
          </form>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--cc-text-faint)", marginTop: "1.25rem" }}>
            {isLogin ? "Not a member?" : "Already a member?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: "none",
                border: "none",
                color: "var(--cc-accent-bright)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.78rem",
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default CCAuthForm;
