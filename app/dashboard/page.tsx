"use client";

import React, { useState } from "react";
import TaskList from "@/components/TaskList";
import AIAssistant from "@/components/AIAssistant";
import TaskModal from "@/components/TaskModal";
import TaskStats from "@/components/TaskStats";
import WeeklySummary from "@/components/WeeklySummary";

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
    <div className="min-h-full">
      {/* Main Content — no container, content flows on background */}
      <div className="relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-50 mb-2 tracking-tight">Welcome back! 👋</h1>
          <p className="text-slate-300 text-lg">Here&apos;s what you need to focus on today</p>
        </div>

        {/* Weekly Summary */}
        <div className="mb-8">
          <WeeklySummary />
        </div>

        {/* Stats Section */}
        <TaskStats tasks={tasks} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            {/* Quick Add Task — CTA with subtle glow */}
            <div className="mb-8 p-6 glass-card card-hover">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                className="w-full px-6 py-4 rounded-xl gradient-btn cta-glow text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span className="text-xl">+</span> Add New Task
              </button>
            </div>

            {/* Filters — pill-style with active gradient */}
            <div className="mb-8 p-6 glass-card card-hover">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-900/50 border border-indigo-500/20 text-slate-50 placeholder-slate-400 focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <div className="flex gap-2">
                  {["all", "pending", "in-progress", "done"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filterStatus === status
                          ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white border border-indigo-400/50 shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                          : "bg-slate-800/50 text-slate-200 border border-slate-600/50 hover:bg-slate-700/50 hover:border-indigo-500/30"
                      }`}
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
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filterCategory === cat
                          ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white border border-indigo-400/50 shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                          : "bg-slate-800/50 text-slate-200 border border-slate-600/50 hover:bg-slate-700/50 hover:border-indigo-500/30"
                      }`}
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
              onAddTask={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
            />
          </div>

          {/* AI Assistant Sidebar */}
          <AIAssistant tasks={tasks} onTaskUpdated={fetchTasks} />
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
    </div>
  );
}
