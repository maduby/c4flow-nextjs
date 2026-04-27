import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { client } from "@/sanity/lib/client";

interface WebhookPayload {
  _type?: string;
  slug?: { current?: string };
  tags?: string[];
}

const DATA_PATHS = [
  "/sitemap.xml",
  "/knowledge.json",
  "/classes.json",
  "/schedule.json",
  "/pricing.json",
  "/llms.txt",
  "/llms-full.txt",
] as const;

async function getPublishedSitePaths() {
  const data = await client.fetch<{
    pageSlugs: { slug: string }[];
    classSlugs: { slug: string }[];
  }>(`{
    "pageSlugs": *[_type == "page" && defined(slug.current)]{"slug": slug.current},
    "classSlugs": *[_type == "danceClass" && active != false && defined(slug.current)]{"slug": slug.current}
  }`);

  const pagePaths = (data.pageSlugs || []).map((entry) =>
    entry.slug === "home" ? "/" : `/${entry.slug}`,
  );
  const classPaths = (data.classSlugs || []).map(
    (entry) => `/classes/${entry.slug}`,
  );

  return [...pagePaths, ...classPaths];
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

    const docType = body?._type;
    const slug = body?.slug?.current;
    const paths = new Set<string>(DATA_PATHS);

    // Tag-based revalidation (used by next-sanity/live)
    if (Array.isArray(body?.tags) && body.tags.length) {
      body.tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
    }

    if (docType === "page" && slug) {
      paths.add(slug === "home" ? "/" : `/${slug}`);
    }

    if (docType === "danceClass" && slug) {
      paths.add(`/classes/${slug}`);
      paths.add("/");
      paths.add("/classes");
    }

    if (
      Array.isArray(body?.tags) && body.tags.length ||
      [
        "danceClass",
        "weeklySchedule",
        "discount",
        "pricingBundle",
        "siteSettings",
        "announcementBar",
      ].includes(docType || "")
    ) {
      const publishedPaths = await getPublishedSitePaths();
      publishedPaths.forEach((path) => paths.add(path));
    }

    if (["instructor", "testimonial"].includes(docType || "")) {
      paths.add("/");
      paths.add("/about");
    }

    if (
      [
        "siteSettings",
        "announcementBar",
        "danceClass",
        "weeklySchedule",
        "discount",
        "pricingBundle",
      ].includes(docType || "") ||
      (Array.isArray(body?.tags) && body.tags.length > 0)
    ) {
      revalidatePath("/", "layout");
    }

    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({
      revalidated: true,
      paths: [...paths],
      tags: body?.tags || [],
      type: docType,
      slug,
      now: Date.now(),
    });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
