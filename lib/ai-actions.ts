/**
 * AI suggestion: human-in-the-loop only. AI never applies; user must confirm.
 */

export const AI_ACTION_TYPES = [
  "CHANGE_PRIORITY",
  "RESCHEDULE_TASK",
  "CHANGE_STATUS",
  "SUGGEST_BREAKDOWN",
] as const;

export type AIActionType = (typeof AI_ACTION_TYPES)[number];

/** Allowed task fields that can be updated via apply (must match Task PATCH) */
export const ALLOWED_TASK_UPDATE_KEYS = [
  "title",
  "description",
  "status",
  "priority",
  "category",
  "dueDate",
  "tags",
] as const;

export type AllowedTaskUpdateKey = (typeof ALLOWED_TASK_UPDATE_KEYS)[number];

export interface AISuggestion {
  actionType: AIActionType;
  targetTaskId: string;
  suggestedChange: Record<string, unknown>;
  reason: string;
}

export function isAIActionType(s: string): s is AIActionType {
  return AI_ACTION_TYPES.includes(s as AIActionType);
}

export function sanitizeSuggestedChange(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_TASK_UPDATE_KEYS) {
    if (raw[key] !== undefined) out[key] = raw[key];
  }
  return out;
}
