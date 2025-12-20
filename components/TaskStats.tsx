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

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "📋",
      color: "from-purple-400 to-pink-400",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: "⚡",
      color: "from-blue-400 to-cyan-400",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "✓",
      color: "from-green-400 to-emerald-400",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: "📈",
      color: "from-yellow-400 to-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{stat.icon}</span>
            <span className={`text-sm font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              Stat
            </span>
          </div>
          <h3 className="text-slate-300 text-sm mb-2">{stat.label}</h3>
          <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
