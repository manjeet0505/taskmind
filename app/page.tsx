"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">✓</div>
          TaskMind
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
          <a href="#ai" className="text-slate-300 hover:text-white transition">AI Integration</a>
          <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
          <Link href="/dashboard" className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition">
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🚀 Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Manage Tasks with
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Intelligent AI Assistance
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Boost your productivity with AI-powered task management. Get smart suggestions, automatic prioritization, and intelligent scheduling.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/dashboard" className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center justify-center transform hover:scale-105">
              Get Started Free
            </Link>
            <button className="px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-md border border-white/20 transition">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Glass Morphism Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl mb-4">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Insights</h3>
            <p className="text-slate-300">Get intelligent task suggestions and priority recommendations powered by advanced AI algorithms.</p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl mb-4">
              🧠
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Scheduling</h3>
            <p className="text-slate-300">Automatic task scheduling that learns from your patterns and optimizes your daily workflow.</p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white text-xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Goal Tracking</h3>
            <p className="text-slate-300">Monitor progress toward your goals with AI-driven analytics and predictive insights.</p>
          </div>
        </div>

        {/* Main Dashboard Preview with Glass Morphism */}
        <div id="features" className="relative">
          <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                Experience the Power of AI Task Management
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Task List Section */}
                <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-purple-400">📋</span> Your Tasks
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded accent-purple-500" defaultChecked />
                      <span className="text-white line-through opacity-60">Design UI mockups</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded accent-purple-500" />
                      <span className="text-white">Implement API integration</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded accent-purple-500" />
                      <span className="text-white">Write documentation</span>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Section */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-400/30 hover:border-purple-400/50 transition">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="text-pink-400">🤖</span> AI Assistant
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-slate-300"><span className="text-purple-400 font-semibold">Suggestion:</span> Schedule &quot;Implement API&quot; for tomorrow based on your availability.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-slate-300"><span className="text-blue-400 font-semibold">Insight:</span> You typically complete tasks 23% faster in the morning.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-slate-300"><span className="text-pink-400 font-semibold">Recommendation:</span> Break &quot;Write documentation&quot; into 3 smaller tasks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div id="ai" className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20">
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">98%</div>
            <p className="text-slate-300">Productivity Increase</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">5M+</div>
            <p className="text-slate-300">Tasks Completed</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">50K+</div>
            <p className="text-slate-300">Happy Users</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">24/7</div>
            <p className="text-slate-300">AI Support</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-12 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals using TaskMind to manage their work smarter and faster with AI assistance.
          </p>
          <Link href="/dashboard" className="inline-block px-12 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105">
            Start Your Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-12 px-6 md:px-12 text-center text-slate-400">
        <p>&copy; 2025 TaskMind. All rights reserved. | Powered by AI</p>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
