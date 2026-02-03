"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      // Full-page redirect so the browser sends the new cookie and middleware allows dashboard
      window.location.href = "/dashboard";
      return;
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
          ✦
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your AI workspace</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
          <input
            placeholder="you@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/60 border border-slate-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
          <input
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/60 border border-slate-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
          />
        </div>

        {error && (
          <div className="py-2.5 px-3 rounded-lg bg-red-500/15 border border-red-400/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl gradient-btn text-white font-semibold disabled:opacity-60 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-slate-400 text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-300 hover:text-white font-medium transition">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
