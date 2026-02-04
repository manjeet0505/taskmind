import cookie from "cookie";
import { getUserFromToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Task from "@/models/Task";
import { getOpenAIClient, generateChatResponse } from "@/lib/openai";
import ai from "@/lib/ai";

export async function POST(req: Request) {
  // Authenticate
  const cookies = req.headers.get("cookie") || "";
  const parsed = cookie.parse(cookies || "");
  const token = parsed.token;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const user = await getUserFromToken(token).catch(() => null);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const message = (body?.message || "").trim();
  if (!message) return new Response("Message required", { status: 400 });

  await connectToDatabase();
  const userId = (user as any)._id;
  const tasks = await Task.find({ userId }).lean();

  const minimal = tasks.map((t: any) => ({
    _id: t._id,
    id: t._id.toString(),
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : null,
    createdAt: t.createdAt,
  }));

  const client = getOpenAIClient();

  if (!client) {
    try {
      const reply = ai.chatReply(minimal as any, message, new Date());
      const text = typeof reply === "object" && reply?.reply != null ? reply.reply : String(reply);
      return new Response(JSON.stringify({ text, suggestions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Deterministic chat failed:", e);
      return new Response(
        JSON.stringify({ text: "I'm unable to answer right now. Please try again.", suggestions: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const result = await generateChatResponse(minimal as any, message, new Date());
    return new Response(
      JSON.stringify({ text: result.text, suggestions: result.suggestions ?? [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("OpenAI chat failed:", e);
    return new Response(
      JSON.stringify({ text: "I'm unable to answer right now. Please try again.", suggestions: [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
