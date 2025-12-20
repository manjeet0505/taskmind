"use client";

import { useState } from "react";
import TaskList from "@/components/TaskList";
import AIAssistant from "@/components/AIAssistant";
import TaskModal from "@/components/TaskModal";
import TaskStats from "@/components/TaskStats";

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design homepage mockup",
      description: "Create UI mockups for the landing page",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-12-22",
      category: "Design",
      tags: ["UI", "Figma"],
      createdAt: "2025-12-20",
    },
    {
      id: "2",
      title: "Implement authentication",
      description: "Setup JWT authentication with Next.js",
      priority: "high",
      status: "pending",
      dueDate: "2025-12-25",
      category: "Backend",
      tags: ["API", "Security"],
      createdAt: "2025-12-20",
    },
    {
      id: "3",
      title: "Write database schema",
      description: "Design and create database models",
      priority: "medium",
      status: "pending",
      dueDate: "2025-12-23",
      category: "Backend",
      tags: ["Database", "SQL"],
      createdAt: "2025-12-20",
    },
    {
      id: "4",
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for deployment",
      priority: "medium",
      status: "pending",
      dueDate: "2025-12-26",
      category: "DevOps",
      tags: ["GitHub", "Deployment"],
      createdAt: "2025-12-20",
    },
    {
      id: "5",
      title: "Update documentation",
      description: "Write API documentation",
      priority: "low",
      status: "completed",
      dueDate: "2025-12-21",
      category: "Documentation",
      tags: ["Docs"],
      createdAt: "2025-12-20",
    },
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleAddTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks([...tasks, task]);
    setShowTaskModal(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
    setShowTaskModal(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const categories = ["all", ...new Set(tasks.map((t) => t.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">✓</div>
          TaskMind
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">
            Profile
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back! 👋</h1>
          <p className="text-slate-300">Here's what you need to focus on today</p>
        </div>

        {/* Stats Section */}
        <TaskStats tasks={tasks} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            {/* Quick Add Task */}
            <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/30 transition">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span> Add New Task
              </button>
            </div>

            {/* Filters */}
            <div className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <div className="flex gap-2">
                  {["all", "pending", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-lg transition capitalize ${
                        filterStatus === status
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      } border border-white/10`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.slice(0, 4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-2 rounded-lg transition capitalize ${
                        filterCategory === cat
                          ? "bg-pink-500 text-white"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      } border border-white/10`}
                    >
                      {cat === "all" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={(taskId, status) => {
                setTasks(
                  tasks.map((t) =>
                    t.id === taskId ? { ...t, status } : t
                  )
                );
              }}
            />
          </div>

          {/* AI Assistant Sidebar */}
          <AIAssistant tasks={tasks} />
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleAddTask}
        />
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
