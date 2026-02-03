"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "done";
  dueDate: string;
  category: string;
  tags: string[];
  createdAt: string;
}

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, "id" | "createdAt">) => void;
}

export default function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || ("medium" as const),
    status: task?.status || ("pending" as const),
    dueDate: task?.dueDate || "",
    category: task?.category || "Work",
    tags: task?.tags || [],
    tagInput: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: "",
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select a due date");
      return;
    }

    if (task) {
      onSave({
        ...task,
        ...formData,
      } as Task);
    } else {
      onSave({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        category: formData.category,
        tags: formData.tags,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-card-strong">
        {/* Header */}
        <div className="sticky top-0 border-b border-slate-700/60 p-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-xl rounded-t-2xl">
          <h2 className="text-xl font-semibold text-slate-50">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-slate-100 font-semibold mb-2 text-sm">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What do you need to do?"
              className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-100 font-semibold mb-2 text-sm">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add more details about this task..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition resize-none"
            />
          </div>

          {/* Grid: Priority, Category, Due Date, Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-slate-100 font-semibold mb-2 text-sm">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 focus:outline-none focus:border-indigo-400 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-100 font-semibold mb-2 text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 focus:outline-none focus:border-indigo-400 transition"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Design">Design</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="DevOps">DevOps</option>
                <option value="Documentation">Documentation</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-slate-100 font-semibold mb-2 text-sm">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 focus:outline-none focus:border-indigo-400 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-slate-100 font-semibold mb-2 text-sm">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 focus:outline-none focus:border-indigo-400 transition"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-slate-100 font-semibold mb-2 text-sm">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={formData.tagInput}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tagInput: e.target.value,
                  }))
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter..."
                className="flex-1 px-4 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 rounded-lg gradient-btn text-white text-sm font-medium transition"
              >
                Add
              </button>
            </div>

            {/* Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 border border-slate-600/70 text-slate-100 text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-slate-500 hover:text-slate-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Suggestion Info */}
          <div className="p-4 rounded-lg bg-slate-950/40 border border-indigo-500/40">
            <p className="text-slate-100 text-xs">
              💡 <strong>AI Tip:</strong> The AI assistant can help break down large tasks into smaller,
              manageable subtasks. Edit your task to get personalized suggestions!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-950/40 border border-slate-600/70 text-slate-100 text-sm font-medium transition hover:bg-slate-100/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg gradient-btn text-white text-sm font-semibold transition"
            >
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
