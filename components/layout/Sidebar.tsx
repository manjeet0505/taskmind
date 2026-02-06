"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        // Full reload so cookie is gone and middleware sees unauthenticated state
        window.location.href = "/auth/login";
        return;
      }
      console.error("Logout failed", await res.text());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-60 bg-transparent border-r border-slate-800/70 min-h-screen p-4 hidden md:flex flex-col justify-between glass-card">
      <nav className="flex flex-col gap-1.5 text-sm">
        <Link href="/dashboard" className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-100/5 hover:text-white transition">
          Dashboard
        </Link>
        <Link href="/dashboard/ai-settings" className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-100/5 hover:text-white transition">
          Settings
        </Link>
        <Link href="/dashboard/profile" className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-100/5 hover:text-white transition">
          Profile
        </Link>
      </nav>

      <div className="pt-4">
        <div className="border-t border-slate-700/60 mt-4 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-200 border border-slate-600/70 bg-slate-900/40 hover:bg-slate-100/5 transition"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
