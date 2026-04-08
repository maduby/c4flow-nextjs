import { NextResponse, type NextRequest } from "next/server";

/**
 * Discourage indexing of Vercel deployment hostnames. The marketing domain
 * (c4flow.co.za) should be the only URL in search results.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
