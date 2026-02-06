"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-50 mb-4">About TaskMind</h1>
        <p className="text-xl text-slate-300 leading-relaxed">
          AI-assisted task management designed with transparency, control, and respect for your decisions.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1: Why This Product Exists */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">Why This Product Exists</h2>
          <div className="p-6 rounded-xl glass-card space-y-4">
            <p className="text-slate-200 leading-relaxed">
              Modern work involves managing dozens of tasks, deadlines, and priorities. The constant need to decide what to focus on next creates decision fatigue. You spend mental energy choosing between tasks instead of actually doing them.
            </p>
            <p className="text-slate-200 leading-relaxed">
              TaskMind exists to reduce that cognitive load. Instead of automating your workflow or making decisions for you, AI acts as a thoughtful assistant that helps you see patterns, prioritize effectively, and understand your own productivity better.
            </p>
            <p className="text-slate-200 leading-relaxed">
              We believe AI should support human judgment, not replace it. Every suggestion is an invitation to reflect, not a command to execute.
            </p>
          </div>
        </section>

        {/* Section 2: How AI Works */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">How AI Works</h2>
          <div className="p-6 rounded-xl glass-card space-y-4">
            <p className="text-slate-200 leading-relaxed">
              The AI in TaskMind analyzes your tasks using simple, predictable methods:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <div>
                  <p className="text-slate-200 font-medium">It reads task metadata</p>
                  <p className="text-slate-300 text-sm mt-1">
                    The AI only sees basic information: task titles, priorities, due dates, and completion status. It never reads descriptions or personal notes unless you explicitly share them in chat.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <div>
                  <p className="text-slate-200 font-medium">It looks for patterns</p>
                  <p className="text-slate-300 text-sm mt-1">
                    The AI identifies patterns like approaching deadlines, overdue tasks, high-priority items, and completion trends. It uses these patterns to understand your workflow.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <div>
                  <p className="text-slate-200 font-medium">It generates suggestions and explanations</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Based on these patterns, the AI suggests what to focus on, explains why, and offers gentle recommendations. Every suggestion includes reasoning you can evaluate.
                  </p>
                </div>
              </li>
            </ul>
            <p className="text-slate-300 text-sm mt-4 pt-4 border-t border-slate-700/50">
              The AI does not use complex reasoning or hidden logic. Its behavior is explainable and consistent. If you see a suggestion, you can understand why it appeared.
            </p>
          </div>
        </section>

        {/* Section 3: What AI Does Not Do */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">What AI Does Not Do</h2>
          <div className="p-6 rounded-xl glass-card border border-red-500/20 bg-red-500/5 space-y-4">
            <p className="text-slate-200 leading-relaxed font-medium">
              To build trust, we want to be explicit about what the AI cannot and will not do:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1 shrink-0">✗</span>
                <div>
                  <p className="text-slate-200 font-medium">AI does not auto-update tasks</p>
                  <p className="text-slate-300 text-sm mt-1">
                    The AI never modifies your tasks automatically. It can suggest changes, but you must explicitly approve each one. Nothing happens without your consent.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1 shrink-0">✗</span>
                <div>
                  <p className="text-slate-200 font-medium">AI does not make decisions for you</p>
                  <p className="text-slate-300 text-sm mt-1">
                    The AI provides information and suggestions. You decide what to do with them. The AI never assumes it knows better than you about your priorities.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1 shrink-0">✗</span>
                <div>
                  <p className="text-slate-200 font-medium">AI does not access other users' data</p>
                  <p className="text-slate-300 text-sm mt-1">
                    The AI only analyzes your own tasks. It never sees, compares, or learns from other users' data. Your information stays private to you.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1 shrink-0">✗</span>
                <div>
                  <p className="text-slate-200 font-medium">AI does not use hidden automation</p>
                  <p className="text-slate-300 text-sm mt-1">
                    There are no background processes that change your tasks. Every AI action is visible, explainable, and requires your approval.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: User Control & Safety */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">User Control & Safety</h2>
          <div className="p-6 rounded-xl glass-card space-y-4">
            <p className="text-slate-200 leading-relaxed">
              TaskMind is built on a human-in-the-loop design principle. This means:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1 shrink-0">✓</span>
                <div>
                  <p className="text-slate-200 font-medium">AI can be disabled anytime</p>
                  <p className="text-slate-300 text-sm mt-1">
                    You can turn off all AI features in{" "}
                    <Link href="/dashboard/ai-settings" className="text-indigo-400 hover:text-indigo-300 underline">
                      AI Settings
                    </Link>
                    . When disabled, TaskMind works as a standard task manager. No AI, no suggestions, just your tasks.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1 shrink-0">✓</span>
                <div>
                  <p className="text-slate-200 font-medium">All AI actions are opt-in</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Every AI suggestion requires you to click "Apply" before it takes effect. You can also ignore suggestions without any consequence. There are no automatic changes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1 shrink-0">✓</span>
                <div>
                  <p className="text-slate-200 font-medium">User approval is required</p>
                  <p className="text-slate-300 text-sm mt-1">
                    Even if the AI suggests changing a task's priority, due date, or status, nothing happens until you explicitly approve it. You have full control over every action.
                  </p>
                </div>
              </li>
            </ul>
            <p className="text-slate-300 text-sm mt-4 pt-4 border-t border-slate-700/50">
              This design ensures that AI assists you without ever taking control. You remain the decision-maker at every step.
            </p>
          </div>
        </section>

        {/* Section 5: Ethical & Design Principles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">Ethical & Design Principles</h2>
          <div className="p-6 rounded-xl glass-card space-y-4">
            <p className="text-slate-200 leading-relaxed mb-4">
              TaskMind follows these core principles in every feature:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <h3 className="text-slate-50 font-semibold mb-2">Transparency</h3>
                <p className="text-slate-300 text-sm">
                  AI behavior is explainable. When the AI suggests something, it tells you why. There are no black-box decisions.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <h3 className="text-slate-50 font-semibold mb-2">Predictability</h3>
                <p className="text-slate-300 text-sm">
                  The AI behaves consistently. Similar task patterns produce similar suggestions. You can learn to anticipate its behavior.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <h3 className="text-slate-50 font-semibold mb-2">Respect for User Intent</h3>
                <p className="text-slate-300 text-sm">
                  The AI never assumes it knows better than you. It respects your priorities, deadlines, and decisions, even if they differ from its suggestions.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
                <h3 className="text-slate-50 font-semibold mb-2">No Dark Patterns</h3>
                <p className="text-slate-300 text-sm">
                  We don't use manipulative design, hidden defaults, or forced automation. Every feature is optional and clearly explained.
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mt-4 pt-4 border-t border-slate-700/50">
              These principles guide our engineering decisions and ensure TaskMind remains a tool that empowers you, not one that controls you.
            </p>
          </div>
        </section>

        {/* Section 6: Who This Product Is For */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">Who This Product Is For</h2>
          <div className="p-6 rounded-xl glass-card space-y-4">
            <p className="text-slate-200 leading-relaxed">
              TaskMind is designed for people who:
            </p>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <p className="text-slate-200">
                  Want help prioritizing tasks but prefer to make final decisions themselves
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <p className="text-slate-200">
                  Value transparency and want to understand how AI suggestions are generated
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <p className="text-slate-200">
                  Appreciate thoughtful assistance but don't want automation to take over their workflow
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                <p className="text-slate-200">
                  Want to reflect on their productivity patterns without being judged or scored
                </p>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-slate-300 text-sm">
                <strong className="text-slate-200">TaskMind is not for:</strong> Users who want fully automated task management, AI that makes decisions without approval, or systems that optimize productivity metrics above user control.
              </p>
            </div>
            <p className="text-slate-200 leading-relaxed mt-4">
              If you want AI that assists but never controls, TaskMind is built for you.
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="p-6 rounded-xl glass-card border border-indigo-500/20 bg-indigo-500/5 text-center">
          <h3 className="text-xl font-semibold text-slate-50 mb-2">Questions or Feedback?</h3>
          <p className="text-slate-300 text-sm mb-4">
            We're committed to transparency and continuous improvement. If you have questions about how AI works in TaskMind or suggestions for how we can be more transparent, we'd love to hear from you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard/ai-settings"
              className="px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold"
            >
              Configure AI Settings
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-600/60 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60 text-sm font-medium transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
