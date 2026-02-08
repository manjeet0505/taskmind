"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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

const INPUT_FOCUS =
  "focus:outline-none focus:border-indigo-400/80 focus:ring-2 focus:ring-indigo-400/20 transition-[box-shadow,border-color] duration-150";

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

  const [isOpen, setIsOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open; preserve and restore scroll position on close
  useEffect(() => {
    const scrollY = window.scrollY ?? document.documentElement.scrollTop;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    setIsOpen(true);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Focus first input when opened (after paint)
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => titleInputRef.current?.focus());
    });
    return () => cancelAnimationFrame(t);
  }, []);

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

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
    >
      {/* Full-screen fixed backdrop — dims background, blocks interaction and scroll */}
      <div
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
        aria-hidden
        onClick={onClose}
      />

      {/* Centered panel — form is only focus */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl glass-card-strong shadow-2xl transition-all duration-200 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-700/50 rounded-t-2xl">
          <h2 id="task-modal-title" className="text-lg font-semibold text-slate-50">
            {task ? "Edit task" : "Add task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 -m-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        {/* Scrollable form body — no background scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label htmlFor="task-title" className="block text-slate-200 font-medium text-sm mb-1.5">
                Title *
              </label>
              <input
                ref={titleInputRef}
                id="task-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What do you need to do?"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 placeholder-slate-500 ${INPUT_FOCUS}`}
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-slate-200 font-medium text-sm mb-1.5">
                Description
              </label>
              <textarea
                id="task-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add details (optional)"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 placeholder-slate-500 resize-none ${INPUT_FOCUS}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-priority" className="block text-slate-200 font-medium text-sm mb-1.5">
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 ${INPUT_FOCUS}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-category" className="block text-slate-200 font-medium text-sm mb-1.5">
                  Category
                </label>
                <select
                  id="task-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 ${INPUT_FOCUS}`}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-due" className="block text-slate-200 font-medium text-sm mb-1.5">
                  Due date *
                </label>
                <input
                  id="task-due"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 ${INPUT_FOCUS}`}
                />
              </div>
              <div>
                <label htmlFor="task-status" className="block text-slate-200 font-medium text-sm mb-1.5">
                  Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 ${INPUT_FOCUS}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="task-tag" className="block text-slate-200 font-medium text-sm mb-1.5">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  id="task-tag"
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tagInput: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag, press Enter"
                  className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-600/50 text-slate-50 placeholder-slate-500 text-sm ${INPUT_FOCUS}`}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 rounded-xl bg-slate-700/50 text-slate-200 text-sm font-medium hover:bg-slate-600/50 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 text-slate-200 text-xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag}`}
                        className="text-slate-500 hover:text-slate-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-slate-300 text-xs">
                💡 AI can help break down large tasks. Edit later for suggestions.
              </p>
            </div>

            {/* Actions — submit prominent */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl text-slate-300 text-sm font-medium hover:bg-slate-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl gradient-btn text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
              >
                {task ? "Update task" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined" && document.body) {
    return createPortal(modalContent, document.body);
  }
  return null;
}
