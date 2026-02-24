import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  return NextResponse.json({
    from: "nextjs",
    path: "/.well-known/acme-challenge/" + token,
    token,
  });
}
