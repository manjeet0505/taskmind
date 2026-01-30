import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Login</h1>
      <p className="text-slate-300 mb-6">UI-only login page. No authentication logic included.</p>
      <form className="space-y-4">
        <input placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white" />
        <input placeholder="Password" type="password" className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white" />
        <div className="flex items-center justify-between">
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">Sign in</button>
          <Link href="/signup" className="text-sm text-slate-300">Create account</Link>
        </div>
      </form>
    </div>
  );
}
