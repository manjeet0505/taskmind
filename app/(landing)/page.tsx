"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface LandingProps {
  isAuthenticated?: boolean;
}

export default function Landing({ isAuthenticated = false }: LandingProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans app-shell text-slate-50">
      {/* Soft animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-40 h-80 w-80 rounded-full bg-linear-to-br from-indigo-500/30 via-violet-500/25 to-cyan-400/20 blur-3xl float-slow" />
        <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-linear-to-tr from-cyan-400/25 via-sky-500/20 to-emerald-400/25 blur-3xl float-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.12),transparent_60%)] opacity-70" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 border border-white/5 backdrop-blur-xl mx-4 md:mx-10 mt-4 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/5 border-white/10 shadow-lg shadow-black/10"
            : "glass-card-strong"
        }`}
      >
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-3 hover:opacity-95 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-slate-50 font-bold shadow-lg shadow-indigo-500/40">
            ✺
          </div>
          <span className="tracking-tight">TaskMind</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm">
          <a href="#how-it-works" className="text-slate-200/80 hover:text-white transition">
            How it works
          </a>
          <a href="#why-ai" className="text-slate-200/80 hover:text-white transition">
            Why AI
          </a>
          <a href="#features" className="text-slate-200/80 hover:text-white transition">
            Features
          </a>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-lg gradient-btn text-white font-semibold"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg border border-slate-500/60 text-slate-100/90 hover:bg-slate-100/5 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 rounded-lg gradient-btn text-white font-semibold"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-16 md:pb-24 space-y-24 md:space-y-28">
        {/* HERO — AI focus helper */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.25fr,minmax(0,1fr)] gap-12 items-center page-enter">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-indigo-300/40 bg-indigo-500/10 text-indigo-100 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              AI-powered task management
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-5 leading-tight tracking-tight">
              AI that helps you focus on the right tasks, every day.
            </h1>
            <p className="text-base md:text-lg text-slate-200/85 max-w-xl mb-8 leading-relaxed">
              Plan smarter, prioritize better, and stay in control. AI analyzes your tasks and
              deadlines, then suggests what to focus on—you decide what to apply.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-7 py-3 rounded-xl gradient-btn text-sm font-semibold"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="px-7 py-3 rounded-xl gradient-btn text-sm font-semibold"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/auth/login"
                    className="px-6 py-3 rounded-xl border border-slate-400/60 text-slate-100/90 text-sm hover:bg-slate-100/5 transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-300/80">
              No auto-changes. Every AI suggestion is yours to accept or ignore.
            </p>
          </div>

          {/* Hero preview card — AI suggestions snapshot */}
          <div className="glass-card-strong p-5 md:p-6 rounded-2xl float-slow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="ai-icon-glow">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-200/60">
                    AI focus brief
                  </p>
                  <p className="text-sm text-slate-50/90">Today&apos;s priorities</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-full text-[11px] font-semibold gradient-btn">
                Ask the assistant
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-indigo-300">●</span>
                <p className="text-slate-100/90">
                  Start with{" "}
                  <span className="font-semibold text-indigo-200">two deep-focus tasks</span> while
                  your energy is highest.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-cyan-300">●</span>
                <p className="text-slate-100/90">
                  <span className="font-semibold text-cyan-200">Move low-impact work</span> to this
                  afternoon to protect your flow.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-pink-300">●</span>
                <p className="text-slate-100/90">
                  Three tasks look overloaded this week — choose how you want AI to rebalance them.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-300/80">
              <span>AI never edits tasks for you.</span>
              <span className="text-slate-200/90">You approve every change.</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                How TaskMind works
              </h2>
              <p className="mt-2 text-sm text-slate-300/85 max-w-xl">
                A simple flow: you add tasks, AI does the thinking, you stay in control.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl glass-card card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200 text-sm">
                  1
                </span>
                <p className="text-sm font-semibold text-slate-50">Create your tasks</p>
              </div>
              <p className="text-sm text-slate-200/80">
                Capture everything—work, personal, and in-between—just like any task app.
              </p>
            </div>
            <div className="p-5 rounded-2xl glass-card card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-200 text-sm">
                  2
                </span>
                <p className="text-sm font-semibold text-slate-50">
                  AI analyzes priorities and timing
                </p>
              </div>
              <p className="text-sm text-slate-200/80">
                The assistant reads your tasks, deadlines, and workload to propose a focused plan.
              </p>
            </div>
            <div className="p-5 rounded-2xl glass-card card-hover">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200 text-sm">
                  3
                </span>
                <p className="text-sm font-semibold text-slate-50">You choose what to apply</p>
              </div>
              <p className="text-sm text-slate-200/80">
                Accept, tweak, or ignore suggestions with a click. Your plan is always yours.
              </p>
            </div>
          </div>
        </section>

        {/* WHY AI — TRUST SECTION */}
        <section id="why-ai" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Why use AI here?</h2>
              <p className="mt-2 text-sm text-slate-300/85 max-w-xl">
                TaskMind is built to feel helpful, not intrusive. AI supports your judgment instead
                of replacing it.
              </p>
            </div>
          </div>
          <div className="glass-card-strong rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-[1.3fr,minmax(0,1fr)] gap-6 md:gap-8">
            <div className="space-y-3 text-sm text-slate-100/90">
              <div className="flex gap-3">
                <span className="mt-[2px] text-cyan-300">●</span>
                <p>
                  <span className="font-semibold text-slate-50">AI reads your tasks only.</span>{" "}
                  It looks at titles, notes, and due dates to understand what matters today.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[2px] text-indigo-300">●</span>
                <p>
                  <span className="font-semibold text-slate-50">
                    AI never makes automatic changes.
                  </span>{" "}
                  It does not move tasks, close them, or reschedule anything on its own.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[2px] text-emerald-300">●</span>
                <p>
                  <span className="font-semibold text-slate-50">
                    Every suggestion requires your approval.
                  </span>{" "}
                  You always see the recommendation first, then choose what happens next.
                </p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300/85 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <p className="font-semibold text-slate-50/90 tracking-tight">
                Designed for calm, transparent AI.
              </p>
              <p>
                TaskMind is opinionated about control: AI stays advisory. Your tasks, your calendar,
                and your day remain under your command.
              </p>
              <p>
                No surprise edits. No hidden automation. Just clear, explainable suggestions that
                help you decide what to do next.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES PREVIEW */}
        <section id="features" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                A quick look at the AI
              </h2>
              <p className="mt-2 text-sm text-slate-300/85 max-w-xl">
                Three simple ways AI supports your planning without taking over.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl glass-card card-hover">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-200/90 mb-2">
                AI Insights
              </p>
              <h3 className="text-sm font-semibold text-slate-50 mb-1">
                Daily focus suggestions
              </h3>
              <p className="text-sm text-slate-200/80">
                Daily focus suggestions based on your tasks.
              </p>
            </div>
            <div className="p-5 rounded-2xl glass-card card-hover">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/90 mb-2">
                AI Chat
              </p>
              <h3 className="text-sm font-semibold text-slate-50 mb-1">Task‑aware assistant</h3>
              <p className="text-sm text-slate-200/80">
                Ask questions about priorities and deadlines.
              </p>
            </div>
            <div className="p-5 rounded-2xl glass-card card-hover">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/90 mb-2">
                AI Actions
              </p>
              <h3 className="text-sm font-semibold text-slate-50 mb-1">Opt‑in suggestions</h3>
              <p className="text-sm text-slate-200/80">
                Opt‑in suggestions you can apply or ignore.
              </p>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="glass-card-strong rounded-2xl px-6 py-6 md:px-8 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-50">
              Ready to plan your day with AI?
            </p>
          </div>
          <Link
            href={isAuthenticated ? "/dashboard" : "/auth/signup"}
            className="px-6 py-2.5 rounded-xl gradient-btn text-xs font-semibold"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get started"}
          </Link>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mt-4 pb-8 pt-6 px-6 md:px-12 text-xs text-slate-300/80">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <p className="font-semibold text-slate-50/95">TaskMind</p>
            <p className="text-[11px] text-slate-300/85">
              Calm, AI‑assisted task management for focused work.
            </p>
            <p className="text-[11px] text-slate-400/90">
              AI suggestions are advisory only. You stay in control.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex gap-4">
              <Link href="/auth/login" className="hover:text-slate-100 transition">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:text-slate-100 transition">
                Signup
              </Link>
              <Link href="/dashboard" className="hover:text-slate-100 transition">
                Dashboard
              </Link>
            </div>
            <div className="flex gap-4 text-[11px] text-slate-400/90">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-100 transition"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-100 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
