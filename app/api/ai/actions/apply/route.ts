import { NextResponse } from "next/server";
import cookie from "cookie";
import { getUserFromToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import {
  sanitizeSuggestedChange,
  type AllowedTaskUpdateKey,
} from "@/lib/ai-actions";

/**
 * POST /api/ai/actions/apply
 * Apply a user-approved AI suggestion. No AI involved; validates ownership and allowed fields only.
 */
export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsed = cookie.parse(cookies);
    const token = parsed.token;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token).catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { targetTaskId, suggestedChange: rawChange } = body;

    if (!targetTaskId || typeof targetTaskId !== "string") {
      return NextResponse.json(
        { error: "targetTaskId is required" },
        { status: 400 }
      );
    }
    if (!rawChange || typeof rawChange !== "object") {
      return NextResponse.json(
        { error: "suggestedChange is required" },
        { status: 400 }
      );
    }

    const suggestedChange = sanitizeSuggestedChange(
      rawChange as Record<string, unknown>
    );
    if (Object.keys(suggestedChange).length === 0) {
      return NextResponse.json(
        { error: "suggestedChange must contain at least one allowed field" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const task = await Task.findById(targetTaskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const userId = (user as { _id: { toString: () => string } })._id;
    if (task.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowed: Record<string, unknown> = {};
    for (const k of Object.keys(suggestedChange) as AllowedTaskUpdateKey[]) {
      if (suggestedChange[k] !== undefined) allowed[k] = suggestedChange[k];
    }
    if (allowed.dueDate !== undefined) {
      allowed.dueDate = allowed.dueDate
        ? new Date(allowed.dueDate as string)
        : null;
    }

    Object.assign(task, allowed);
    await task.save();

    return NextResponse.json(
      {
        task: {
          id: task._id.toString(),
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          priority: task.priority,
          category: task.category ?? "",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : null,
          tags: task.tags ?? [],
          createdAt: task.createdAt
            ? new Date(task.createdAt).toISOString()
            : null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Apply action failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
