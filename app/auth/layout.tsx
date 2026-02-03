import Link from "next/link";

export const metadata = { title: "Auth - TaskMind" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-sans flex items-center justify-center app-shell text-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/40 ring-2 ring-white/10">
              ✺
            </div>
            TaskMind
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition">Home</Link>
        </div>

        <div className="glass-card-strong rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-indigo-950/30">
          {children}
        </div>

        <p className="mt-6 text-center text-slate-500 text-xs">
          AI-powered task management · Secure sign-in
        </p>
      </div>
    </div>
  );
}
