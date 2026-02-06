"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { AIPreferences } from "@/lib/ai-preferences";
import { getAIPreferences } from "@/lib/ai-preferences";
import LogoutButton from "@/components/LogoutButton";

type TaskStatus = "pending" | "in-progress" | "done";

interface TaskSummary {
  id: string;
  status: TaskStatus;
}

interface ActivityStats {
  tasksCreated: number;
  tasksCompleted: number;
  insightsViewed: number;
}

interface ProfileClientProps {
  name: string;
  email: string;
  createdAtISO: string | null;
}

const INSIGHTS_VIEWED_KEY = "taskmind_ai_insights_viewed";

export default function ProfileClient({ name, email, createdAtISO }: ProfileClientProps) {
  const [aiPrefs, setAiPrefs] = useState<AIPreferences | null>(null);
  const [activity, setActivity] = useState<ActivityStats>({
    tasksCreated: 0,
    tasksCompleted: 0,
    insightsViewed: 0,
  });
  const [activityLoading, setActivityLoading] = useState(true);

  const createdAtFormatted = useMemo(() => {
    if (!createdAtISO) return "Unknown";
    try {
      const d = new Date(createdAtISO);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  }, [createdAtISO]);

  // Load AI preferences
  useEffect(() => {
    try {
      setAiPrefs(getAIPreferences());
    } catch {
      // ignore
    }

    const handleChange = (e: Event) => {
      try {
        const custom = e as CustomEvent<AIPreferences>;
        if (custom.detail) {
          setAiPrefs(custom.detail);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("aiPreferencesChanged", handleChange as EventListener);
    return () => window.removeEventListener("aiPreferencesChanged", handleChange as EventListener);
  }, []);

  // Load activity snapshot (frontend-only)
  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        setActivityLoading(true);
        const res = await fetch("/api/tasks", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load tasks");
        const data = await res.json();
        const tasks: TaskSummary[] = (data.tasks || []).map((t: any) => ({
          id: t.id,
          status: t.status as TaskStatus,
        }));

        let insightsViewed = 0;
        try {
          const raw = window.localStorage.getItem(INSIGHTS_VIEWED_KEY);
          const parsed = raw != null ? parseInt(raw, 10) : 0;
          insightsViewed = Number.isNaN(parsed) ? 0 : parsed;
        } catch {
          insightsViewed = 0;
        }

        if (!cancelled) {
          setActivity({
            tasksCreated: tasks.length,
            tasksCompleted: tasks.filter((t) => t.status === "done").length,
            insightsViewed,
          });
        }
      } catch {
        if (!cancelled) {
          setActivity({
            tasksCreated: 0,
            tasksCompleted: 0,
            insightsViewed: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setActivityLoading(false);
        }
      }
    }

    loadActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  const aiEnabled = aiPrefs?.enabled ?? true;
  const insightsFrequency = aiPrefs?.insightsFrequency ?? "manual";

  const initials = useMemo(() => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  }, [name]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile hero — premium account presence */}
      <section className="section-spacing-lg p-6 md:p-10 glass-card-strong card-hover relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-linear-to-tr from-indigo-500/40 via-violet-500/30 to-cyan-400/40 blur-3xl float-slow" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-linear-to-tr from-sky-400/25 via-emerald-400/20 to-indigo-500/20 blur-3xl float-slow" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Avatar with animated ring */}
            <div className="relative">
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[2px] animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-950/80 flex items-center justify-center text-2xl md:text-3xl font-semibold text-slate-50">
                  {initials}
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-page-title text-2xl md:text-4xl text-slate-50 tracking-tight">
                {name || "Your workspace"}
              </h1>
              <p className="text-body text-sm md:text-base mt-2">
                Your AI-assisted productivity workspace
              </p>
              <div className="mt-3 h-px w-12 bg-indigo-500/40 rounded-full" />
              <p className="text-slate-400 text-xs md:text-sm mt-3">
                Member since {createdAtFormatted}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-slate-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AI workspace active
            </span>
            <p className="text-slate-400 text-xs md:text-sm">
              Signed in as <span className="text-slate-200">{email}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Two-column layout: AI status + activity snapshot */}
      <div className="grid md:grid-cols-2 gap-6 section-spacing-lg">
        {/* AI Assistant Status */}
        <section className="p-6 glass-card card-hover space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-section-title text-sm text-slate-50 tracking-[0.16em] uppercase ai-heading-subtle">
                AI Assistant Status
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Overview of how AI currently supports your workspace.
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                aiEnabled
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/50"
                  : "bg-slate-800 text-slate-300 border border-slate-600/70"
              }`}
            >
              {aiEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Insights frequency</span>
              <span className="text-slate-100 font-medium">
                {insightsFrequency === "daily" ? "Daily" : "Manual"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Response style</span>
              <span className="text-slate-100 font-medium capitalize">
                {aiPrefs?.responseStyle === "detailed" ? "Detailed" : "Short & concise"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/30 text-xs text-slate-300 leading-relaxed">
            AI only reads your tasks and related metadata. It never changes your data automatically, and
            every action requires your approval.
          </div>
        </section>

        {/* Activity snapshot */}
        <section className="p-6 glass-card card-hover space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-section-title text-sm text-slate-50 tracking-[0.16em] uppercase">
                Activity Snapshot
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                A quick view of how you&apos;ve been using TaskMind.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Tasks created
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {activityLoading ? "–" : activity.tasksCreated}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Tasks completed
              </p>
              <p className="text-2xl font-semibold text-emerald-300">
                {activityLoading ? "–" : activity.tasksCompleted}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                AI insights viewed
              </p>
              <p className="text-2xl font-semibold text-indigo-300">
                {activityLoading ? "–" : activity.insightsViewed}
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-xs mt-3">
            These numbers are a lightweight snapshot to help you reflect on how you use TaskMind. They
            are for your awareness, not for scoring or judgment.
          </p>
        </section>
      </div>

      {/* Account actions — intentional buttons */}
      <section className="section-spacing p-6 md:p-7 glass-card card-hover space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-section-title text-sm text-slate-50 tracking-[0.16em] uppercase">
              Account Actions
            </h2>
            <p className="text-body text-xs mt-1.5 max-w-md">
              You remain in control of your data, sessions, and how AI participates in your workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/ai-settings"
              className="px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-slate-100 text-sm font-medium hover:bg-indigo-500/25 hover:border-indigo-400/50 transition-smooth hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              Open AI Settings
            </Link>
            <LogoutButton />
          </div>
        </div>
      </section>
    </div>
  );
}

