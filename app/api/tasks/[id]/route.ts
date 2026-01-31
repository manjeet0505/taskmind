import { NextResponse } from "next/server";
import cookie from "cookie";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const cookies = req.headers.get("cookie") || "";
    const parsed = cookie.parse(cookies || "");
    const token = parsed.token;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token).catch(() => null);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const allowed: any = {};
    ["title", "description", "status", "priority", "category", "dueDate", "tags"].forEach((k) => {
      if (body[k] !== undefined) allowed[k] = body[k];
    });

    if (allowed.dueDate !== undefined) allowed.dueDate = allowed.dueDate ? new Date(allowed.dueDate) : null;

    await connectToDatabase();

    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const userId = (user as any)._id;
    if (task.userId.toString() !== userId.toString()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    Object.assign(task, allowed);
    await task.save();

    return NextResponse.json({ task: mapTask(task) }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const cookies = req.headers.get("cookie") || "";
    const parsed = cookie.parse(cookies || "");
    const token = parsed.token;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token).catch(() => null);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const userId = (user as any)._id;
    if (task.userId.toString() !== userId.toString()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await task.deleteOne();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function mapTask(task: any) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    category: task.category || "",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : null,
    tags: task.tags || [],
    createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : null,
  };
}