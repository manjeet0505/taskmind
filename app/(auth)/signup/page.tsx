import { redirect } from "next/navigation";

export default function SignupPageRedirect() {
  // Redirect legacy /signup -> new /auth/signup
  redirect("/auth/signup");
}
