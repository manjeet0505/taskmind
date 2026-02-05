import OpenAI from "openai";
import type { AISuggestion } from "@/lib/ai-actions";

export interface InsightTask {
  id?: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
}

export interface InsightsResult {
  summary: string;
  focusTasks: { title: string; reason: string }[];
  warnings: string[];
  productivityTip: string;
  suggestions?: AISuggestion[];
}

export interface ChatResult {
  text: string;
  suggestions?: AISuggestion[];
}

export interface WeeklySummaryResult {
  summary: string;
  highlights: string[];
  suggestion: string;
}

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  client = new OpenAI({ apiKey: key });
  return client;
}

function sanitizeModelOutput(text: string) {
  // Remove Markdown code fences and trim
  return text.replace(/```(?:\w+)?/g, "").trim();
}

function extractJson(text: string) {
  // Try to extract the first JSON object from the text conservatively
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = text.substring(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (e) {
    return null;
  }
}

function validateInsightSuggestion(s: unknown): s is AISuggestion {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  if (typeof o.actionType !== "string") return false;
  if (typeof o.targetTaskId !== "string") return false;
  if (!o.suggestedChange || typeof o.suggestedChange !== "object") return false;
  if (typeof o.reason !== "string") return false;
  return true;
}

function validateShape(obj: unknown): obj is InsightsResult {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.summary !== "string") return false;
  if (!Array.isArray(o.focusTasks)) return false;
  if (!Array.isArray(o.warnings)) return false;
  if (typeof o.productivityTip !== "string") return false;
  if (!o.focusTasks.every((f: unknown) => f && typeof (f as any).title === "string" && typeof (f as any).reason === "string")) return false;
  if (!o.warnings.every((w: unknown) => typeof w === "string")) return false;
  if (o.suggestions !== undefined) {
    if (!Array.isArray(o.suggestions) || !o.suggestions.every(validateInsightSuggestion)) return false;
  }
  return true;
}

export async function generateInsightsWithOpenAI(tasks: InsightTask[], today: Date): Promise<InsightsResult> {
  const client = getOpenAIClient();
  if (!client) throw new Error("OpenAI API key not configured");

  const dateStr = today.toISOString().split("T")[0];

  const systemPrompt = `You are a deterministic assistant that analyzes a user's task list and returns a STRICT JSON object with this shape: {"summary": string, "focusTasks": [{"title": string, "reason": string}], "warnings": [string], "productivityTip": string, "suggestions": optional array }.
- Each task in the input has "id" (string). You MUST use that exact id when suggesting an action.
- "suggestions" is OPTIONAL. If you suggest an action, each item must be: {"actionType": "CHANGE_PRIORITY"|"RESCHEDULE_TASK"|"CHANGE_STATUS"|"SUGGEST_BREAKDOWN", "targetTaskId": string (use task id from input), "suggestedChange": object with only allowed fields (e.g. priority, status, dueDate), "reason": string}.
- DO NOT modify the database. Only suggest; the user will decide.
- ONLY return valid JSON (no markdown). If no suggestions, omit "suggestions" or use [].
- Keep answers concise. Use task titles and ids exactly as provided.`;

  const userPrompt = `Date: ${dateStr}\nTasks: ${JSON.stringify(tasks)}\n
Return the JSON object described in the system prompt.`;

  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 512,
    temperature: 0.0,
  });

  const content = (res.choices && res.choices[0] && (res.choices[0].message as any)?.content) || "";
  const cleaned = sanitizeModelOutput(content);
  const parsed = extractJson(cleaned);
  if (parsed && validateShape(parsed)) {
    return parsed;
  }

  // If parsing failed, attempt to parse loose content (last-ditch effort)
  try {
    const maybe = JSON.parse(cleaned);
    if (validateShape(maybe)) return maybe;
  } catch (e) {
    // ignore
  }

  throw new Error("OpenAI response did not contain valid insights JSON");
}

function validateChatSuggestion(s: unknown): s is AISuggestion {
  return validateInsightSuggestion(s);
}

function validateChatResult(obj: unknown): obj is ChatResult {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.text !== "string") return false;
  if (o.suggestions !== undefined) {
    if (!Array.isArray(o.suggestions) || !o.suggestions.every(validateChatSuggestion)) return false;
  }
  return true;
}

export async function generateChatResponse(
  tasks: InsightTask[],
  message: string,
  today: Date
): Promise<ChatResult> {
  const client = getOpenAIClient();
  if (!client) throw new Error("OpenAI API key not configured");

  const dateStr = today.toISOString().split("T")[0];

  const systemPrompt = `You are a helpful assistant that answers questions using the provided tasks and today's date. Return a STRICT JSON object: {"text": string, "suggestions": optional array}.
- "text": your reply (short, actionable). If you cannot answer from the tasks, set text to: "I don't have enough information to answer that question based on the provided tasks."
- "suggestions": OPTIONAL. Only include if it makes sense (e.g. user asks for recommendations). Each item: {"actionType": "CHANGE_PRIORITY"|"RESCHEDULE_TASK"|"CHANGE_STATUS"|"SUGGEST_BREAKDOWN", "targetTaskId": string (use task "id" from input), "suggestedChange": object with allowed fields only (priority, status, dueDate, etc.), "reason": string}.
- Do NOT apply any changes. Only suggest; the user decides. Use task "id" from the tasks list for targetTaskId.
- Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Date: ${dateStr}\nTasks: ${JSON.stringify(tasks)}\n\nUser question: ${message}`;

  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 400,
    temperature: 0.0,
  });

  const content = (res.choices?.[0]?.message as { content?: string } | undefined)?.content ?? "";
  const cleaned = sanitizeModelOutput(content);
  const parsed = extractJson(cleaned);
  if (parsed && validateChatResult(parsed)) {
    if (parsed.text.toLowerCase().includes("don't have enough")) {
      parsed.text = "I don't have enough information to answer that question based on the provided tasks.";
    }
    return parsed;
  }
  return { text: cleaned || "I'm unable to answer right now. Please try again." };
}

function validateWeeklySummary(obj: unknown): obj is WeeklySummaryResult {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.summary !== "string") return false;
  if (!Array.isArray(o.highlights) || !o.highlights.every((h: unknown) => typeof h === "string")) return false;
  if (typeof o.suggestion !== "string") return false;
  return true;
}

export async function generateWeeklySummaryWithOpenAI(
  tasks: InsightTask[],
  weekStart: Date,
  weekEnd: Date
): Promise<WeeklySummaryResult> {
  const client = getOpenAIClient();
  if (!client) throw new Error("OpenAI API key not configured");

  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  const systemPrompt = `You are a thoughtful assistant that helps users reflect on their productivity. Return a STRICT JSON object with this shape: {"summary": string, "highlights": [string], "suggestion": string}.
- "summary": A brief, reflective paragraph (2-3 sentences) about the user's week. Be encouraging and non-judgmental. Focus on patterns, not scores.
- "highlights": An array of 2-3 positive observations about their task management (e.g., "You completed most tasks before deadlines", "You maintained focus on high-priority items").
- "suggestion": One gentle, actionable productivity suggestion (e.g., "Consider breaking large tasks into smaller ones").
- Use a calm, supportive tone. Do NOT use guilt-inducing language.
- ONLY return valid JSON (no markdown).`;

  const completedTasks = tasks.filter((t) => t.status === "done");
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const due = new Date(t.dueDate);
    return due < weekEnd && due >= weekStart;
  });

  const userPrompt = `Week: ${weekStartStr} to ${weekEndStr}
Tasks this week:
- Completed: ${completedTasks.length}
- Still pending: ${pendingTasks.length}
- Overdue: ${overdueTasks.length}

Task details: ${JSON.stringify(tasks)}

Return the JSON object described in the system prompt.`;

  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 400,
    temperature: 0.3, // Slightly higher for more natural reflection
  });

  const content = (res.choices?.[0]?.message as { content?: string } | undefined)?.content ?? "";
  const cleaned = sanitizeModelOutput(content);
  const parsed = extractJson(cleaned);
  if (parsed && validateWeeklySummary(parsed)) {
    return parsed;
  }

  // If parsing failed, attempt to parse loose content
  try {
    const maybe = JSON.parse(cleaned);
    if (validateWeeklySummary(maybe)) return maybe;
  } catch (e) {
    // ignore
  }

  throw new Error("OpenAI response did not contain valid weekly summary JSON");
}
