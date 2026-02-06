import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";
import ProfileClient from "@/components/profile/ProfileClient";

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

  const createdAtISO = user?.createdAt ? new Date(user.createdAt).toISOString() : null;

  return (
    <ProfileClient
      name={user?.name ?? ""}
      email={user?.email ?? ""}
      createdAtISO={createdAtISO}
    />
  );
}
