/**
 * AI Preferences Management
 * Stores user preferences for AI behavior in localStorage
 * Can be extended to sync with backend user.aiSettings later
 */

const STORAGE_KEY = "taskmind_ai_preferences";

export interface AIPreferences {
  enabled: boolean;
  insightsFrequency: "daily" | "manual";
  responseStyle: "short" | "detailed";
}

const DEFAULT_PREFERENCES: AIPreferences = {
  enabled: true,
  insightsFrequency: "manual",
  responseStyle: "short",
};

/**
 * Get AI preferences from localStorage
 */
export function getAIPreferences(): AIPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing fields
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (e) {
    console.error("Failed to parse AI preferences:", e);
  }
  
  return DEFAULT_PREFERENCES;
}

/**
 * Save AI preferences to localStorage
 */
export function saveAIPreferences(prefs: Partial<AIPreferences>): void {
  if (typeof window === "undefined") return;
  
  try {
    const current = getAIPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event for components to react to changes
    window.dispatchEvent(new CustomEvent("aiPreferencesChanged", { detail: updated }));
  } catch (e) {
    console.error("Failed to save AI preferences:", e);
  }
}

/**
 * Check if AI is enabled
 */
export function isAIEnabled(): boolean {
  return getAIPreferences().enabled;
}

/**
 * Check if insights should be shown automatically (daily)
 */
export function shouldShowDailyInsights(): boolean {
  const prefs = getAIPreferences();
  return prefs.enabled && prefs.insightsFrequency === "daily";
}

/**
 * Get response style preference
 */
export function getResponseStyle(): "short" | "detailed" {
  return getAIPreferences().responseStyle;
}

/**
 * Reset preferences to defaults
 */
export function resetAIPreferences(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("aiPreferencesChanged", { detail: DEFAULT_PREFERENCES }));
}
