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
      <div className="relative z-10">
        {/* ZONE 1 — Top focus: single clear entry point */}
        <div className="mb-10">
          <h1 className="text-page-title text-3xl md:text-4xl text-slate-50 mb-1.5">Welcome back</h1>
          <p className="text-body text-base text-slate-400">Here&apos;s what you need to focus on today</p>
        </div>

        {/* ZONE 4 — Secondary: weekly summary + stats, visually quiet */}
        <div className="mb-8">
          <WeeklySummary />
        </div>
        <div className="mb-8">
          <TaskStats tasks={tasks} />
        </div>

        {/* ZONE 2 + 3 — Core task work (primary) | AI support (secondary) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ZONE 2 — Core: task list is main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 glass-card card-hover">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskModal(true);
                }}
                className="w-full px-5 py-3.5 rounded-xl gradient-btn cta-glow btn-hover-glow transition-smooth text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <span className="text-lg">+</span> Add New Task
              </button>
            </div>

            <div className="p-5 glass-card card-hover">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/40 text-slate-50 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400/50 transition-smooth mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "in-progress", "done"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      filterStatus === status
                        ? "bg-indigo-500/90 text-white"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                      filterCategory === cat
                        ? "bg-indigo-500/90 text-white"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

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

          {/* ZONE 3 — AI support: sidebar, lighter weight */}
          <div className="lg:pt-0">
            <AIAssistant tasks={tasks} onTaskUpdated={fetchTasks} />
          </div>
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
