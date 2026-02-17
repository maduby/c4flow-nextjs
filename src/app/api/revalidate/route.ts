import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

interface WebhookPayload {
  _type?: string;
  slug?: { current?: string };
  tags?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }

    // Tag-based revalidation (used by next-sanity/live)
    if (Array.isArray(body?.tags) && body.tags.length) {
      body.tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
      return NextResponse.json({
        revalidated: true,
        tags: body.tags,
        now: Date.now(),
      });
    }

    // Path-based revalidation for standard GROQ webhooks
    const docType = body?._type;
    const slug = body?.slug?.current;

    // Revalidate the specific page if it's a page with a slug
    if (docType === "page" && slug) {
      revalidatePath(slug === "home" ? "/" : `/${slug}`);
    }

    // Always revalidate the homepage and layout (settings, announcement, etc.)
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      type: docType,
      slug,
      now: Date.now(),
    });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
