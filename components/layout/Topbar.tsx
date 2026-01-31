"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 bg-transparent">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">✓</div>
        <div className="text-lg font-semibold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TaskMind</div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/profile" className="px-3 py-2 rounded-md bg-white/5 text-white">Profile</Link>
      </div>
    </header>
  );
}
