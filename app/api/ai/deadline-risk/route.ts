import { NextResponse } from "next/server";
import cookie from "cookie";
import { getUserFromToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { analyzeDeadlineRisk } from "@/lib/deadline-risk";

/**
 * GET /api/ai/deadline-risk
 * Returns deadline risk analysis for the authenticated user's tasks only.
 * READ-ONLY: never modifies any task data.
 * On failure: returns 200 with { unavailable: true } so the app works normally.
 */
export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  const parsed = cookie.parse(cookies);
  const token = parsed.token;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserFromToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const userId = (user as { _id: unknown })._id;
    const tasks = await Task.find({ userId }).lean();

    const forRisk = tasks.map((t: { _id: unknown; dueDate?: Date | null; priority: string; status: string; createdAt: Date }) => ({
      id: String(t._id),
      dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : null,
      priority: t.priority as "low" | "medium" | "high",
      status: t.status as "pending" | "in-progress" | "done",
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
    }));

    const result = analyzeDeadlineRisk(forRisk, new Date());
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Deadline risk analysis failed:", err);
    return NextResponse.json(
      { unavailable: true, overallRisk: "low", warnings: [], note: "Deadline risk analysis is unavailable right now." },
      { status: 200 }
    );
  }
}
