import { sanityFetch } from "@/sanity/lib/live";
import {
  WEEKLY_SCHEDULE_QUERY,
  ANNOUNCEMENT_BAR_QUERY,
  DISCOUNT_QUERY,
} from "@/sanity/lib/queries";
import { Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BookNowLink } from "@/components/ui/BookNowLink";
import { ScheduleNotices } from "@/components/ui/ScheduleNotices";
import { SITE_CONFIG } from "@/lib/constants";

interface ScheduleSectionProps {
  heading?: string | null;
  subtitle?: string | null;
}

interface Slot {
  _key: string;
  day: string;
  time: string;
  className: string | null;
  classId: string | null;
  price: number | null;
  salePrice: number | null;
  bookingUrl: string | null;
}

interface Notice {
  _key: string;
  style: string | null;
  emoji: string | null;
  title: string | null;
  body: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  startDate: string | null;
  endDate: string | null;
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* ── Discount helper (reads from dedicated Discounts document) ── */

function getDiscountForClass(
  classId: string | null,
  discountDoc: {
    enabled?: boolean | null;
    discountPercent?: number | null;
    discountScope?: string | null;
    discountClassIds?: string[] | null;
  } | null,
): number | null {
  if (!discountDoc?.enabled || !discountDoc?.discountPercent) return null;

  const { discountPercent, discountScope, discountClassIds } = discountDoc;

  if (discountScope === "all") return discountPercent;
  if (
    discountScope === "specific" &&
    classId &&
    discountClassIds?.includes(classId)
  )
    return discountPercent;

  return null;
}

function formatPrice(
  slot: Slot,
  discount: number | null,
): { original: number; discounted: number | null } | null {
  const original = slot.price || 0;
  if (!original) return null;

  // Class's own sale price takes priority over the banner percentage
  if (slot.salePrice && slot.salePrice < original) {
    return { original, discounted: slot.salePrice };
  }

  if (discount) {
    return {
      original,
      discounted: Math.floor(original * (1 - discount / 100)),
    };
  }

  return { original, discounted: null };
}

export async function ScheduleSection({
  heading,
  subtitle,
}: ScheduleSectionProps) {
  const [{ data: schedule }, { data: announcement }, { data: discountDoc }] =
    await Promise.all([
      sanityFetch({ query: WEEKLY_SCHEDULE_QUERY }),
      sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY }),
      sanityFetch({ query: DISCOUNT_QUERY }),
    ]);

  const slots: Slot[] = (schedule?.slots as Slot[]) || [];
  const notices: Notice[] = (schedule?.notices as Notice[]) || [];

  if (!slots.length) return null;

  /* ── Inject announcement as a synthetic notice if enabled ── */
  const allNotices = [...notices];

  if (
    announcement?.enabled &&
    announcement?.showInSchedule &&
    announcement?.text
  ) {
    allNotices.unshift({
      _key: "__banner-promo__",
      style: "celebration",
      emoji: "💸",
      title: announcement.text,
      body: announcement.scheduleText || null,
      linkUrl: announcement.link || null,
      linkLabel: announcement.link ? "Book Now" : null,
      startDate: null,
      endDate: null,
    });
  }

  /* ── Group slots by day ──────────────────────────────────── */
  const scheduleByDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    if (!slot.day) continue;
    if (!scheduleByDay.has(slot.day)) scheduleByDay.set(slot.day, []);
    scheduleByDay.get(slot.day)!.push(slot);
  }

  const activeDays = DAY_ORDER.filter((d) => scheduleByDay.has(d));

  if (!activeDays.length) return null;

  return (
    <section className="py-12 md:py-24">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Weekly Schedule"}
        </SectionHeading>

        {/* ── Schedule Notices (includes banner promo if enabled) ── */}
        {allNotices.length > 0 && <ScheduleNotices notices={allNotices} />}

        {/* ── Mobile: stacked cards ── */}
        <div className="mx-auto max-w-lg space-y-4 md:hidden" role="list">
          {activeDays.map((day) => (
            <div
              key={day}
              className="overflow-hidden rounded-xl border border-border"
              role="listitem"
            >
              <div className="bg-primary-600 px-4 py-2.5">
                <h3 className="text-sm font-medium text-white">{day}</h3>
              </div>
              <div className="divide-y divide-border">
                {scheduleByDay.get(day)!.map((slot) => {
                  const discount = getDiscountForClass(
                    slot.classId,
                    discountDoc,
                  );
                  const pricing = formatPrice(slot, discount);

                  return (
                    <div
                      key={slot._key}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-800">
                          {slot.className || "Class"}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-400">
                          <Clock size={12} aria-hidden="true" />
                          {slot.time}
                        </p>
                        {pricing && (
                          <p className="mt-0.5 text-sm">
                            {pricing.discounted ? (
                              <>
                                <span className="font-semibold text-pink-500">
                                  R{pricing.discounted}
                                </span>
                                <span className="ml-1.5 text-neutral-400 line-through">
                                  R{pricing.original}
                                </span>
                              </>
                            ) : (
                              <span className="text-neutral-600">
                                R{pricing.original}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <BookNowLink
                        href={slot.bookingUrl || SITE_CONFIG.booking.url}
                        label={slot.className || "class"}
                        source="schedule_mobile"
                        ariaLabel={`Book ${slot.className || "class"} on ${day}`}
                        className="shrink-0 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-pink-600"
                      >
                        Book
                      </BookNowLink>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: table ── */}
        <div className="mx-auto hidden max-w-3xl overflow-hidden rounded-2xl border border-border md:block">
          <table className="w-full text-left">
            <caption className="sr-only">
              Weekly class schedule with days, class names, times, prices, and
              booking links
            </caption>
            <thead>
              <tr className="bg-linear-to-r from-primary-600 via-purple-600 to-pink-500 text-white">
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-sm font-medium">
                  <span className="sr-only">Book</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {activeDays.map((day) =>
                scheduleByDay.get(day)!.map((slot, i) => {
                  const discount = getDiscountForClass(
                    slot.classId,
                    discountDoc,
                  );
                  const pricing = formatPrice(slot, discount);

                  return (
                    <tr
                      key={slot._key}
                      className="border-t border-border transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-800">
                        {i === 0 ? day : <span className="sr-only">{day}</span>}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {slot.className || "Class"}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {slot.time}
                      </td>
                      <td className="px-6 py-4">
                        {pricing ? (
                          pricing.discounted ? (
                            <span>
                              <span className="font-semibold text-pink-500">
                                R{pricing.discounted}
                              </span>
                              <span className="ml-1.5 text-sm text-neutral-400 line-through">
                                R{pricing.original}
                              </span>
                            </span>
                          ) : (
                            <span className="text-neutral-600">
                              R{pricing.original}
                            </span>
                          )
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <BookNowLink
                          href={slot.bookingUrl || SITE_CONFIG.booking.url}
                          label={slot.className || "class"}
                          source="schedule_table"
                          ariaLabel={`Book ${slot.className || "class"} on ${day}`}
                          className="text-sm font-medium text-pink-500 hover:text-pink-600"
                        >
                          Book
                        </BookNowLink>
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
