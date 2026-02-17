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
    .filter((s) => s.slug !== "home")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await sanityFetch({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    stega: false,
  });

  if (!page) return {};

  const ogImage = page.ogImage?.asset
    ? urlFor(page.ogImage).width(1200).height(630).url()
    : undefined;

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: page.seoTitle || page.title || undefined,
      description: page.seoDescription || undefined,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
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
