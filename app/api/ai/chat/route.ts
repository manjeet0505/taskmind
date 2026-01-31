import { NextResponse } from "next/server";

// Chat endpoint intentionally disabled for Phase 3 Step 1 (AI Insights only)
export async function POST() {
  return NextResponse.json({ error: "Chat disabled. Use /api/ai/insights for read-only insights." }, { status: 410 });
}
