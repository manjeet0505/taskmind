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
  const [summary, setSummary] = useState<WeeklySummaryData | null>(getCachedSummary());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(() => isAIEnabled());
  const [expanded, setExpanded] = useState(false);

  // Listen for AI preference changes
  useEffect(() => {
    const handleChange = () => {
      setAiEnabled(isAIEnabled());
    };
    window.addEventListener("aiPreferencesChanged", handleChange);
    return () => window.removeEventListener("aiPreferencesChanged", handleChange);
  }, []);

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

  // Auto-expand if we have cached summary
  useEffect(() => {
    if (summary && !expanded) {
      setExpanded(true);
    }
  }, [summary, expanded]);

  if (!aiEnabled) {
    return (
      <div className="p-6 rounded-xl glass-card border border-slate-700/50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-1">Weekly AI Reflection</h3>
            <p className="text-slate-300 text-sm">AI assistance is disabled</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3">
          Enable AI in{" "}
          <a href="/dashboard/ai-settings" className="text-indigo-400 hover:text-indigo-300 underline">
            AI Settings
          </a>{" "}
          to view your weekly summary.
        </p>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="p-6 rounded-xl glass-card border border-slate-700/50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-1">Weekly AI Reflection</h3>
            <p className="text-slate-300 text-sm">Reflect on your week</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3 mb-4">
          Your weekly summary is not available right now.
        </p>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Try Again"}
        </button>
      </div>
    );
  }

  if (!summary && !loading) {
    return (
      <div className="p-6 rounded-xl glass-card border border-slate-700/50 card-hover">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-1">Weekly AI Reflection</h3>
            <p className="text-slate-300 text-sm">Reflect on your productivity this week</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3 mb-4">
          Get insights about your task management patterns and progress.
        </p>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Generating..." : "View Weekly Summary"}
        </button>
      </div>
    );
  }

  if (loading && !summary) {
    return (
      <div className="p-6 rounded-xl glass-card border border-slate-700/50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-50 mb-1">Weekly AI Reflection</h3>
            <p className="text-slate-300 text-sm">Reflect on your week</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-3">Generating your weekly summary...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="p-6 rounded-xl glass-card border border-indigo-500/20 bg-indigo-500/5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50 mb-1">Weekly AI Reflection</h3>
          <p className="text-slate-300 text-sm">Your week in review</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-200 transition text-sm"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 fade-slide-up">
          {/* Summary */}
          <div>
            <p className="text-slate-200 leading-relaxed">{summary.summary}</p>
          </div>

          {/* Highlights */}
          {summary.highlights && summary.highlights.length > 0 && (
            <div>
              <h4 className="text-slate-50 font-medium mb-2 text-sm">Highlights</h4>
              <ul className="space-y-2">
                {summary.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestion */}
          {summary.suggestion && (
            <div className="pt-3 border-t border-slate-700/50">
              <h4 className="text-slate-50 font-medium mb-2 text-sm">Suggestion</h4>
              <p className="text-slate-300 text-sm">{summary.suggestion}</p>
            </div>
          )}

          {/* Refresh button */}
          <div className="pt-2">
            <button
              onClick={fetchSummary}
              disabled={loading}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh Summary"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
