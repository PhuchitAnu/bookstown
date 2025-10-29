import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // ตรวจ token
  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    if (decoded.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/403";
      return NextResponse.redirect(url);
    }
    // ถ้า admin → ผ่าน
    return NextResponse.next();
  } catch (err: unknown) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}

// กำหนดว่ามีผลเฉพาะบาง path
export const config = {
  matcher: ["/backoffice/:path*"], // ใช้กับทุกหน้าภายใต้ /backoffice
};
