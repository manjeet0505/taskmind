"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Login</h1>
      <p className="text-slate-700 mb-6">Sign in to access your dashboard</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900" />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900" />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
              <button disabled={loading} className="px-6 py-3 rounded-lg bg-indigo-600 text-white">{loading ? "Signing in..." : "Sign in"}</button>
          <Link href="/auth/signup" className="text-sm text-slate-700">Create account</Link>
        </div>
      </form>
    </div>
  );
}
