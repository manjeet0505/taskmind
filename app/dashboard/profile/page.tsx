import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  let user: any = null;
  try {
    user = await getUserFromToken(token!);
  } catch {
    redirect("/auth/login");
  }

  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-50 mb-6">Profile</h1>

      <div className="space-y-6">
        {/* Account information */}
        <section className="p-6 rounded-xl glass-card space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 tracking-[0.18em] uppercase mb-2">
              Account
            </h2>
            <p className="text-lg font-semibold text-slate-50">
              {user?.name ?? "Unknown user"}
            </p>
            <p className="text-slate-300 text-sm">
              {user?.email ?? "No email available"}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-700/60 text-sm text-slate-300">
            <span className="text-slate-400">Member since </span>
            {createdAt
              ? createdAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown"}
          </div>
        </section>

        {/* Settings & actions */}
        <section className="p-6 rounded-xl glass-card space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 tracking-[0.18em] uppercase">
            Settings & Safety
          </h2>
          <p className="text-slate-300 text-sm">
            Manage how TaskMind and AI work for your account.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/dashboard/ai-settings"
              className="px-4 py-2 rounded-xl border border-slate-600/70 bg-slate-900/40 text-slate-100 text-sm font-medium hover:bg-slate-100/5 transition"
            >
              Open AI Settings
            </Link>
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  );
}
