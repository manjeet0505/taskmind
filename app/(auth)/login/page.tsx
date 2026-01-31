import { redirect } from "next/navigation";

export default function LoginPageRedirect() {
  // Redirect legacy /login -> new /auth/login
  redirect("/auth/login");
}
