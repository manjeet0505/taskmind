"use client";

import React from "react";
import { isAIEnabled, getAIPreferences } from "@/lib/ai-preferences";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "done";
  dueDate: string | null;
  category: string;
  tags: string[];
  createdAt: string | null;
}

/** AI suggestion: human-in-the-loop only. User must Apply or Ignore. */
export interface AISuggestion {
  actionType: string;
  targetTaskId: string;
  suggestedChange: Record<string, unknown>;
  reason: string;
}

/** Deadline risk API response (read-only early warning, no actions). */
interface DeadlineRiskState {
  overallRisk: "low" | "medium" | "high";
  warnings: Array<{ type: string; message: string; reason: string }>;
  note?: string;
  unavailable?: boolean;
}

interface AIAssistantProps {
  tasks: Task[];
  onTaskUpdated?: () => void;
}

export default function AIAssistant({ tasks, onTaskUpdated }: AIAssistantProps) {
  const [insights, setInsights] = React.useState<null | any>(null);
  const [insightsLoading, setInsightsLoading] = React.useState(false);
  const [aiEnabled, setAiEnabled] = React.useState(() => isAIEnabled());

  const [deadlineRisk, setDeadlineRisk] = React.useState<DeadlineRiskState | null>(null);
  const [deadlineRiskLoading, setDeadlineRiskLoading] = React.useState(false);

  const hasTasks = tasks && tasks.length > 0;

  // Listen for preference changes
  React.useEffect(() => {
    const handleChange = () => {
      setAiEnabled(isAIEnabled());
    };
    window.addEventListener("aiPreferencesChanged", handleChange);
    return () => window.removeEventListener("aiPreferencesChanged", handleChange);
  }, []);

  // Fetch deadline risk when user has tasks (read-only early warning)
  React.useEffect(() => {
    if (!hasTasks) {
      setDeadlineRisk(null);
      return;
    }
    let cancelled = false;
    setDeadlineRiskLoading(true);
    fetch("/api/ai/deadline-risk", { method: "GET", credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setDeadlineRisk({
          overallRisk: data.overallRisk ?? "low",
          warnings: Array.isArray(data.warnings) ? data.warnings : [],
          note: data.note,
          unavailable: data.unavailable === true,
        });
      })
      .catch(() => {
        if (!cancelled) setDeadlineRisk({ overallRisk: "low", warnings: [], unavailable: true });
      })
      .finally(() => {
        if (!cancelled) setDeadlineRiskLoading(false);
      });
    return () => { cancelled = true; };
  }, [hasTasks, tasks.length]);

  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ from: "user" | "assistant"; text: string }>>([]);
  const [chatLoading, setChatLoading] = React.useState(false);

  /** Pending AI suggestions (from chat or insights). Each has a client id for dismiss/apply. */
  const [pendingSuggestions, setPendingSuggestions] = React.useState<
    Array<{ id: string; suggestion: AISuggestion }>
  >([]);
  const [applyingId, setApplyingId] = React.useState<string | null>(null);

  const messagesRef = React.useRef<HTMLDivElement | null>(null);

  function addSuggestions(suggestions: AISuggestion[]) {
    if (!suggestions?.length) return;
    setPendingSuggestions((prev) => [
      ...prev,
      ...suggestions.map((s) => ({ id: `s-${Date.now()}-${Math.random().toString(36).slice(2)}`, suggestion: s })),
    ]);
  }

  function dismissSuggestion(id: string) {
    setPendingSuggestions((prev) => prev.filter((p) => p.id !== id));
  }

  async function applySuggestion(id: string, suggestion: AISuggestion) {
    setApplyingId(id);
    try {
      const res = await fetch("/api/ai/actions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          targetTaskId: suggestion.targetTaskId,
          suggestedChange: suggestion.suggestedChange,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to apply");
      dismissSuggestion(id);
      onTaskUpdated?.();
    } catch (e) {
      console.error("Apply action failed:", e);
      alert((e as Error)?.message ?? "Failed to apply suggestion");
    } finally {
      setApplyingId(null);
    }
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    if (!aiEnabled) {
      setMessages((m) => [...m, { from: "assistant", text: "AI assistance is disabled. Enable it in AI Settings to use chat." }]);
      setChatInput("");
      return;
    }
    const userText = chatInput.trim();
    setMessages((m) => [...m, { from: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ message: userText }),
      });
      const raw = await res.text();
      if (!res.ok) {
        setMessages((m) => [...m, { from: "assistant", text: "I'm unable to answer right now. Please try again." }]);
        return;
      }
      let text: string;
      let suggestions: AISuggestion[] = [];
      try {
        const parsed = JSON.parse(raw) as { text?: string; suggestions?: AISuggestion[] };
        text = typeof parsed?.text === "string" ? parsed.text : raw;
        if (Array.isArray(parsed?.suggestions)) addSuggestions(parsed.suggestions);
      } catch {
        text = raw;
      }
      setMessages((m) => [...m, { from: "assistant", text: text || "I'm unable to answer right now." }]);
    } catch (e) {
      console.error("Chat request failed", e);
      setMessages((m) => [...m, { from: "assistant", text: "I'm unable to answer right now. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // Auto-scroll messages container when new messages arrive
  React.useEffect(() => {
    try {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    } catch (e) {
      // silent
    }
  }, [messages]);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const highPriorityTasks = tasks.filter((t) => t.priority === "high");
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "done";
  });

  const suggestions = generateSuggestions(tasks, pendingTasks, highPriorityTasks, overdueTasks);

  async function fetchInsights() {
    if (!aiEnabled) {
      setInsights({ summary: "AI assistance is disabled. Enable it in AI Settings to get insights." });
      return;
    }
    try {
      setInsightsLoading(true);
      setInsights(null);
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch insights");
      setInsights(data);
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        addSuggestions(data.suggestions);
      }
      // Track how often the user views AI insights (frontend only)
      try {
        const key = "taskmind_ai_insights_viewed";
        const raw = window.localStorage.getItem(key);
        const current = raw != null ? parseInt(raw, 10) : 0;
        const next = Number.isNaN(current) ? 1 : current + 1;
        window.localStorage.setItem(key, String(next));
      } catch {
        // ignore storage errors
      }
    } catch (err: any) {
      console.error(err);
      setInsights({ summary: "No insights available today" });
    } finally {
      setInsightsLoading(false);
    }
  }
  return (
    <div className="space-y-6">
      {/* Compact header for the AI column */}
      <div className="mb-2">
        <h4 className="ai-heading font-semibold">Assistant</h4>
        <p className="text-slate-300/80 text-xs">Daily briefing and task-aware chat</p>
      </div>

      {/* Deadline Risk — read-only early warning, no actions */}
      <div className="p-4 glass-card fade-slide-up card-hover">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl" aria-hidden>⏱</span>
          <div>
            <h4 className="ai-heading font-semibold text-sm">Deadline Risk</h4>
            <p className="text-slate-400 text-xs">Early-warning only · no changes to your tasks</p>
          </div>
        </div>
        {deadlineRiskLoading ? (
          <p className="text-slate-400 text-sm">Checking deadlines…</p>
        ) : deadlineRisk?.unavailable ? (
          <p className="text-slate-400 text-sm">Deadline risk analysis is unavailable right now.</p>
        ) : !deadlineRisk ? (
          <p className="text-slate-400 text-sm">Add tasks with due dates to see risk insights.</p>
        ) : deadlineRisk.warnings.length === 0 ? (
          <p className="text-slate-100 text-sm">Your deadlines look manageable.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  deadlineRisk.overallRisk === "high"
                    ? "bg-amber-500/20 text-amber-200"
                    : deadlineRisk.overallRisk === "medium"
                    ? "bg-amber-500/15 text-amber-100"
                    : "bg-slate-600/40 text-slate-300"
                }`}
              >
                {deadlineRisk.overallRisk} risk
              </span>
            </div>
            <ul className="space-y-2">
              {deadlineRisk.warnings.slice(0, 3).map((w, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-600/40">
                  <p className="text-slate-100 text-sm font-medium">{w.message}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{w.reason}</p>
                </li>
              ))}
            </ul>
            {deadlineRisk.note && (
              <p className="text-slate-400 text-xs border-t border-slate-700/60 pt-2">{deadlineRisk.note}</p>
            )}
          </div>
        )}
      </div>

      {/* AI Insights — gradient-tinted card with glow */}
      <div className="p-4 glass-card-strong fade-slide-up card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="ai-icon-glow">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h4 className="ai-heading font-semibold text-sm">AI Insights for Today</h4>
              <p className="ai-heading-subtle text-xs">Based on your current tasks</p>
            </div>
          </div>
          <div>
            <button
              aria-label="Get AI Insights"
              onClick={fetchInsights}
              disabled={!hasTasks || insightsLoading || !aiEnabled}
              className="px-3 py-1.5 rounded-full gradient-btn btn-hover-glow transition-smooth text-white text-[11px] font-semibold disabled:opacity-40"
            >
              {insightsLoading ? "Thinking..." : "Get AI Insights"}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <div>
            {insights ? (
              <p className="text-slate-100 text-sm truncate-ellipsis">{insights.summary}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-300/90 text-sm">
                  AI insights help you decide what to focus on today. You can request them anytime—they&apos;re optional.
                </p>
                {!aiEnabled ? (
                  <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-600/40">
                    <p className="text-slate-300 text-xs mb-2">
                      AI assistance is disabled. Enable it in{" "}
                      <a href="/dashboard/ai-settings" className="text-indigo-400 hover:text-indigo-300 underline">
                        AI Settings
                      </a>{" "}
                      to get insights.
                    </p>
                  </div>
                ) : (
                  <button
                    aria-label="Get AI Insights"
                    onClick={fetchInsights}
                    disabled={!hasTasks || insightsLoading}
                    className="px-3 py-2 rounded-lg gradient-btn btn-hover-glow transition-smooth text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {insightsLoading ? "Thinking…" : "Get AI Insights"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Short focus list: max 2 items (muted) */}
          {insights && insights.focusTasks && insights.focusTasks.length > 0 && (
            <ul className="text-xs text-slate-200 list-disc list-inside mt-2 space-y-1.5">
              {insights.focusTasks.slice(0, 2).map((f: any, i: number) => (
                <li key={`focus-${i}`}>{f.title}{f.reason && <div className="text-xs text-slate-500 mt-0.5">{f.reason}</div>}</li>
              ))}
              {insights.focusTasks.length > 2 && (
                <li className="text-[11px] text-slate-300/70">
                  +{insights.focusTasks.length - 2} more
                </li>
              )}
            </ul>
          )}

          {/* Minimal warnings & tip (muted) */}
          {insights && insights.warnings && insights.warnings.length > 0 && (
            <div className="mt-2 text-[11px] text-amber-200/90">
              Warnings: {insights.warnings.slice(0, 2).join(" • ")}
            </div>
          )}
          {insights && insights.productivityTip && (
            <div className="mt-2 text-[11px] text-slate-200/80">
              Tip: {insights.productivityTip}
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions — optional, user must Apply or Ignore */}
      <div className="space-y-2">
        <h4 className="ai-heading-subtle font-semibold text-xs uppercase tracking-wider">
          AI suggests
        </h4>
        {pendingSuggestions.length === 0 ? (
          <p className="text-slate-400 text-xs py-2 px-1">
            No AI suggestions right now. Your tasks look well organized.
          </p>
        ) : (
          pendingSuggestions.map(({ id, suggestion }) => {
            const task = tasks.find((t) => t.id === suggestion.targetTaskId);
            const taskTitle = task?.title ?? "Task";
            const changeSummary = Object.entries(suggestion.suggestedChange)
              .map(([k, v]) => `${k}: ${String(v)}`)
              .join(", ");
            return (
              <div
                key={id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-600/60 text-sm"
              >
                <p className="text-slate-200 mb-1.5">{suggestion.reason}</p>
                <p className="text-slate-400 text-xs mb-2">
                  <span className="font-medium text-slate-300">{taskTitle}</span>
                  {changeSummary && ` · ${changeSummary}`}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applySuggestion(id, suggestion)}
                    disabled={applyingId === id}
                    className="px-2.5 py-1.5 rounded-lg gradient-btn btn-hover-glow transition-smooth text-white text-xs font-medium disabled:opacity-60"
                  >
                    {applyingId === id ? "Applying…" : "Apply"}
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissSuggestion(id)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-500/60 text-slate-300 text-xs hover:bg-slate-700/50 transition-smooth"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="my-4 border-t border-slate-700/60" />

      {/* AI Chat — conversation mode (soft gradient glass card) */}
      <div className="p-4 glass-card fade-slide-up flex flex-col card-hover">
        <h4 className="ai-heading font-semibold mb-1.5">AI Chat</h4>
        <div className="text-xs text-slate-300/85 mb-3">
          Ask about priorities, focus windows, or what to ship next. The assistant only uses your
          task data.
        </div>

        <div ref={messagesRef} className="max-h-56 overflow-y-auto mb-3 space-y-3 p-1.5 pr-1">
          {messages.length === 0 ? (
            <div className="space-y-2">
              <p className="text-slate-400 text-xs mb-2">Try asking:</p>
              {[
                "What should I work on today?",
                "Which tasks are overdue?",
                "Help me plan my day",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setChatInput(prompt)}
                  className="block w-full text-left px-3 py-2 rounded-lg border border-slate-600/60 text-slate-200 text-xs hover:bg-slate-700/40 transition-smooth"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`inline-block px-3 py-2 rounded-2xl ${
                    m.from === "user" ? "msg-user" : "msg-ai"
                  } max-w-[40ch] wrap-break-word leading-relaxed message-pop text-xs`}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <input 
            aria-label="Ask the assistant" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }} 
            disabled={chatLoading || !hasTasks || !aiEnabled} 
            placeholder={
              !aiEnabled 
                ? "Enable AI in Settings to use chat" 
                : hasTasks 
                ? "Ask about your tasks (e.g. 'What should I focus on today?')" 
                : "Create tasks to enable chat"
            } 
            className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-gray-200 disabled:opacity-50" 
          />
          <button
            onClick={sendChat}
            disabled={!hasTasks || chatLoading || !aiEnabled}
            className="px-3 py-2 rounded-xl gradient-btn btn-hover-glow transition-smooth text-white text-sm disabled:opacity-50"
          >
            {chatLoading ? "…" : "Send"}
          </button>
        </div>

        {/* Disclaimer moved to bottom of the card */}
        <div className="mt-3 text-[10px] text-slate-300/70">
          Note: The assistant only reads your tasks and will never write to your data automatically.
        </div>
      </div>


    </div>
  );
}

function generateSuggestions(
  tasks: Task[],
  pendingTasks: Task[],
  highPriorityTasks: Task[],
  overdueTasks: Task[]
) {
  const suggestions: Array<{ icon: string; text: string }> = [];

  // Suggestion 1: Start with high priority
  if (highPriorityTasks.length > 0) {
    suggestions.push({
      icon: "🎯",
      text: `Start with "${highPriorityTasks[0].title}" - it's marked as high priority and needs your attention first.`,
    });
  }

  // Suggestion 2: Time blocking
  const tasksToday = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate).toDateString();
    const today = new Date().toDateString();
    return dueDate === today;
  });

  if (tasksToday.length > 0) {
    suggestions.push({
      icon: "⏱️",
      text: `You have ${tasksToday.length} task(s) due today. Block 2-3 hours to complete them.`,
    });
  }

  // Suggestion 3: Break down complex tasks
  const complexTasks = tasks.filter((t) => t.description.length > 100 && t.status !== "done");
  if (complexTasks.length > 0) {
    suggestions.push({
      icon: "🔄",
      text: `"${complexTasks[0].title}" looks complex. Consider breaking it into 2-3 smaller tasks for better focus.`,
    });
  }

  // Suggestion 4: Clear completed tasks
  const completedCount = tasks.filter((t) => t.status === "done").length;
  if (completedCount > 0) {
    suggestions.push({
      icon: "✨",
      text: `You've completed ${completedCount} task(s)! Keep up the momentum by tackling the next pending item.`,
    });
  }

  // Suggestion 5: Schedule smart
  if (pendingTasks.length > 3) {
    suggestions.push({
      icon: "📅",
      text: `You have ${pendingTasks.length} pending tasks. Spread them across the next few days for sustainable progress.`,
    });
  }

  // Default suggestion if no others apply
  if (suggestions.length === 0) {
    suggestions.push({
      icon: "👋",
      text: "Start by creating a task. Break down your goals into actionable steps!",
    });
  }

  return suggestions.slice(0, 4);
}
