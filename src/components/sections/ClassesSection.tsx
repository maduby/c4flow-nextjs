import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_CLASSES_QUERY,
  ANNOUNCEMENT_BAR_QUERY,
} from "@/sanity/lib/queries";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ClassCard } from "@/components/ui/ClassCard";

interface ClassesSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  showBookingNote?: boolean | null;
}

export async function ClassesSection({
  heading,
  subtitle,
  showBookingNote,
}: ClassesSectionProps) {
  const [{ data: classes }, { data: announcement }] = await Promise.all([
    sanityFetch({ query: ALL_CLASSES_QUERY }),
    sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY }),
  ]);

  if (!classes?.length) return null;

  // Determine if a banner discount is active
  const promoActive =
    announcement?.enabled &&
    announcement?.discountEnabled &&
    announcement?.discountPercent;

  const discountPercent = promoActive ? announcement.discountPercent : null;
  const discountScope = promoActive ? announcement.discountScope : null;
  const discountClassIds: string[] =
    promoActive && announcement.discountClassIds
      ? (announcement.discountClassIds as string[])
      : [];

  function getDiscountForClass(classId: string): number | null {
    if (!discountPercent) return null;
    if (discountScope === "all") return discountPercent;
    if (discountScope === "specific" && discountClassIds.includes(classId)) {
      return discountPercent;
    }
    return null;
  }

  return (
    <section className="bg-muted py-16 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Our Classes"}
        </SectionHeading>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard
              key={cls._id}
              danceClass={cls}
              bannerDiscount={getDiscountForClass(cls._id)}
            />
          ))}
        </div>

        {showBookingNote && (
          <p className="mt-8 text-center text-sm text-neutral-400">
            Clicking &ldquo;Book Now&rdquo; will redirect you to our booking
            platform (Setmore).
          </p>
        )}
      </Container>
    </section>
  );
}
