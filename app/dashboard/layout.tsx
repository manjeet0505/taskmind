import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export const metadata = { title: "Dashboard - TaskMind" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/auth/login");
  try {
    verifyToken(token);
  } catch (err) {
    redirect("/auth/login");
  }

  return (
    <div className="app-shell text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 md:p-8 max-w-7xl mx-auto w-full page-enter">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
