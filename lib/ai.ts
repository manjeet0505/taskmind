import { ITask } from "@/models/Task";

// Simple in-memory cache to avoid re-running same work often (per user)
const cache = new Map<string, { ts: number; payload: any }>();
const TTL = 30 * 1000; // 30s

function cacheGet(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.payload;
}

function cacheSet(key: string, payload: any) {
  cache.set(key, { ts: Date.now(), payload });
}

export function summarizeTasks(tasks: ITask[], today = new Date()) {
  // Inputs are the user's tasks only. All outputs are deterministic and rule-based.
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < today && t.status !== "done");
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done");
  const pending = tasks.filter((t) => t.status !== "done");

  // Choose top priorities: prefer high priority, then nearest due date, then createdAt
  const priorities = [...pending]
    .sort((a, b) => {
      if (a.priority !== b.priority) return priorityRank(b.priority) - priorityRank(a.priority);
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })
    .slice(0, 3)
    .map((t) => ({ id: t._id?.toString(), title: t.title }));

  const warnings: any = {};
  if (overdue.length > 0) warnings.overdue = overdue.map((t) => ({ id: t._id?.toString(), title: t.title, daysOverdue: daysBetween(new Date(t.dueDate!), today) }));
  if (highPriority.length > 5) warnings.tooManyHighPriority = { count: highPriority.length, message: "You have many high-priority tasks. Consider lowering some priorities or rescheduling." };

  const summary = buildSummary({ overdue, highPriority, pending });

  const productivityTips = generateTips({ overdue, highPriority, pending });

  // Add reasons per priority
  const prioritiesWithReasons = priorities.map((p) => {
    const t = tasks.find((x) => x._id?.toString() === p.id);
    const reasons: string[] = [];
    if (!t) reasons.push("Task still exists in your list");
    else {
      if (t.priority === "high") reasons.push("marked high priority");
      if (t.dueDate && new Date(t.dueDate) < today) reasons.push("overdue");
      if (t.dueDate) {
        const days = daysBetween(new Date(t.dueDate), today);
        if (days <= 2 && t.status !== "done") reasons.push("due soon");
      }
    }
    return { id: p.id, title: p.title, reason: reasons.join(", ") || "Good next task" };
  });

  return {
    summary,
    priorities: prioritiesWithReasons,
    warnings,
    productivityTips,
  };
}

