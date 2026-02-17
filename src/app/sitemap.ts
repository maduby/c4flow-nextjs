import { MetadataRoute } from "next";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://c4flow.co.za";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await client.fetch<{ slug: string; _updatedAt: string }[]>(
    `*[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
  );

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.slug === "home" ? baseUrl : `${baseUrl}/${page.slug}`,
    lastModified: page._updatedAt,
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1 : 0.8,
  }));

  return [...pageEntries];
}
