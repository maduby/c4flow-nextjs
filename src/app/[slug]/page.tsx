import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PAGE_BY_SLUG_QUERY,
  ALL_PAGE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { JsonLd } from "@/components/shared/JsonLd";
import { buildFaqJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data: slugs } = await sanityFetch({
    query: ALL_PAGE_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return (slugs || [])
    .filter((s: { slug: string }) => s.slug !== "home")
    .map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug }, stega: false }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ]);

  if (!page) return {};

  const ogImage = page.ogImage?.asset
    ? urlFor(page.ogImage).width(1200).height(630).url()
    : settings?.defaultOgImage?.asset
      ? urlFor(settings.defaultOgImage).width(1200).height(630).url()
      : undefined;

  const title = page.seoTitle || page.title || undefined;
  const description = page.seoDescription || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: "C4 Flow",
      title,
      description,
      url: `/${slug}`,
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

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug } }),
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
