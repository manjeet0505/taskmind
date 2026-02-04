import { NextResponse } from "next/server";
import cookie from "cookie";
import { getUserFromToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import ai from "@/lib/ai";
import { getOpenAIClient, generateInsightsWithOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  // Authenticate
  const cookies = req.headers.get("cookie") || "";
  const parsed = cookie.parse(cookies || "");
  const token = parsed.token;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserFromToken(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const today = body?.today ? new Date(body.today) : new Date();

  await connectToDatabase();
  const userId = (user as any)._id;
  const tasks = await Task.find({ userId }).lean();

  const minimal = tasks.map((t: any) => ({
    id: t._id.toString(),
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : null,
  }));

  // Prefer using OpenAI when an API key is configured. If not configured, fall back to the deterministic engine (helpful for local/dev).
  const openaiClient = getOpenAIClient();
  if (!openaiClient) {
    try {
      const insights = ai.insightsForToday(minimal, today as any);
      return NextResponse.json(
        {
          summary: insights.summary,
          focusTasks: insights.focusTasks,
          warnings: insights.warnings,
          productivityTip: insights.productivityTip,
          suggestions: [],
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Deterministic AI insights generation failed:", err);
      return NextResponse.json({ summary: "No insights available today" }, { status: 200 });
    }
  }

  // OpenAI is configured — attempt to get insights from the model
  try {
    const insights = await generateInsightsWithOpenAI(minimal as any, today as any);

    // Validate shape conservatively before returning (the generator already validates but double-check here)
    if (!insights || typeof insights.summary !== "string") throw new Error("Invalid insights shape");

    return NextResponse.json(
      {
        summary: insights.summary,
        focusTasks: insights.focusTasks || [],
        warnings: insights.warnings || [],
        productivityTip: insights.productivityTip || "",
        suggestions: insights.suggestions || [],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("OpenAI insights generation failed:", err);
    // Per requirement: do NOT let OpenAI failures break the app — return the graceful fallback
    return NextResponse.json({ summary: "No insights available today" }, { status: 200 });
  }
} 
