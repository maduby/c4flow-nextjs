import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_CLASSES_QUERY,
  ANNOUNCEMENT_BAR_QUERY,
} from "@/sanity/lib/queries";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ClassCard } from "@/components/ui/ClassCard";
import { MotionDiv } from "@/components/shared/MotionDiv";

interface ClassesSectionProps {
  heading?: string | null;
  subtitle?: string | null;
  showBookingNote?: boolean | null;
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

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
    <section className="relative overflow-hidden bg-muted py-12 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Our Classes"}
        </SectionHeading>

        <MotionDiv
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.15 }}
        >
          {classes.map((cls) => (
            <MotionDiv key={cls._id} variants={cardReveal}>
              <ClassCard
                danceClass={cls}
                bannerDiscount={getDiscountForClass(cls._id)}
              />
            </MotionDiv>
          ))}
        </MotionDiv>

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
