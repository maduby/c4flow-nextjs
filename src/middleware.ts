import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/site-url";

/**
 * Discourage indexing of Vercel deployment hostnames. The marketing domain
 * (www.c4flow.co.za) should be the only URL in search results.
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];

  if (host === "c4flow.co.za") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    redirectUrl.host = new URL(CANONICAL_PRODUCTION_ORIGIN).host;
    return NextResponse.redirect(redirectUrl, 308);
  }

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
