import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/dashboard")) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  const role = (token.role as string) || "student";
  if (path === "/dashboard" || path === "/dashboard/") {
    const target =
      role === "faculty" ? "/dashboard/faculty" : role === "admin" ? "/dashboard/admin" : "/dashboard/student";
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (path.startsWith("/dashboard/student") && role !== "student") {
    const target = role === "faculty" ? "/dashboard/faculty" : "/dashboard/admin";
    return NextResponse.redirect(new URL(target, req.url));
  }
  if (path.startsWith("/dashboard/faculty") && role !== "faculty") {
    const target = role === "student" ? "/dashboard/student" : "/dashboard/admin";
    return NextResponse.redirect(new URL(target, req.url));
  }
  if (path.startsWith("/dashboard/admin") && role !== "admin") {
    const target = role === "student" ? "/dashboard/student" : "/dashboard/faculty";
    return NextResponse.redirect(new URL(target, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
