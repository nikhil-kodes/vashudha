"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UtensilsCrossed,
  Users,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const loggedInUser = await login({ email, password });
      const role = loggedInUser?.role;
      router.push(role === "ngo" ? "/ngo" : role === "corporate" ? "/dashboard" : "/donate");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError("");
    try {
      const loggedInUser = await login({ email, password });
      const role = loggedInUser?.role;
      router.push(role === "ngo" ? "/ngo" : role === "corporate" ? "/dashboard" : "/donate");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{ background: "#050805", minHeight: "100vh", color: "#f0faf0" }}
    >
      {/* Background effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(34,197,94,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-md mx-auto px-5 py-16 flex flex-col min-h-screen justify-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-12"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <Leaf size={20} style={{ color: "#22c55e" }} />
          </div>
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: "var(--font-bricolage)",
              letterSpacing: "-0.03em",
            }}
          >
            VASHUDHA
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-bricolage)" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "#86a886" }}>
              Sign in to continue rescuing food and earning carbon credits
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-3 mb-6 text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="text-[11px] uppercase tracking-wider font-medium block mb-1.5"
                style={{ color: "#86a886" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4a664a" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl text-sm outline-none"
                  style={{
                    padding: "12px 14px 12px 36px",
                    background: "#0d110d",
                    border: "1px solid rgba(34,197,94,0.12)",
                    color: "#f0faf0",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="text-[11px] uppercase tracking-wider font-medium block mb-1.5"
                style={{ color: "#86a886" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#4a664a" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl text-sm outline-none"
                  style={{
                    padding: "12px 40px 12px 36px",
                    background: "#0d110d",
                    border: "1px solid rgba(34,197,94,0.12)",
                    color: "#f0faf0",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#4a664a" }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-6"
              style={{
                background: isLoading
                  ? "#141a14"
                  : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: isLoading ? "#4a664a" : "#050805",
                cursor: isLoading ? "not-allowed" : "pointer",
                border: "none",
                boxShadow: isLoading
                  ? "none"
                  : "0 0 20px rgba(34,197,94,0.2)",
              }}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "#4a664a" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium"
              style={{ color: "#22c55e" }}
            >
              Register now
            </Link>
          </p>

          {/* Demo quick-login cards */}
          <div
            className="mt-10 pt-6"
            style={{ borderTop: "1px solid rgba(34,197,94,0.06)" }}
          >
            <p
              className="text-[10px] uppercase tracking-wider font-medium text-center mb-4"
              style={{ color: "#4a664a" }}
            >
              Quick Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Restaurant",
                  email: "pearl@hotel.com",
                  icon: UtensilsCrossed,
                  accent: "#22c55e",
                },
                {
                  label: "NGO",
                  email: "aashray@ngo.org",
                  icon: Users,
                  accent: "#3b82f6",
                },
                {
                  label: "Corporate",
                  email: "esg@tata.com",
                  icon: Building2,
                  accent: "#7c3aed",
                },
              ].map((demo) => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.email}
                    onClick={() => quickLogin(demo.email, "demo123")}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all"
                    style={{
                      background: "#0d110d",
                      border: "1px solid rgba(34,197,94,0.08)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon size={16} style={{ color: demo.accent }} />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: "#86a886" }}
                    >
                      {demo.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p
              className="text-center text-[10px] mt-2"
              style={{ color: "#4a664a" }}
            >
              Password for all demo accounts: demo123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
