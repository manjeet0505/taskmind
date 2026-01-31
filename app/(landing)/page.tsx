"use client";

import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">✓</div>
          TaskMind
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
          <a href="#ai" className="text-slate-300 hover:text-white transition">AI Integration</a>
          <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
          <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">Login</Link>
          <Link href="/auth/signup" className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">Signup</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">Welcome to TaskMind</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">A minimal AI-ready task manager foundation. Navigation and layouts are scaffolded for SaaS development.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login" className="px-8 py-3 rounded-lg bg-white/10 text-white">Login</Link>
            <Link href="/auth/signup" className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">Get Started</Link>
          </div>
        </div>

        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Scalable Routing</h3>
            <p className="text-slate-300 text-sm">Clear App Router groups and layouts for SaaS patterns.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Dashboard Shell</h3>
            <p className="text-slate-300 text-sm">Sidebar, topbar, and content outlet ready for feature work.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Design Consistency</h3>
            <p className="text-slate-300 text-sm">Uses existing Tailwind styles from the UI screens.</p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-20 py-12 px-6 md:px-12 text-center text-slate-400">© 2025 TaskMind. All rights reserved.</footer>
    </div>
  );
}
