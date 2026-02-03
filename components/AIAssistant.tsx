"use client";

import React from "react";

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

interface AIAssistantProps {
  tasks: Task[];
}

export default function AIAssistant({ tasks }: AIAssistantProps) {
  const [insights, setInsights] = React.useState<null | any>(null);
  const [insightsLoading, setInsightsLoading] = React.useState(false);

  const hasTasks = tasks && tasks.length > 0;
  const buttonDisabled = insightsLoading || !hasTasks;

  // Chat state (minimal, read-only)
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{ from: "user" | "assistant"; text: string }>>([]);
  const [chatLoading, setChatLoading] = React.useState(false);

  const messagesRef = React.useRef<HTMLDivElement | null>(null);

  async function sendChat() {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setMessages((m) => [...m, { from: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userText }) });
      const text = await res.text();
      if (!res.ok) {
        setMessages((m) => [...m, { from: "assistant", text: "I'm unable to answer right now. Please try again." }]);
      } else {
        setMessages((m) => [...m, { from: "assistant", text: text || "I'm unable to answer right now. Please try again." }]);
      }
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
    try {
      setInsightsLoading(true);
      setInsights(null);
      const res = await fetch("/api/ai/insights", { method: "POST", body: JSON.stringify({}), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      // If API returned the graceful fallback object, normalize it
      if (!res.ok) throw new Error(data.error || "Failed to fetch insights");
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      // Graceful fallback shown in UI
      setInsights({ summary: "No insights available today" });
    } finally {
      setInsightsLoading(false);
    }
  }
  return (
    <div className="space-y-6">

      {/* Compact header for the AI column */}
      <div className="mb-2">
        <h4 className="text-slate-50 font-semibold">Assistant</h4>
        <p className="text-slate-300/80 text-xs">Daily briefing and task-aware chat</p>
      </div>

      {/* AI Insights — gradient-tinted card with glow */}
      <div className="p-4 glass-card-strong fade-slide-up card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="ai-icon-glow">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h4 className="text-slate-50 font-semibold text-sm">AI Insights for Today</h4>
              <p className="text-xs text-slate-200/80">Based on your current tasks</p>
            </div>
          </div>
          <div>
            <button
              aria-label="Get AI Insights"
              onClick={fetchInsights}
              disabled={!hasTasks || insightsLoading}
              className="px-3 py-1.5 rounded-full gradient-btn text-white text-[11px] font-semibold disabled:opacity-40"
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
              <p className="text-slate-300/80 text-sm">
                Ask the assistant for a focus plan or risk scan.
              </p>
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

      {/* Spacer + Divider between Insights and Chat */}
      <div className="my-4 border-t border-slate-200" />

      {/* AI Chat — conversation mode (soft gradient glass card) */}
      <div className="p-4 glass-card fade-slide-up flex flex-col card-hover">
        <h4 className="text-slate-50 font-semibold mb-1.5">AI Chat</h4>
        <div className="text-xs text-slate-300/85 mb-3">
          Ask about priorities, focus windows, or what to ship next. The assistant only uses your
          task data.
        </div>

        <div ref={messagesRef} className="max-h-56 overflow-y-auto mb-3 space-y-3 p-1.5 pr-1">
          {messages.length === 0 ? (
            <div className="text-slate-400 text-sm">
              Try:{" "}
              <span className="text-slate-200">
                “What should I focus on in the next 90 minutes?”
              </span>
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
          <input aria-label="Ask the assistant" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }} disabled={chatLoading || !hasTasks} placeholder={hasTasks ? "Ask about your tasks (e.g. 'What should I focus on today?')" : "Create tasks to enable chat"} className="flex-1 px-3 py-2 rounded-lg bg-white/90 text-slate-900 border border-gray-200" />
          <button
            onClick={sendChat}
            disabled={!hasTasks || chatLoading}
            className="px-3 py-2 rounded-xl gradient-btn text-white text-sm"
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
