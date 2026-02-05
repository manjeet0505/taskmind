"use client";

import { useState, useEffect } from "react";

const ONBOARDING_STORAGE_KEY = "taskmind_onboarding_completed";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!completed) {
      // Small delay to ensure smooth entrance
      setTimeout(() => setIsVisible(true), 300);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setIsVisible(false);
    setTimeout(() => onComplete(), 200);
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setIsVisible(false);
    setTimeout(() => onComplete(), 200);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  if (!isVisible) return null;

  const steps = [
    {
      title: "Welcome!",
      content: (
        <div className="text-center space-y-4">
          <div className="text-5xl mb-4">👋</div>
          <p className="text-slate-200 text-lg leading-relaxed">
            This app helps you manage tasks with the support of AI.
          </p>
          <p className="text-slate-300 text-base">
            AI suggests and explains — you stay in control.
          </p>
        </div>
      ),
    },
    {
      title: "How it works",
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl shrink-0">
              ➕
            </div>
            <div>
              <h3 className="text-slate-50 font-semibold mb-1">Add tasks</h3>
              <p className="text-slate-300 text-sm">Create tasks with titles, descriptions, and priorities.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-2xl shrink-0">
              🤖
            </div>
            <div>
              <h3 className="text-slate-50 font-semibold mb-1">AI analyzes priorities</h3>
              <p className="text-slate-300 text-sm">AI reviews your tasks and suggests what to focus on.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl shrink-0">
              ✋
            </div>
            <div>
              <h3 className="text-slate-50 font-semibold mb-1">You choose what to apply</h3>
              <p className="text-slate-300 text-sm">Review suggestions and decide what works for you.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "AI trust & control",
      content: (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0">🔒</div>
              <div>
                <h3 className="text-slate-50 font-semibold mb-1">AI only reads your tasks</h3>
                <p className="text-slate-300 text-sm">AI analyzes your tasks to provide insights and suggestions.</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0">🚫</div>
              <div>
                <h3 className="text-slate-50 font-semibold mb-1">No automatic changes</h3>
                <p className="text-slate-300 text-sm">AI never modifies your tasks without your approval.</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0">✅</div>
              <div>
                <h3 className="text-slate-50 font-semibold mb-1">All actions require your approval</h3>
                <p className="text-slate-300 text-sm">You have full control over every AI suggestion.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-slide-up"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card-strong border border-white/20 shadow-2xl rounded-2xl p-8 fade-slide-up">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition text-sm font-medium"
          aria-label="Skip onboarding"
        >
          Skip
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-indigo-400"
                  : index < currentStep
                  ? "w-2 bg-indigo-600"
                  : "w-2 bg-slate-600"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="mb-8 min-h-[280px]">
          <h2 
            key={`title-${currentStep}`}
            className="text-2xl font-bold text-slate-50 mb-6 text-center fade-slide-up"
          >
            {steps[currentStep].title}
          </h2>
          <div 
            key={`content-${currentStep}`}
            className={`fade-slide-up ${isAnimating ? "opacity-0" : "opacity-100"} transition-opacity duration-150`}
          >
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              currentStep === 0
                ? "text-slate-500 cursor-not-allowed"
                : "text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/60"
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl gradient-btn text-white font-semibold text-sm flex-1 max-w-[200px] mx-auto"
          >
            {currentStep === 2 ? "Get Started" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to check if onboarding should be shown
export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
}

// Helper function to reset onboarding (useful for testing)
export function resetOnboarding() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
