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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-linear-to-br from-slate-800 to-slate-900 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-white/10 p-6 flex items-center justify-between bg-linear-to-b from-slate-800 to-slate-800/50">
          <h2 className="text-2xl font-bold text-white">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What do you need to do?"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add more details about this task..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition resize-none"
            />
          </div>

          {/* Grid: Priority, Category, Due Date, Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-white font-semibold mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400 transition"
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
              <label className="block text-white font-semibold mb-2">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-white font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400 transition"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white font-semibold mb-2">Tags</label>
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
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition"
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
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-500/50 text-purple-200 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Suggestion Info */}
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-purple-200 text-sm">
              💡 <strong>AI Tip:</strong> The AI assistant can help break down large tasks into smaller,
              manageable subtasks. Edit your task to get personalized suggestions!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              {task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
