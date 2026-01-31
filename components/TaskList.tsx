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
}

export default function TaskList({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
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
      <div className="text-center py-12 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <p className="text-slate-400 text-lg">No tasks found. Create one to get started! 🚀</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-6 rounded-2xl backdrop-blur-xl border transition-all hover:shadow-lg ${getStatusColor(
            task.status
          )}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
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
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition ${
                  task.status === "done"
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-white/30 text-white hover:border-white/50"
                }`}
              >
                {getStatusIcon(task.status)}
              </button>

              {/* Task Content */}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    task.status === "done"
                      ? "text-slate-400 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-slate-300 text-sm mb-3">{task.description}</p>

                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {task.category}
                  </span>
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-white/10 text-slate-300 border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📅 Due: {formatDate(task.dueDate)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEditTask(task)}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition text-sm font-medium border border-red-500/30"
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
