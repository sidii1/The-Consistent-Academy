import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

 const params = new URLSearchParams(location.search);
const redirect = params.get("redirect") || "/";
navigate(`/${redirect}`);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(`/${redirect}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <form
        onSubmit={handleLogin}
        className="bg-card p-8 rounded-3xl shadow-neu-xl space-y-4 w-96"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl bg-secondary/20"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl bg-secondary/20"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;