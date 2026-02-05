import { NextResponse } from "next/server";
import cookie from "cookie";
import { getUserFromToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { getOpenAIClient, generateWeeklySummaryWithOpenAI, type InsightTask } from "@/lib/openai";

export async function POST(req: Request) {
  // Authenticate
  const cookies = req.headers.get("cookie") || "";
  const parsed = cookie.parse(cookies || "");
  const token = parsed.token;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserFromToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const weekEnd = body?.weekEnd ? new Date(body.weekEnd) : new Date();
  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekStart.getDate() - 7); // 7 days ago

  await connectToDatabase();
  const userId = (user as any)._id;

  // Fetch tasks created or updated in the past 7 days
  const tasks = await Task.find({
    userId,
    createdAt: { $gte: weekStart, $lte: weekEnd },
  }).lean();

  const minimal: InsightTask[] = tasks.map((t: any) => ({
    id: t._id.toString(),
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : null,
  }));

  // If no tasks, return a gentle message
  if (minimal.length === 0) {
    return NextResponse.json(
      {
        summary: "You haven't created any tasks this week. Start by adding a few tasks to track your progress.",
        highlights: ["A fresh start is a great opportunity to organize your priorities"],
        suggestion: "Consider adding 2-3 tasks to get started",
      },
      { status: 200 }
    );
  }

  // Prefer using OpenAI when an API key is configured
  const openaiClient = getOpenAIClient();
  if (!openaiClient) {
    // Fallback: simple deterministic summary
    try {
      const completed = minimal.filter((t) => t.status === "done").length;
      const pending = minimal.filter((t) => t.status !== "done").length;
      const overdue = minimal.filter((t) => {
        if (!t.dueDate || t.status === "done") return false;
        return new Date(t.dueDate) < weekEnd;
      }).length;

      const summary = `This week you worked on ${minimal.length} task${minimal.length !== 1 ? "s" : ""}. You completed ${completed} task${completed !== 1 ? "s" : ""} and have ${pending} still in progress.`;
      
      const highlights: string[] = [];
      if (completed > 0) {
        highlights.push(`You completed ${completed} task${completed !== 1 ? "s" : ""} this week`);
      }
      if (overdue === 0 && pending > 0) {
        highlights.push("You stayed on top of deadlines");
      }
      if (highlights.length === 0) {
        highlights.push("You're making progress on your tasks");
      }

      const suggestion = pending > 3 
        ? "Consider focusing on 2-3 high-priority tasks at a time"
        : "Keep up the momentum by tackling your next priority";

      return NextResponse.json(
        {
          summary,
          highlights: highlights.slice(0, 3),
          suggestion,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Deterministic weekly summary generation failed:", err);
      return NextResponse.json(
        {
          summary: "Your weekly summary is not available right now.",
          highlights: [],
          suggestion: "",
        },
        { status: 200 }
      );
    }
  }

  // OpenAI is configured — attempt to get summary from the model
  try {
    const summary = await generateWeeklySummaryWithOpenAI(minimal, weekStart, weekEnd);

    // Validate shape conservatively
    if (!summary || typeof summary.summary !== "string" || !Array.isArray(summary.highlights)) {
      throw new Error("Invalid weekly summary shape");
    }

    return NextResponse.json(
      {
        summary: summary.summary,
        highlights: summary.highlights.slice(0, 3), // Ensure max 3 highlights
        suggestion: summary.suggestion || "",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("OpenAI weekly summary generation failed:", err);
    // Per requirement: do NOT let OpenAI failures break the app — return graceful fallback
    return NextResponse.json(
      {
        summary: "Your weekly summary is not available right now.",
        highlights: [],
        suggestion: "",
      },
      { status: 200 }
    );
  }
}
