"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-16 z-20 flex items-center justify-between px-4 md:px-6 py-0">
      {/* Unified glass background matching sidebar — blends into page */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/85 via-indigo-950/80 to-slate-900/85 backdrop-blur-xl border-b border-indigo-500/10 shadow-[0_2px_20px_rgba(79,70,229,0.1)]" />
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-full bg-linear-to-r from-violet-500/20 via-transparent to-transparent" />
      </div>

      <div className="relative flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-400/30 transition-all duration-200 group-hover:shadow-indigo-500/60 group-hover:ring-indigo-400/50">
            ✺
          </div>
          <span className="text-lg font-semibold text-slate-50 tracking-tight group-hover:text-white transition-colors duration-200">TaskMind</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="relative px-4 py-2 rounded-xl border border-indigo-500/30 text-slate-100 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/50 text-sm font-medium transition-all duration-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
} 
