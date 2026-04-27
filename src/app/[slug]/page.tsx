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
import { getKnowledgeBase } from "@/lib/catalog";
import { buildCatalogPageJsonLd } from "@/lib/structured-data";

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

  const [{ data: page }, { data: settings }, knowledge] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
    getKnowledgeBase(),
  ]);

  if (!page) notFound();

  const siteLogoUrl = settings?.logo?.asset
    ? urlFor(settings.logo).width(320).url()
    : null;
  const faqJsonLd = buildFaqJsonLd(page.sections as never);
  const sectionTypes = (page.sections || [])
    .map((section: { _type?: string | null }) => section?._type || "")
    .filter(Boolean);
  const showCatalogJsonLd = sectionTypes.some((type: string) =>
    [
      "classesSection",
      "classDetailsSection",
      "scheduleSection",
      "pricingSection",
    ].includes(type),
  );
  const catalogJsonLd = showCatalogJsonLd
    ? buildCatalogPageJsonLd({
        pageUrl: `${knowledge.site.url}/${slug}`,
        pageTitle: page.seoTitle || page.title || slug,
        pageDescription:
          page.seoDescription ||
          `Browse ${knowledge.site.name} classes, schedule, and pricing.`,
        classes: knowledge.classes,
        bundles: knowledge.bundles,
      })
    : null;

  return (
    <main id="main-content">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {catalogJsonLd && <JsonLd data={catalogJsonLd} />}
      <PageBuilder sections={page.sections} siteLogoUrl={siteLogoUrl} />
    </main>
  );
}
