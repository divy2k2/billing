import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminEmail } from "@/lib/admin";
import { parseSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

function isPublicApiRoute(pathname: string) {
  return pathname === "/api/auth/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico" || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await parseSessionToken(token);

  if (!session || session.email !== getAdminEmail()) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set(
      "error",
      "Your admin session is missing or invalid. Sign in again to continue."
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*"]
};
