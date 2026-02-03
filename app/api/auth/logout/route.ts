import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST() {
  const serialized = cookie.serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.headers.set("Set-Cookie", serialized);
  return res;
}
