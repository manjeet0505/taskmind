"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

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

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/ai-settings", label: "Settings" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 z-30 hidden md:flex flex-col justify-between p-4">
      {/* Unified glass background matching navbar — blends into page */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/85 via-indigo-950/80 to-slate-900/85 backdrop-blur-xl border-r border-indigo-500/10 shadow-[0_0_40px_rgba(79,70,229,0.1)]" />
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-violet-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-cyan-500/15 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col justify-between h-full">
        <nav className="flex flex-col gap-1.5 text-sm pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-3 py-2.5 rounded-xl text-slate-200 transition-all duration-200 ${
                  isActive
                    ? "text-white bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    : "hover:bg-indigo-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                }`}
              >
                {/* Active state gradient bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b from-violet-400 to-cyan-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4">
          <div className="border-t border-indigo-500/20 mt-4 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 border border-slate-600/50 bg-slate-800/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-200 transition-all duration-200 hover:shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
