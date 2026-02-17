import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PageBuilder } from "@/components/sections/PageBuilder";
import { notFound } from "next/navigation";

export default async function Home() {
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: "home" } }),
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
