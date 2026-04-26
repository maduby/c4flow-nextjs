import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getSiteOriginForMetadata } from "@/lib/site-origin";

export async function GET() {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", getSiteOriginForMetadata()));
}
