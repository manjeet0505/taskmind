"use client";

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

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAddTask?: () => void;
}

export default function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onAddTask,
}: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/20 border-green-500/30";
      case "in-progress":
        return "bg-blue-500/20 border-blue-500/30";
      case "pending":
        return "bg-slate-500/20 border-slate-500/30";
      default:
        return "bg-slate-500/20 border-slate-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return "✓";
      case "in-progress":
        return "⚡";
      case "pending":
        return "◯";
      default:
        return "◯";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-5 glass-card">
        <p className="text-slate-200 font-medium text-sm mb-1.5">No tasks yet</p>
        <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
          Add a task to get started. AI can help you prioritize.
        </p>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="px-4 py-2 rounded-lg gradient-btn text-white text-xs font-medium"
          >
            Add task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-5 glass-card"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Status Checkbox */}
              <button
                onClick={() => {
                  const nextStatus: Record<string, Task["status"]> = {
                    pending: "in-progress",
                    "in-progress": "done",
                    done: "pending",
                  };
                  onStatusChange(task.id, nextStatus[task.status]);
                }}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition ${
                  task.status === "done"
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-slate-600/60 text-slate-100 bg-slate-900/40 hover:border-slate-400/70"
                }`}
              >
                {getStatusIcon(task.status)}
              </button>

              {/* Task Content */}
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-1 ${
                  task.status === "done"
                    ? "text-slate-500 line-through"
                    : "text-slate-50"
                }`}>
                  {task.title}
                </h3>
                {task.description ? <p className="text-slate-400 text-xs mb-2 line-clamp-2">{task.description}</p> : null}

                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-500/20 text-indigo-100 border border-indigo-400/60">
                    {task.category}
                  </span>
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-[11px] bg-slate-900/50 text-slate-200 border border-slate-600/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>📅 Due: {formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => onEditTask(task)}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-500/80 hover:bg-indigo-400 text-white text-xs font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 text-xs font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
