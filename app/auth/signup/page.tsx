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
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Create account</h1>
      <p className="text-slate-600 mb-6">Create an account to get started</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900" />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900" />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? "Creating..." : "Create account"}</button>
          <Link href="/auth/login" className="text-sm text-slate-600">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
