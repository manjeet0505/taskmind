import Link from "next/link";

export const metadata = { title: "Auth - TaskMind" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">✓</div>
            TaskMind
          </Link>
          <div className="text-sm text-slate-300">
            <Link href="/" className="hover:underline">Home</Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