export function chatReply(tasks: ITask[], message: string, today = new Date()) {
  // deterministic matching of supported intents
  const key = `chat:${message.trim().toLowerCase()}:${tasks.length}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const msg = message.trim().toLowerCase();
  let reply: any = { reply: "", notes: "" };

  if (msg.includes("what should i work") || msg.includes("what should i do") || msg.includes("what to work")) {
    const top = summarizeTasks(tasks, today).priorities;
    if (!top || top.length === 0) {
      reply.reply = "I don't see any active tasks — create one and I'll help prioritize.";
    } else {
      reply.reply = `Start with ${top.map((t: any) => `"${t.title}"`).join(" then ")}. Reason: ${top.map((t: any) => t.reason).join("; ")}.`;
    }
  } else if (msg.includes("overdue")) {
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < today && t.status !== "done");
    if (overdue.length === 0) reply.reply = "You have no overdue tasks.";
    else reply.reply = `There are ${overdue.length} overdue task(s): ${overdue.map((t) => `"${t.title}"`).join(", ")}. Consider rescheduling or completing them.`;
  } else if (msg.includes("plan") || msg.includes("help me plan")) {
    const top = summarizeTasks(tasks, today).priorities;
    reply.reply = "Here's a simple plan: 1) Pick your top 1-3 tasks from your priorities; 2) Estimate time and block focused slots; 3) Break any complex task into subtasks. I can suggest breaking tasks if you want.";
  } else {
    // Fallback: try to find task by title mention
    const found = tasks.find((t) => message.toLowerCase().includes(t.title.toLowerCase()));
    if (found) {
      reply.reply = `Task "${found.title}" (priority: ${found.priority}, status: ${found.status}) — ${found.description?.slice(0, 200) || "no details"}.`;
    } else {
      reply.reply = "I didn't understand that. Ask about which tasks are overdue, what to work on today, or say 'help me plan my day'.";
    }
  }

  cacheSet(key, reply);
  return reply;
}

function buildSummary({ overdue, highPriority, pending }: { overdue: ITask[]; highPriority: ITask[]; pending: ITask[] }) {
  if (overdue.length > 0) return `You have ${overdue.length} overdue task(s). Focus on overdue and high-priority items this week.`;
  if (highPriority.length > 0) return `You have ${highPriority.length} high-priority tasks. Start with the most urgent ones.`;
  if (pending.length === 0) return "No active tasks — great job!";
  return `You have ${pending.length} active task(s). Prioritize by due date and priority.`;
}

function generateTips({ overdue, highPriority, pending }: { overdue: ITask[]; highPriority: ITask[]; pending: ITask[] }) {
  const tips: string[] = [];
  if (overdue.length > 0) tips.push("Reschedule or split overdue tasks into smaller chunks.");
  if (highPriority.length > 3) tips.push("You have many high-priority tasks; re-evaluate and lower priority where possible.");
  if (pending.length > 5) tips.push("Focus on 2-3 tasks per day to avoid context-switching.");
  if (tips.length === 0) tips.push("Maintain the momentum: pick one meaningful task and finish it.");
  return tips;
}

function daysBetween(d1: Date, d2: Date) {
  const ms = d2.setHours(0, 0, 0, 0) - d1.setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function priorityRank(p: string) {
  if (p === "high") return 3;
  if (p === "medium") return 2;
  return 1;
}

// ------------------------------------------------------------------
// insightsForToday
// - Input must be minimal (title, status, priority, dueDate)
// - Output is deterministic and matches the required strict JSON shape
// ------------------------------------------------------------------
export function insightsForToday(
  tasks: Array<{ title: string; status: string; priority: string; dueDate?: string | null }>,
  today = new Date()
) {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;

  const normalize = (s?: string | null) => (s ? new Date(s) : null);
  const overdue = tasks.filter((task) => task.dueDate && normalize(task.dueDate)! < t && task.status !== "done");
  const highPriority = tasks.filter((task) => task.priority === "high" && task.status !== "done");
  const pending = tasks.filter((task) => task.status !== "done");

  const sortByTitle = (arr: typeof tasks) => arr.slice().sort((a, b) => a.title.localeCompare(b.title));

  // Build candidate list in deterministic order: overdue -> dueToday -> highPriority -> dueSoon (<=2d) -> others
  const dueToday = tasks.filter((task) => {
    const d = normalize(task.dueDate);
    return d && d.setHours(0, 0, 0, 0) === t.getTime() && task.status !== "done";
  });

  const dueSoon = tasks.filter((task) => {
    const d = normalize(task.dueDate);
    if (!d || task.status === "done") return false;
    const diff = Math.round((d.setHours(0, 0, 0, 0) - t.getTime()) / msPerDay);
    return diff > 0 && diff <= 2;
  });

  const chosen: Array<{ title: string; status: string; priority: string; dueDate?: string | null }> = [];
  const seen = new Set<string>();
  function addFrom(arr: typeof tasks) {
    for (const task of arr) {
      if (seen.has(task.title)) continue;
      chosen.push(task);
      seen.add(task.title);
      if (chosen.length >= 3) break;
    }
  }

  addFrom(sortByTitle(overdue));
  if (chosen.length < 3) addFrom(sortByTitle(dueToday));
  if (chosen.length < 3) addFrom(sortByTitle(highPriority));
  if (chosen.length < 3) addFrom(sortByTitle(dueSoon));
  if (chosen.length < 3) addFrom(sortByTitle(tasks));

  const focusTasks = chosen.slice(0, 3).map((task) => {
    const d = normalize(task.dueDate);
    let reason = "Recommended for today";
    if (d && d < t) reason = `Overdue by ${Math.abs(daysBetween(d, t))} day(s)`;
    else if (d && daysBetween(t, d) === 0) reason = "Due today";
    else if (task.priority === "high") reason = "High priority";
    else if (d && daysBetween(t, d) <= 2) reason = `Due in ${daysBetween(t, d)} day(s)`;
    return { title: task.title, reason };
  });

  const warnings: string[] = [];
  if (overdue.length > 0) warnings.push("Overdue tasks exist");
  if (highPriority.length > 5) warnings.push("Too many high priority tasks");

  let productivityTip = "Focus on 1-2 tasks today and make steady progress.";
  if (overdue.length > 0) productivityTip = "Address overdue tasks first or reschedule them.";
  else if (highPriority.length > 3) productivityTip = "Re-evaluate high-priority tasks; avoid overload.";

  const summary =
    overdue.length > 0
      ? `You have ${overdue.length} overdue tasks. Focus on clearing or rescheduling them.`
      : highPriority.length > 0
      ? `You have ${highPriority.length} high-priority tasks. Aim to complete the most urgent.`
      : pending.length === 0
      ? "No active tasks — great job!"
      : `You have ${pending.length} active tasks. Prioritize by due date and priority.`;

  return {
    summary,
    focusTasks,
    warnings,
    productivityTip,
  } as const;
}

export default { summarizeTasks, chatReply, insightsForToday }; 
