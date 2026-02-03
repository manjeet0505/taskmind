"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      // Do NOT auto-login on signup — force user to sign in
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/30 ring-2 ring-white/20">
          ✦
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-slate-400 text-sm">Get your AI-powered workspace in one step</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Name</label>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/60 border border-slate-500/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition"
          />
        </div>
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
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-300 hover:text-white font-medium transition">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
