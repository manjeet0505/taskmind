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
  createdAt: string;
}

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "📋",
      accent: "from-indigo-400 to-cyan-300",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: "⚡",
      accent: "from-amber-300 to-orange-300",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "✓",
      accent: "from-emerald-300 to-teal-200",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: "📈",
      accent: "from-pink-300 to-indigo-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-5 rounded-2xl glass-card card-hover border border-indigo-500/15"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl stat-icon-glow">{stat.icon}</span>
            <span
              className={`text-[10px] uppercase tracking-[0.2em] text-slate-400 bg-linear-to-r ${stat.accent} bg-clip-text text-transparent`}
            >
              Metric
            </span>
          </div>
          <h3 className="text-slate-300 text-xs font-medium mb-1.5">{stat.label}</h3>
          <p className="text-2xl font-semibold text-slate-50 tracking-tight">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
