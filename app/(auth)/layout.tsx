import Link from "next/link";

export const metadata = { title: "Auth - TaskMind" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">✓</div>
            TaskMind
          </Link>
          <div className="text-sm text-slate-300">
            <Link href="/" className="hover:underline">Home</Link>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
