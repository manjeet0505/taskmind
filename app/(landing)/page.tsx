"use client";

import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden font-sans app-shell text-slate-50">
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 glass-card-strong border border-white/5 backdrop-blur-xl mx-4 md:mx-10 mt-4 rounded-2xl">
        <Link href="/" className="text-2xl font-bold flex items-center gap-3 hover:opacity-95 transition">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-slate-50 font-bold shadow-lg shadow-indigo-500/40">
            ✺
          </div>
          <span className="tracking-tight">TaskMind</span>
        </Link>
        <div className="hidden md:flex gap-8 items-center text-sm">
          <a href="#features" className="text-slate-200/80 hover:text-white transition">Features</a>
          <a href="#ai" className="text-slate-200/80 hover:text-white transition">AI Studio</a>
          <a href="#pricing" className="text-slate-200/80 hover:text-white transition">Pricing</a>
          <Link href="/auth/login" className="px-4 py-2 rounded-lg border border-slate-500/60 text-slate-100/90 hover:bg-slate-100/5 transition">
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2 rounded-lg gradient-btn text-white font-semibold"
          >
            Launch Workspace
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr,minmax(0,1fr)] gap-12 items-center mb-20 page-enter">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-indigo-300/40 bg-indigo-500/10 text-indigo-100 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              AI-native task OS
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-5 leading-tight tracking-tight">
              Tasks meet{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-sky-300 to-pink-300">
                real-time AI
              </span>
              .
            </h1>
            <p className="text-base md:text-lg text-slate-200/85 max-w-xl mb-8 leading-relaxed">
              TaskMind feels like having a focused AI partner embedded in your day. Watch your
              priorities, focus windows, and next moves come alive on a living gradient canvas.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/auth/signup"
                className="px-7 py-3 rounded-xl gradient-btn text-sm font-semibold"
              >
                Start your AI dashboard
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 rounded-xl border border-slate-400/60 text-slate-100/90 text-sm hover:bg-slate-100/5 transition"
              >
                Enter existing workspace
              </Link>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="glass-card-strong p-5 md:p-6 rounded-2xl float-slow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="ai-icon-glow">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-200/60">
                    AI briefing
                  </p>
                  <p className="text-sm text-slate-50/90">Your next 3 hours</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-full text-[11px] font-semibold gradient-btn">
                Generate plan
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-indigo-300">●</span>
                <p className="text-slate-100/90">
                  Ship <span className="font-semibold text-indigo-200">dashboard v1</span> before
                  lunch – you’re 72% through this milestone.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-cyan-300">●</span>
                <p className="text-slate-100/90">
                  Protect a 90‑minute{" "}
                  <span className="font-semibold text-cyan-200">deep work</span> block between
                  10:30–12:00.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-[2px] text-pink-300">●</span>
                <p className="text-slate-100/90">
                  Two tasks look overloaded – let the assistant rebalance your week.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl glass-card card-hover">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Scalable routing</h3>
            <p className="text-slate-200/80 text-sm">
              App Router groups built for SaaS: auth, dashboard, AI endpoints – all wired and ready
              for your product.
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-card card-hover">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">AI-first dashboard</h3>
            <p className="text-slate-200/80 text-sm">
              AI insights and chat live next to your tasks, not buried in a separate tool.
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-card card-hover">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Motion that feels alive</h3>
            <p className="text-slate-200/80 text-sm">
              Subtle float, glow, and message animations tuned to feel cinematic—not corporate.
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-10 py-10 px-6 md:px-12 text-center text-xs text-slate-300/70">
        © 2025 TaskMind. Built for AI‑native product teams.
      </footer>
    </div>
  );
}
