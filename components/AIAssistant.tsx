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
      {/* AI Assistant Header */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🤖</span>
          <div className="flex-1">
            <h3 className="text-white font-bold">AI Insights for Today</h3>
            <p className="text-sm text-slate-300">Based on your current tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchInsights} disabled={buttonDisabled} title={hasTasks ? "Get AI Insights" : "Create tasks to enable insights"} className="px-3 py-2 rounded-md bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm disabled:opacity-60">{insightsLoading ? "Thinking..." : "Get AI Insights"}</button>
          </div>
        </div>

        {/* Chat disabled for step-1: read-only AI insights only. */}
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold px-2">Quick Insights</h4>

        {pendingTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-400/50 transition">
            <p className="text-blue-200 text-sm">
              ⚡ You have <strong>{pendingTasks.length}</strong> pending {pendingTasks.length === 1 ? "task" : "tasks"}. Start with the highest priority ones!
            </p>
          </div>
        )}

        {highPriorityTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-400/50 transition">
            <p className="text-red-200 text-sm">
              🔴 <strong>{highPriorityTasks.length}</strong> high priority {highPriorityTasks.length === 1 ? "task" : "tasks"} needs attention!
            </p>
          </div>
        )}

        {overdueTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-400/50 transition">
            <p className="text-orange-200 text-sm">
              ⏰ <strong>{overdueTasks.length}</strong> overdue {overdueTasks.length === 1 ? "task" : "tasks"}. Review and reschedule!
            </p>
          </div>
        )}

        {pendingTasks.length === 0 && highPriorityTasks.length === 0 && overdueTasks.length === 0 && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-200 text-sm">✨ Great job! You're all caught up. Keep maintaining this momentum!</p>
          </div>
        )}
      </div>

      {/* AI Insights Card */}
      {insights && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-white font-semibold mb-2">Today's Focus</h4>

          {/* Summary / Highlight */}
          <div className="rounded-md bg-white/6 p-4 mb-3">
            <p className="text-slate-200 text-lg leading-relaxed">{insights.summary}</p>
          </div>

          {insights.summary === "No insights available today" ? (
            hasTasks ? (
              <div className="text-slate-400 text-sm">No suggestions available at this time.</div>
            ) : (
              <div className="text-slate-400 text-sm">You don't have any tasks yet. Create your first task to receive AI insights.</div>
            )
          ) : (
            <>
              <h5 className="text-white font-medium">Focus Tasks</h5>
              <ul className="mt-2 space-y-3">
                {insights.focusTasks && insights.focusTasks.length > 0 ? (
                  insights.focusTasks.map((f: any, i: number) => (
                    <li key={i} className="text-slate-300">
                      <div className="font-semibold">{f.title}</div>
                      {f.reason && <div className="text-xs text-slate-400 mt-1">{f.reason}</div>}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 text-sm">No focus tasks suggested.</li>
                )}
              </ul>

              {insights.warnings && insights.warnings.length > 0 && (
                <div className="mt-4 p-3 rounded-md bg-yellow-900/10 border border-yellow-800/10">
                  <h5 className="text-yellow-200 font-medium">Warnings</h5>
                  <ul className="text-xs text-yellow-200 mt-2 space-y-1 list-disc list-inside">
                    {insights.warnings.map((w: string, idx: number) => (
                      <li key={idx}> {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {insights.productivityTip && (
                <div className="mt-4 p-3 rounded-md bg-white/6 border border-white/8">
                  <h5 className="text-white font-medium">Productivity Tip</h5>
                  <div className="text-slate-300 text-sm mt-2">{insights.productivityTip}</div>
                </div>
              )}

              <div className="mt-3 text-xs text-slate-400">Note: The assistant only reads your tasks and will never write to your data automatically.</div>
            </>
          )}
        </div>
      )}

      {/* AI Suggestions */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold px-2">Smart Suggestions</h4>

        {suggestions.map((suggestion, index) => (
          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition cursor-pointer group">
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm leading-relaxed"><span className="text-lg mr-2">{suggestion.icon}</span>{suggestion.text}</p>
              {/* Offer an example action for complex tasks */}
              {suggestion.text.includes("complex") && (
                <button onClick={() => {
                  // find first complex task
                  const t = tasks.find((t) => t.description.length > 100 && t.status !== "done");
                  if (!t) return alert("No complex task found");
                  if (!confirm(`Would you like the assistant to suggest splitting '${t.title}' into subtasks? This will only create suggestions for you to review.`)) return;
                  alert("Suggestion: Create 2-3 subtasks manually. (AI will not auto-create them.)");
                }} className="px-2 py-1 rounded-md bg-white/5 text-xs text-white border border-white/10">Suggest split</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Productivity Tips */}
      <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
        <h4 className="text-amber-200 font-semibold mb-3 flex items-center gap-2">💡 Productivity Tip</h4>
        <p className="text-amber-200 text-sm leading-relaxed">Break large tasks into smaller subtasks. This makes them less overwhelming and helps you track progress better. You typically complete tasks 23% faster this way!</p>
      </div>

      {/* AI Features */}
      <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
        <h4 className="text-blue-200 font-semibold mb-3 flex items-center gap-2">🎯 AI Features Available</h4>
        <ul className="space-y-2 text-blue-200 text-sm">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Smart task prioritization</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Automatic scheduling (suggest-only)</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Task breakdown suggestions</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Progress predictions</li>
        </ul>
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
