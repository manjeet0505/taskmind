import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: Date | null;
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
}

const TaskSchema: Schema<ITask> = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: { type: String, default: "General" },
    dueDate: { type: Date, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for queries by user
TaskSchema.index({ userId: 1 });

// Hot-reload safe model export
const Task: Model<ITask> = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>("Task", TaskSchema);

export default Task;