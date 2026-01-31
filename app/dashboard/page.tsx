"use client";

import React, { useState } from "react";
import TaskList from "@/components/TaskList";
import AIAssistant from "@/components/AIAssistant";
import TaskModal from "@/components/TaskModal";
import TaskStats from "@/components/TaskStats";

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

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "done">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered tasks client-side after server fetch
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== "all") params.set("status", filterStatus);
      if (filterCategory && filterCategory !== "all") params.set("category", filterCategory);
      if (searchQuery && searchQuery.trim() !== "") params.set("search", searchQuery.trim());

      const res = await fetch(`/api/tasks?${params.toString()}`, { method: "GET", headers: { "Accept": "application/json" } });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, "id" | "createdAt">) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create task");
      setTasks((prev) => [data.task, ...prev]);
      setShowTaskModal(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const res = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update task");
      setTasks((prev) => prev.map((t) => (t.id === data.task.id ? data.task : t)));
      setEditingTask(null);
      setShowTaskModal(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setTasks((prev) => prev.map((t) => (t.id === data.task.id ? data.task : t)));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update status");
    }
  };

  const categories = ["all", ...Array.from(new Set(tasks.map((t) => t.category)))];

  // Fetch tasks on mount and when filters/search change
  React.useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Fixed background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

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
                className="w-full px-6 py-4 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center gap-2"
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
                  {["all", "pending", "in-progress", "done"].map((status) => (
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
              onStatusChange={handleStatusChange}
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
