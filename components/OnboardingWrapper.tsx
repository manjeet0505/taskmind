"use client";

import { useState, useEffect } from "react";
import Onboarding from "./Onboarding";

export default function OnboardingWrapper() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding should be shown
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("taskmind_onboarding_completed");
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return <Onboarding onComplete={handleOnboardingComplete} />;
}
