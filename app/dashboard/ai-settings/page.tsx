"use client";

import { useState, useEffect } from "react";
import { getAIPreferences, saveAIPreferences, type AIPreferences } from "@/lib/ai-preferences";

export default function AISettingsPage() {
  const [preferences, setPreferences] = useState<AIPreferences>(() => getAIPreferences());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Listen for preference changes from other tabs/windows
    const handleChange = (e: CustomEvent) => {
      setPreferences(e.detail);
    };
    window.addEventListener("aiPreferencesChanged", handleChange as EventListener);
    return () => window.removeEventListener("aiPreferencesChanged", handleChange as EventListener);
  }, []);

  const handleChange = (key: keyof AIPreferences, value: any) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveAIPreferences(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="section-spacing-lg">
        <h1 className="text-page-title text-3xl text-slate-50 mb-2">AI Settings</h1>
        <p className="text-body text-lg">
          Control how AI assists you. All features remain optional and require your approval.
        </p>
      </div>

      {/* Save indicator */}
      {saved && (
        <div className="section-spacing p-3 glass-card bg-emerald-500/10 text-emerald-200 text-sm fade-slide-up">
          ✓ Settings saved
        </div>
      )}

      <div className="space-y-6">
        {/* Section 1: AI Enable/Disable — AI accent */}
        <section className="p-6 glass-card card-hover">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-section-title text-xl ai-heading mb-2">AI Assistance</h2>
              <p className="text-body text-sm">
                Turn AI suggestions on or off. You can always manage tasks manually.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={preferences.enabled}
                onChange={(e) => handleChange("enabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
          {!preferences.enabled && (
            <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-600/40">
              <p className="text-slate-300 text-sm">
                AI features are disabled. You can still manage all tasks manually. Enable AI anytime to get suggestions and insights.
              </p>
            </div>
          )}
        </section>

        {/* Section 2: Insights Frequency */}
        <section className="p-6 glass-card card-hover">
          <h2 className="text-section-title text-xl text-slate-50 mb-2">Insights Frequency</h2>
          <p className="text-body text-sm mb-4">
            Choose how often you want AI insights.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-slate-800/40"
              style={{
                borderColor: preferences.insightsFrequency === "daily" ? "rgba(129, 140, 248, 0.5)" : "rgba(148, 163, 184, 0.3)",
                backgroundColor: preferences.insightsFrequency === "daily" ? "rgba(99, 102, 241, 0.1)" : "transparent",
              }}
            >
              <input
                type="radio"
                name="insightsFrequency"
                value="daily"
                checked={preferences.insightsFrequency === "daily"}
                onChange={(e) => handleChange("insightsFrequency", e.target.value)}
                className="w-4 h-4 text-indigo-500 border-slate-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-slate-50 font-medium">Daily insights</div>
                <div className="text-slate-400 text-xs">AI will provide insights automatically each day</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-slate-800/40"
              style={{
                borderColor: preferences.insightsFrequency === "manual" ? "rgba(129, 140, 248, 0.5)" : "rgba(148, 163, 184, 0.3)",
                backgroundColor: preferences.insightsFrequency === "manual" ? "rgba(99, 102, 241, 0.1)" : "transparent",
              }}
            >
              <input
                type="radio"
                name="insightsFrequency"
                value="manual"
                checked={preferences.insightsFrequency === "manual"}
                onChange={(e) => handleChange("insightsFrequency", e.target.value)}
                className="w-4 h-4 text-indigo-500 border-slate-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-slate-50 font-medium">Manual (only when requested)</div>
                <div className="text-slate-400 text-xs">You request insights when you need them</div>
              </div>
            </label>
          </div>
          {!preferences.enabled && (
            <div className="mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/40">
              <p className="text-slate-400 text-xs">
                Enable AI assistance above to use insights.
              </p>
            </div>
          )}
        </section>

        {/* Section 3: AI Response Style */}
        <section className="p-6 glass-card card-hover">
          <h2 className="text-section-title text-xl text-slate-50 mb-2">AI Response Style</h2>
          <p className="text-body text-sm mb-4">
            Control how much detail the AI provides.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-slate-800/40"
              style={{
                borderColor: preferences.responseStyle === "short" ? "rgba(129, 140, 248, 0.5)" : "rgba(148, 163, 184, 0.3)",
                backgroundColor: preferences.responseStyle === "short" ? "rgba(99, 102, 241, 0.1)" : "transparent",
              }}
            >
              <input
                type="radio"
                name="responseStyle"
                value="short"
                checked={preferences.responseStyle === "short"}
                onChange={(e) => handleChange("responseStyle", e.target.value)}
                className="w-4 h-4 text-indigo-500 border-slate-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-slate-50 font-medium">Short & concise</div>
                <div className="text-slate-400 text-xs">Brief, actionable responses</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-smooth hover:bg-slate-800/40"
              style={{
                borderColor: preferences.responseStyle === "detailed" ? "rgba(129, 140, 248, 0.5)" : "rgba(148, 163, 184, 0.3)",
                backgroundColor: preferences.responseStyle === "detailed" ? "rgba(99, 102, 241, 0.1)" : "transparent",
              }}
            >
              <input
                type="radio"
                name="responseStyle"
                value="detailed"
                checked={preferences.responseStyle === "detailed"}
                onChange={(e) => handleChange("responseStyle", e.target.value)}
                className="w-4 h-4 text-indigo-500 border-slate-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-slate-50 font-medium">Detailed explanations</div>
                <div className="text-slate-400 text-xs">More context and reasoning</div>
              </div>
            </label>
          </div>
          {!preferences.enabled && (
            <div className="mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/40">
              <p className="text-slate-400 text-xs">
                Enable AI assistance above to use this setting.
              </p>
            </div>
          )}
        </section>

        {/* Section 4: Transparency Notice — highlighted */}
        <section className="p-6 glass-card-strong card-hover">
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">🔒</div>
            <div className="flex-1">
              <h2 className="text-section-title text-xl text-slate-50 mb-3">Transparency & Trust</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="text-slate-50 font-medium text-sm">AI only reads your tasks</div>
                    <div className="text-slate-300 text-xs mt-0.5">
                      AI analyzes your tasks to provide insights and suggestions. It never accesses anything else.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="text-slate-50 font-medium text-sm">AI never changes data automatically</div>
                    <div className="text-slate-300 text-xs mt-0.5">
                      AI suggests changes, but nothing happens until you approve it.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="text-slate-50 font-medium text-sm">All actions require your approval</div>
                    <div className="text-slate-300 text-xs mt-0.5">
                      You have full control. Every suggestion can be accepted or ignored.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
