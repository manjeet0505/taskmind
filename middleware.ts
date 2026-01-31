import { NextRequest, NextResponse } from "next/server";

// Lightweight JWT payload decode + exp check (no signature verification in middleware)
function isTokenValid(token?: string | null) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'));
    if (!payload) return false;
    if (payload.exp && typeof payload.exp === 'number') {
      return payload.exp > Math.floor(Date.now() / 1000);
    }
    return true;
  } catch (err) {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals and api routes
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value ?? null;
  const valid = isTokenValid(token);

  // Protect dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Redirect signed-in users away from auth pages
  if (pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/login' || pathname === '/signup') {
    if (valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/login', '/signup'],
};
