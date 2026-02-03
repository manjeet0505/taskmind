import { NextRequest, NextResponse } from "next/server";

/** Public paths: allowed without authentication */
const PUBLIC_PATHS = new Set([
  "/",
  "/auth/login",
  "/auth/signup",
  "/login",
  "/signup",
]);

/** Auth-only paths: logged-in users must be redirected to dashboard */
const AUTH_PAGE_PATHS = new Set([
  "/auth/login",
  "/auth/signup",
  "/login",
  "/signup",
]);

function isTokenValid(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const raw = Buffer.from(
      parts[1].replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    ).toString("utf-8");
    const payload = JSON.parse(raw) as { exp?: number };
    if (!payload) return false;
    if (payload.exp != null && typeof payload.exp === "number") {
      return payload.exp > Math.floor(Date.now() / 1000);
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value ?? null;
  const isAuthenticated = isTokenValid(token);

  // Logged-in user on auth page → send to dashboard
  if (isAuthenticated && AUTH_PAGE_PATHS.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Not logged in and trying to access protected route → send to login
  if (!isAuthenticated && !PUBLIC_PATHS.has(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    const res = NextResponse.redirect(url);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }

  const res = NextResponse.next();
  // Prevent caching of protected pages so back/refresh doesn't show stale content
  if (pathname.startsWith("/dashboard")) {
    res.headers.set("Cache-Control", "private, no-store, must-revalidate");
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Run on all pathnames except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
