import { NextResponse } from "next/server";
import cookie from "cookie";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsed = cookie.parse(cookies || "");
    const token = parsed.token;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token).catch(() => null);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description = "", priority = "medium", status = "pending", category = "General", dueDate, tags = [] } = body;

    if (!title || !title.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!dueDate) return NextResponse.json({ error: "Due date is required" }, { status: 400 });

    await connectToDatabase();

    const userId = (user as any)._id;

    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      status,
      category,
      dueDate: new Date(dueDate),
      userId,
      tags,
    });

    return NextResponse.json({ task: mapTask(task) }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsed = cookie.parse(cookies || "");
    const token = parsed.token;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token).catch(() => null);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    const userId = (user as any)._id;
    const filter: any = { userId };
    if (status && status !== "all") filter.status = status;
    if (category && category !== "all") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ tasks: tasks.map(mapTask) }, { status: 200 });
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