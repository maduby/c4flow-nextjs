import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  ALL_CLASSES_QUERY,
  DISCOUNT_QUERY,
  WEEKLY_SCHEDULE_QUERY,
} from "@/sanity/lib/queries";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { urlFor, blurProps } from "@/sanity/lib/image";
import { formatCurrency } from "@/lib/utils";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ClassDetailsSectionProps {
  heading?: string | null;
  subtitle?: string | null;
}

interface ScheduleSlot {
  classId: string;
  className: string;
  day: string;
  time: string;
}

export async function ClassDetailsSection({
  heading,
  subtitle,
}: ClassDetailsSectionProps) {
  const [{ data: classes }, { data: discountDoc }, { data: schedule }] =
    await Promise.all([
      sanityFetch({ query: ALL_CLASSES_QUERY }),
      sanityFetch({ query: DISCOUNT_QUERY, stega: false }),
      sanityFetch({ query: WEEKLY_SCHEDULE_QUERY }),
    ]);

  if (!classes?.length) return null;

  // Discount logic from the dedicated Discounts singleton
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

  // Group schedule slots by classId
  const slotsByClass: Record<string, ScheduleSlot[]> = {};
  if (schedule?.slots) {
    for (const slot of schedule.slots as ScheduleSlot[]) {
      if (!slotsByClass[slot.classId]) slotsByClass[slot.classId] = [];
      slotsByClass[slot.classId].push(slot);
    }
  }

  return (
    <section id="class-details" className="scroll-mt-24 py-8 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "More About Our Classes..."}
        </SectionHeading>

        <div className="mx-auto mt-4 max-w-5xl divide-y divide-border/60 md:mt-6 [&>*:last-child]:pb-0 [&>*+*]:pt-12 md:[&>*+*]:pt-16">
          {classes.map(
            (
              cls: {
                _id: string;
                name: string | null;
                description: Array<Record<string, unknown>> | null;
                tagline: string | null;
                days: string | null;
                price: number | null;
                salePrice: number | null;
                duration: number | null;
                image: {
                  asset?: { _ref: string };
                  lqip?: string | null;
                } | null;
                bookingUrl: string | null;
              },
              index: number
            ) => {
              if (!cls.description?.length) return null;
              const imageLeft = index % 2 === 0;

              // Price with discounts
              const originalPrice = cls.price || 0;
              const bannerDiscount = getDiscountForClass(cls._id);
              const classHasSale =
                cls.salePrice && cls.salePrice < originalPrice;
              const effectiveSalePrice = classHasSale
                ? cls.salePrice
                : bannerDiscount
                  ? Math.floor(originalPrice * (1 - bannerDiscount / 100))
                  : null;
              const hasDiscount =
                effectiveSalePrice && effectiveSalePrice < originalPrice;

              // Schedule for this class
              const classSlots = slotsByClass[cls._id] || [];

              return (
                <div
                  key={cls._id}
                  id={cls._id}
                  className={cn(
                    "scroll-mt-24 grid items-start gap-8 pb-12 md:grid-cols-2 md:gap-12 md:pb-16",
                    !imageLeft && "md:[&>*:first-child]:order-2"
                  )}
                >
                  {/* Image */}
                  {cls.image?.asset && (
                    <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                      <Image
                        src={urlFor(cls.image)
                          .width(600)
                          .height(450)
                          .quality(80)
                          .url()}
                        alt={cls.name || "Class"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        {...blurProps(cls.image.lqip)}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h3 className="mb-1 font-heading text-3xl text-neutral-800 md:text-4xl">
                      {cls.name}
                    </h3>

                    {/* Meta: price, duration, tagline */}
                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      {originalPrice > 0 && (
                        <span className="font-semibold">
                          {hasDiscount ? (
                            <>
                              <span className="text-pink-500">
                                {formatCurrency(effectiveSalePrice)}
                              </span>
                              <span className="ml-1.5 text-xs text-neutral-400 line-through">
                                {formatCurrency(originalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-pink-500">
                              {formatCurrency(originalPrice)}
                            </span>
                          )}
                        </span>
                      )}
                      {cls.duration && (
                        <span className="text-neutral-400">
                          {cls.duration} min
                        </span>
                      )}
                      {cls.tagline && (
                        <span className="text-neutral-500">{cls.tagline}</span>
                      )}
                    </div>

                    {/* Schedule */}
                    {classSlots.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {classSlots.map((slot, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                          >
                            <Calendar size={11} />
                            {slot.day}
                            <Clock size={11} className="ml-1" />
                            {slot.time}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="prose prose-sm text-neutral-600 [&_p]:mb-4 [&_p]:leading-relaxed">
                      <PortableText value={cls.description as never} />
                    </div>

                    <BookNowLink
                      href={cls.bookingUrl || SITE_CONFIG.booking.url}
                      label={cls.name || "class"}
                      source="class_details"
                      className="mt-6 inline-block rounded-full bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Container>
    </section>
  );
}
