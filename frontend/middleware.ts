// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ใช้ Node.js runtime
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("[Middleware] pathname:", pathname);
  console.log("[Middleware] token:", token); // ดูว่ามี token หรือไม่

  if (!pathname.startsWith("/backoffice")) return NextResponse.next();

  if (!token) {
    console.log("[Middleware] No token, redirect to /signin");
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    console.log("[Middleware] decoded token:", decoded); // ดู payload

    if (decoded.role !== "admin") {
      console.log("[Middleware] role not admin, redirect to /403");
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }

    console.log("[Middleware] Admin verified, passing through");
    return NextResponse.next();
  } catch (err) {
    console.log("[Middleware] JWT error:", err);
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/backoffice/:path*"],
};
