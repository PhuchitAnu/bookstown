// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// ใช้ Node.js runtime
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (!pathname.startsWith("/backoffice")) return NextResponse.next();
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    if (decoded.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
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
