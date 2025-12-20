"use client";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  category: string;
  tags: string[];
  createdAt: string;
}

interface AIAssistantProps {
  tasks: Task[];
}

export default function AIAssistant({ tasks }: AIAssistantProps) {
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const highPriorityTasks = tasks.filter((t) => t.priority === "high");
  const overdueTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "completed";
  });

  const suggestions = generateSuggestions(tasks, pendingTasks, highPriorityTasks, overdueTasks);

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="text-white font-bold">AI Assistant</h3>
            <p className="text-sm text-purple-200">Powered by TaskMind AI</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold px-2">Quick Insights</h4>

        {pendingTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-400/50 transition">
            <p className="text-blue-200 text-sm">
              ⚡ You have <strong>{pendingTasks.length}</strong> pending{" "}
              {pendingTasks.length === 1 ? "task" : "tasks"}. Start with the highest priority ones!
            </p>
          </div>
        )}

        {highPriorityTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-400/50 transition">
            <p className="text-red-200 text-sm">
              🔴 <strong>{highPriorityTasks.length}</strong> high priority{" "}
              {highPriorityTasks.length === 1 ? "task" : "tasks"} needs attention!
            </p>
          </div>
        )}

        {overdueTasks.length > 0 && (
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-400/50 transition">
            <p className="text-orange-200 text-sm">
              ⏰ <strong>{overdueTasks.length}</strong> overdue{" "}
              {overdueTasks.length === 1 ? "task" : "tasks"}. Review and reschedule!
            </p>
          </div>
        )}

        {pendingTasks.length === 0 && highPriorityTasks.length === 0 && overdueTasks.length === 0 && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-200 text-sm">
              ✨ Great job! You're all caught up. Keep maintaining this momentum!
            </p>
          </div>
        )}
      </div>

      {/* AI Suggestions */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold px-2">Smart Suggestions</h4>

        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition cursor-pointer group"
          >
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-lg mr-2">{suggestion.icon}</span>
              {suggestion.text}
            </p>
          </div>
        ))}
      </div>

      {/* Productivity Tips */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30">
        <h4 className="text-amber-200 font-semibold mb-3 flex items-center gap-2">
          💡 Productivity Tip
        </h4>
        <p className="text-amber-200 text-sm leading-relaxed">
          Break large tasks into smaller subtasks. This makes them less overwhelming and helps you track progress better. You typically complete tasks 23% faster this way!
        </p>
      </div>

      {/* AI Features */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
        <h4 className="text-blue-200 font-semibold mb-3 flex items-center gap-2">
          🎯 AI Features Available
        </h4>
        <ul className="space-y-2 text-blue-200 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Smart task prioritization
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Automatic scheduling
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Task breakdown suggestions
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Progress predictions
          </li>
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
  const complexTasks = tasks.filter((t) => t.description.length > 100 && t.status !== "completed");
  if (complexTasks.length > 0) {
    suggestions.push({
      icon: "🔄",
      text: `"${complexTasks[0].title}" looks complex. Consider breaking it into 2-3 smaller tasks for better focus.`,
    });
  }

  // Suggestion 4: Clear completed tasks
  const completedCount = tasks.filter((t) => t.status === "completed").length;
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
