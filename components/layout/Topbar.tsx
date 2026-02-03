"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/40">
          ✺
        </div>
        <div className="text-lg font-semibold text-slate-50">TaskMind</div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="px-3 py-2 rounded-md border border-slate-500/70 text-slate-100 bg-slate-900/40 hover:bg-slate-100/5 text-sm transition"
        >
          Profile
        </Link>
      </div>
    </header>
  );
} 
