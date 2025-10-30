// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/backoffice/:path*"],
};

export function middleware(req: NextRequest) {
  // ดึง token จาก Authorization header
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // ไม่มี header หรือไม่ใช่ Bearer
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  const token = authHeader.split(" ")[1]; // ดึง token จริง ๆ

  try {
    const secret = process.env.SECRET_KEY!;
    const decoded = jwt.verify(token, secret) as { role?: string };

    if (decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url)); // ไม่ใช่ admin -> โดน redirect
    }
    // admin -> ให้เข้าต่อ
    return NextResponse.next();
  } catch (err) {
    // token ไม่ถูกต้องหรือหมดอายุ
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
