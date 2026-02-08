/**
 * Deadline Risk Detector — READ-ONLY early-warning system.
 * Uses only: dueDate, priority, status, createdAt.
 * Never modifies any data. Max 3 warnings. Explainable, calm tone.
 */

export type OverallRisk = "low" | "medium" | "high";

export type WarningType = "overdue" | "upcoming" | "overload";

export interface DeadlineWarning {
  type: WarningType;
  message: string;
  reason: string;
}

export interface DeadlineRiskResult {
  overallRisk: OverallRisk;
  warnings: DeadlineWarning[];
  note?: string;
}

export interface TaskForRisk {
  id: string;
  dueDate: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "done";
  createdAt: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(d1: Date, d2: Date): number {
  const a = new Date(d1);
  const b = new Date(d2);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

/**
 * Analyze user tasks for deadline risks. Pure function, no side effects.
 * Returns structured result; never modifies tasks.
 */
export function analyzeDeadlineRisk(
  tasks: TaskForRisk[],
  today: Date = new Date()
): DeadlineRiskResult {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);

  const active = tasks.filter((task) => task.status !== "done");
  const withDue = active.filter((task) => task.dueDate != null);
  const parseDue = (d: string | null) => (d ? new Date(d) : null);

  const warnings: DeadlineWarning[] = [];

  // 1) Overdue: due date in the past, not done
  const overdue = withDue.filter((task) => {
    const d = parseDue(task.dueDate);
    return d && d.setHours(0, 0, 0, 0) < t.getTime();
  });
  if (overdue.length > 0) {
    const count = overdue.length;
    const days = overdue.reduce((acc, task) => {
      const d = parseDue(task.dueDate)!;
      return acc + Math.abs(daysBetween(d, t));
    }, 0);
    warnings.push({
      type: "overdue",
      message: `${count} task${count === 1 ? " is" : "s are"} past due.`,
      reason: "Completing or rescheduling them can reduce stress and keep your plan accurate.",
    });
  }

  // 2) Upcoming: due within 3 days, still pending/in-progress
  const upcoming = withDue.filter((task) => {
    const d = parseDue(task.dueDate);
    if (!d || task.status === "done") return false;
    const days = daysBetween(t, d);
    return days >= 0 && days <= 3;
  });
  if (upcoming.length > 0 && warnings.length < 3) {
    warnings.push({
      type: "upcoming",
      message: `${upcoming.length} task${upcoming.length === 1 ? " is" : "s are"} due in the next few days.`,
      reason: "A quick check can help you decide what to tackle first without last-minute pressure.",
    });
  }

  // 3) Overload: many high-priority tasks in the same short window (e.g. same week)
  const highPriority = active.filter((task) => task.priority === "high");
  const highWithDue = highPriority.filter((task) => task.dueDate != null);
  const inNext7Days = highWithDue.filter((task) => {
    const d = parseDue(task.dueDate)!;
    const days = daysBetween(t, d);
    return days >= 0 && days <= 7;
  });
  if (inNext7Days.length >= 4 && warnings.length < 3) {
    warnings.push({
      type: "overload",
      message: "Several high-priority tasks are due in the same week.",
      reason: "Spreading focus across too many urgent items at once can make it harder to finish any one of them.",
    });
  }

  // Cap at 3 warnings
  const capped = warnings.slice(0, 3);

  // Overall risk
  let overallRisk: OverallRisk = "low";
  if (overdue.length > 0 || inNext7Days.length >= 5) overallRisk = "high";
  else if (capped.length >= 2 || (overdue.length === 0 && inNext7Days.length >= 3)) overallRisk = "medium";

  const note =
    capped.length > 0
      ? "This is an early warning only. You're in control—no changes have been made to your tasks."
      : undefined;

  return {
    overallRisk,
    warnings: capped,
    note,
  };
}
