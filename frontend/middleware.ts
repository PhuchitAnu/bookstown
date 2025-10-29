import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ถ้าไม่มี token และพยายามเข้า /backoffice
  if (!token && pathname.startsWith("/backoffice")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ตรวจสิทธิ์ token
  if (token && pathname.startsWith("/backoffice")) {
    try {
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
      if (decoded.role !== "admin") {
        // redirect กลับหน้า home หรือ forbidden page
        const url = req.nextUrl.clone();
        url.pathname = "/403";
        return NextResponse.redirect(url);
      }
    } catch (err) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// กำหนดว่ามีผลเฉพาะบาง path
export const config = {
  matcher: ["/backoffice/:path*"], // ใช้กับทุกหน้าภายใต้ /backoffice
};
