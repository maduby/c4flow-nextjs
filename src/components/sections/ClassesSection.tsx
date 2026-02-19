import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_CLASSES_QUERY,
  DISCOUNT_QUERY,
  WEEKLY_SCHEDULE_QUERY,
} from "@/sanity/lib/queries";
import { Info } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ClassCard } from "@/components/ui/ClassCard";
import { MotionDiv } from "@/components/shared/MotionDiv";

const DAY_SHORT: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tues",
  wednesday: "Wed",
  thursday: "Thurs",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

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
  const [{ data: classes }, { data: discountDoc }, { data: schedule }] =
    await Promise.all([
      sanityFetch({ query: ALL_CLASSES_QUERY }),
      sanityFetch({ query: DISCOUNT_QUERY, stega: false }),
      sanityFetch({ query: WEEKLY_SCHEDULE_QUERY }),
    ]);

  if (!classes?.length) return null;

  const promoActive = discountDoc?.enabled && discountDoc?.discountPercent;

  const discountPercent = promoActive ? discountDoc.discountPercent : null;
  const discountScope = promoActive ? discountDoc.discountScope : null;
  const discountClassIds: string[] =
    promoActive && discountDoc.discountClassIds
      ? (discountDoc.discountClassIds as string[])
      : [];

  function getDiscountForClass(classId: string): number | null {
    if (!discountPercent) return null;
    if (discountScope === "all") return discountPercent;
    if (discountScope === "specific" && discountClassIds.includes(classId)) {
      return discountPercent;
    }
    return null;
  }

  // Derive shortened day names per class from the weekly schedule
  const daysByClass: Record<string, string> = {};
  if (schedule?.slots) {
    const buckets: Record<string, Set<string>> = {};
    for (const slot of schedule.slots as { classId: string; day: string }[]) {
      if (!buckets[slot.classId]) buckets[slot.classId] = new Set();
      buckets[slot.classId].add(slot.day.toLowerCase());
    }
    for (const [classId, daySet] of Object.entries(buckets)) {
      const sorted = DAY_ORDER.filter((d) => daySet.has(d));
      const short = sorted.map((d) => DAY_SHORT[d] || d);
      if (short.length <= 2) {
        daysByClass[classId] = short.join(" & ");
      } else {
        daysByClass[classId] =
          short.slice(0, -1).join(", ") + " & " + short[short.length - 1];
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-muted py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Our Classes"}
        </SectionHeading>

        <MotionDiv
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.15 }}
        >
          {classes.map((cls: { _id: string; [key: string]: unknown }) => (
            <MotionDiv key={cls._id} variants={cardReveal}>
              <ClassCard
                danceClass={cls as never}
                bannerDiscount={getDiscountForClass(cls._id)}
                detailsHref={`/classes#${cls._id}`}
                scheduleDays={daysByClass[cls._id] || null}
              />
            </MotionDiv>
          ))}
        </MotionDiv>

        {showBookingNote && (
          <p className="mt-8 flex flex-col items-center gap-1 text-center text-sm text-neutral-400">
            <Info size={14} className="shrink-0" aria-hidden="true" />
            Clicking &ldquo;Book Now&rdquo; will redirect you to our booking
            platform (Setmore).
          </p>
        )}
      </Container>
    </section>
  );
}
