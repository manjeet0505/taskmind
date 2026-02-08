"use client";

import { useState, useEffect } from "react";
import { isAIEnabled } from "@/lib/ai-preferences";

interface WeeklySummaryData {
  summary: string;
  highlights: string[];
  suggestion: string;
}

const STORAGE_KEY = "taskmind_weekly_summary";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getWeekKey(): string {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  return `week-${weekStart.getTime()}`;
}

function getCachedSummary(): WeeklySummaryData | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (parsed.weekKey === getWeekKey() && parsed.data) {
      return parsed.data;
    }
    // Cache expired, clear it
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (e) {
    return null;
  }
}

function cacheSummary(data: WeeklySummaryData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ weekKey: getWeekKey(), data })
    );
  } catch (e) {
    // Ignore storage errors
  }
}

export default function WeeklySummary() {
  // Always start with server-safe state to avoid hydration mismatch (no localStorage on server)
  const [summary, setSummary] = useState<WeeklySummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mount, read from localStorage so server and first client render match
  useEffect(() => {
    setMounted(true);
    setSummary(getCachedSummary());
    setAiEnabled(isAIEnabled());
  }, []);

  // Listen for AI preference changes
  useEffect(() => {
    if (!mounted) return;
    const handleChange = () => setAiEnabled(isAIEnabled());
    window.addEventListener("aiPreferencesChanged", handleChange);
    return () => window.removeEventListener("aiPreferencesChanged", handleChange);
  }, [mounted]);

  const fetchSummary = async () => {
    if (!aiEnabled) {
      setError(true);
      return;
    }

    // Check cache first
    const cached = getCachedSummary();
    if (cached) {
      setSummary(cached);
      setExpanded(true);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const weekEnd = new Date();
      const res = await fetch("/api/ai/weekly-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ weekEnd: weekEnd.toISOString() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch summary");

      if (data.summary && Array.isArray(data.highlights)) {
        const summaryData: WeeklySummaryData = {
          summary: data.summary,
          highlights: data.highlights || [],
          suggestion: data.suggestion || "",
        };
        setSummary(summaryData);
        cacheSummary(summaryData);
        setExpanded(true);
      } else {
        throw new Error("Invalid summary format");
      }
    } catch (err) {
      console.error("Failed to fetch weekly summary:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Auto-expand if we have cached summary (client-only after hydration)
  useEffect(() => {
    if (mounted && summary && !expanded) {
      setExpanded(true);
    }
  }, [mounted, summary, expanded]);

  // Before mount, render the same "no summary" state as server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="p-4 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
            <p className="text-slate-500 text-xs mt-0.5">Reflect on your week</p>
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3 mb-3">Get insights about your progress.</p>
        <button
          disabled
          className="px-3 py-1.5 rounded-lg gradient-btn text-white text-xs font-medium opacity-50"
        >
          View Summary
        </button>
      </div>
    );
  }

  if (!aiEnabled) {
    return (
      <div className="p-4 glass-card">
        <div>
          <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
          <p className="text-slate-500 text-xs mt-0.5">AI is disabled</p>
        </div>
        <p className="text-slate-500 text-xs mt-3">
          Enable in <a href="/dashboard/ai-settings" className="text-indigo-400/90 hover:text-indigo-300">AI Settings</a> to view.
        </p>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="p-4 glass-card">
        <div>
          <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
        </div>
        <p className="text-slate-500 text-xs mt-3 mb-3">Not available right now.</p>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg gradient-btn text-white text-xs font-medium disabled:opacity-50"
        >
          {loading ? "…" : "Try again"}
        </button>
      </div>
    );
  }

  if (!summary && !loading) {
    return (
      <div className="p-4 glass-card">
        <div>
          <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
          <p className="text-slate-500 text-xs mt-0.5">Your week in review</p>
        </div>
        <p className="text-slate-500 text-xs mt-3 mb-3">Get insights about your progress.</p>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg gradient-btn text-white text-xs font-medium disabled:opacity-50"
        >
          {loading ? "…" : "View Summary"}
        </button>
      </div>
    );
  }

  if (loading && !summary) {
    return (
      <div className="p-4 glass-card">
        <div>
          <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
        </div>
        <p className="text-slate-500 text-xs mt-3">Generating…</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="p-4 glass-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-300 font-medium text-sm">Weekly summary</h3>
          <p className="text-slate-500 text-xs mt-0.5">Your week in review</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-500 hover:text-slate-300 text-xs transition"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-slate-700/30 fade-slide-up">
          <p className="text-slate-300 text-sm leading-relaxed">{summary.summary}</p>
          {summary.highlights && summary.highlights.length > 0 && (
            <div>
              <h4 className="text-slate-400 font-medium text-xs mb-1.5">Highlights</h4>
              <ul className="space-y-1">
                {summary.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-400 text-xs">
                    <span className="text-emerald-400/80 shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.suggestion && (
            <div>
              <h4 className="text-slate-400 font-medium text-xs mb-1">Suggestion</h4>
              <p className="text-slate-400 text-xs">{summary.suggestion}</p>
            </div>
          )}
          <button
            onClick={fetchSummary}
            disabled={loading}
            className="text-indigo-400/90 hover:text-indigo-300 text-xs font-medium disabled:opacity-50"
          >
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      )}
    </div>
  );
}
