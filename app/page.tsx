import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Landing from "./(landing)/page";

export default async function Page() {
  let isAuthenticated = false;
  try {
    const token = (await cookies()).get("token")?.value;
    if (token) {
      verifyToken(token);
      isAuthenticated = true;
    }
  } catch {
    // invalid or expired token
  }
  return <Landing isAuthenticated={isAuthenticated} />;
}
