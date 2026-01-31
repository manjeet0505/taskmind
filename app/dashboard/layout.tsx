import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export const metadata = { title: "Dashboard - TaskMind" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");
  try {
    verifyToken(token);
  } catch (err) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Topbar />
          <main className="p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
