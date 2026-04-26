import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: "home" }, stega: false }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ]);

  const ogImage = page?.ogImage?.asset
    ? urlFor(page.ogImage).width(1200).height(630).url()
    : settings?.defaultOgImage?.asset
      ? urlFor(settings.defaultOgImage).width(1200).height(630).url()
      : undefined;

  const title =
    page?.seoTitle || "C-4 Flow | Pole & Exotic Dance Studio";
  const description =
    page?.seoDescription ||
    "C4 Flow Studio offers pole dancing classes in Cape Town, with group and private sessions for all levels at our inclusive Woodstock studio.";

  return {
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: "C4 Flow",
      title,
      description,
      url: "/",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, type: "image/jpeg" }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
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
  const faqJsonLd = buildFaqJsonLd(page.sections as never);

  return (
    <main id="main-content">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <PageBuilder sections={page.sections} siteLogoUrl={siteLogoUrl} />
    </main>
  );
}
