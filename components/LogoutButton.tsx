"use client";

import { useState } from "react";

export default function LogoutButton() {
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
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 rounded-xl bg-red-500/90 hover:bg-red-400 text-white text-sm font-medium transition disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

