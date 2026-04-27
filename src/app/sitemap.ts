import { MetadataRoute } from "next";
import { createClient } from "next-sanity";
import { getSiteOriginForMetadata } from "@/lib/site-origin";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteOriginForMetadata();

  const { pages, classes } = await client.fetch<{
    pages: { slug: string; _updatedAt: string }[];
    classes: { slug: string; _updatedAt: string }[];
  }>(`{
    "pages": *[_type == "page" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    },
    "classes": *[_type == "danceClass" && active != false && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }
  }`);

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.slug === "home" ? baseUrl : `${baseUrl}/${page.slug}`,
    lastModified: page._updatedAt,
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1 : 0.8,
  }));

  const classEntries: MetadataRoute.Sitemap = classes.map((entry) => ({
    url: `${baseUrl}/classes/${entry.slug}`,
    lastModified: entry._updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...pageEntries, ...classEntries];
}
