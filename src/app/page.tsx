import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "home" },
    stega: false,
  });

  const ogImage = page?.ogImage?.asset
    ? urlFor(page.ogImage).width(1200).height(630).url()
    : undefined;

  return {
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: page?.seoTitle || "C-4 Flow | Pole & Exotic Dance Studio",
      description:
        page?.seoDescription ||
        "Pole & Exotic Dance Studio in Woodstock, Cape Town. Group and private classes for all levels.",
      url: "/",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
  };
}

export default async function Home() {
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: "home" } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ]);

  if (!page) notFound();

  const siteLogoUrl = settings?.logo?.asset
    ? urlFor(settings.logo).width(320).url()
    : null;

  return (
    <main id="main-content">
      <PageBuilder sections={page.sections} siteLogoUrl={siteLogoUrl} />
    </main>
  );
}
