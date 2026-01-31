import OpenAI from "openai";

export interface InsightTask {
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

function validateShape(obj: any): obj is InsightsResult {
  if (!obj || typeof obj !== "object") return false;
  if (typeof obj.summary !== "string") return false;
  if (!Array.isArray(obj.focusTasks)) return false;
  if (!Array.isArray(obj.warnings)) return false;
  if (typeof obj.productivityTip !== "string") return false;
  // Validate focusTasks items
  if (!obj.focusTasks.every((f: any) => f && typeof f.title === "string" && typeof f.reason === "string")) return false;
  if (!obj.warnings.every((w: any) => typeof w === "string")) return false;
  return true;
}

export async function generateInsightsWithOpenAI(tasks: InsightTask[], today: Date): Promise<InsightsResult> {
  const client = getOpenAIClient();
  if (!client) throw new Error("OpenAI API key not configured");

  const dateStr = today.toISOString().split("T")[0];

  const systemPrompt = `You are a deterministic assistant that analyzes a user's task list and returns a STRICT JSON object with the following shape: {"summary": string, "focusTasks": [{"title": string, "reason": string}], "warnings": [string], "productivityTip": string }.
- DO NOT modify the task objects.
- DO NOT suggest any database changes or write actions.
- ONLY return valid JSON (no markdown, no prose outside the JSON). If you cannot provide insights, return {"summary": "No insights available today"}.
- Keep answers concise and explainable. Use the task titles exactly as provided.
- Use temperature 0 and deterministic rules only.`;

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
