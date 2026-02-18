import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { BUNDLES_BY_CATEGORY_QUERY, DISCOUNT_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PricingCards } from "@/components/ui/PricingCards";

interface PricingSectionProps {
  heading: string;
  subtitle?: string | null;
  bundleCategory: string;
  footerNote?: string | null;
}

function FooterNote({ text }: { text: string }) {
  const parts = text.split(/(Contact Us)/i);
  return (
    <p className="mt-8 text-center text-sm text-neutral-400">
      {parts.map((part, i) =>
        /^contact us$/i.test(part) ? (
          <Link
            key={i}
            href="/contact"
            className="font-medium text-pink-500 underline hover:no-underline"
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export async function PricingSection({
  heading,
  subtitle,
  bundleCategory,
  footerNote,
}: PricingSectionProps) {
  const [{ data: bundles }, { data: discountDoc }] = await Promise.all([
    sanityFetch({
      query: BUNDLES_BY_CATEGORY_QUERY,
      params: { category: bundleCategory },
      stega: false,
    }),
    sanityFetch({ query: DISCOUNT_QUERY, stega: false }),
  ]);

  if (!bundles?.length) return null;

  const discountActive = discountDoc?.enabled && discountDoc?.discountPercent;
  const discountApplies =
    discountActive &&
    ((bundleCategory === "group" && discountDoc.applyToGroupBundles) ||
      (bundleCategory === "private" && discountDoc.applyToPrivateBundles));
  const discountPercent = discountApplies ? discountDoc.discountPercent : null;

  const enrichedBundles = bundles.map(
    (b: {
      _id: string;
      name: string;
      tagline?: string | null;
      price: number;
      salePrice?: number | null;
      note?: string | null;
      highlighted?: boolean | null;
    }) => {
      const original = b.price;
      const manualSale =
        b.salePrice && b.salePrice < original ? b.salePrice : null;
      const globalDiscount = discountPercent
        ? Math.floor(original * (1 - discountPercent / 100))
        : null;

      let effectivePrice: number | null = null;
      if (manualSale && globalDiscount) {
        effectivePrice = Math.min(manualSale, globalDiscount);
      } else {
        effectivePrice = manualSale || globalDiscount;
      }

      const hasDiscount = effectivePrice !== null && effectivePrice < original;

      return {
        ...b,
        originalPrice: original,
        effectivePrice: hasDiscount ? effectivePrice : null,
        hasDiscount,
      };
    }
  );

  return (
    <section className="py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>{heading}</SectionHeading>
        <PricingCards bundles={enrichedBundles} />
        {footerNote && <FooterNote text={footerNote} />}
      </Container>
    </section>
  );
}
