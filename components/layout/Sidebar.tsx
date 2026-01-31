"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <aside className="w-56 bg-white/5 border-r border-white/10 min-h-screen p-4 hidden md:flex flex-col justify-between">
      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/dashboard" className="px-3 py-2 rounded-md text-white hover:bg-white/5">Overview</Link>
        <Link href="/dashboard/tasks" className="px-3 py-2 rounded-md text-white hover:bg-white/5">Tasks</Link>
        <Link href="/dashboard/ai" className="px-3 py-2 rounded-md text-white hover:bg-white/5">AI Assistant</Link>
        <Link href="/dashboard/profile" className="px-3 py-2 rounded-md text-white hover:bg-white/5">Profile</Link>
      </nav>

      <div className="pt-4">
        <div className="border-t border-white/10 mt-4 pt-4">
          <button
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              try {
                const res = await fetch("/api/auth/logout", { method: "POST" });
                if (res.ok) router.push("/auth/login");
                else console.error("Logout failed", await res.text());
              } catch (err) {
                console.error(err);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-white bg-white/3 hover:bg-white/5"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
