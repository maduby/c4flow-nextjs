import { sanityFetch } from "@/sanity/lib/live";
import { WEEKLY_SCHEDULE_QUERY } from "@/sanity/lib/queries";
import { Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BookNowLink } from "@/components/ui/BookNowLink";
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
  bookingUrl: string | null;
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

export async function ScheduleSection({
  heading,
  subtitle,
}: ScheduleSectionProps) {
  const { data: schedule } = await sanityFetch({
    query: WEEKLY_SCHEDULE_QUERY,
  });

  const slots: Slot[] = (schedule?.slots as Slot[]) || [];

  if (!slots.length) return null;

  const scheduleByDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    if (!slot.day) continue;
    if (!scheduleByDay.has(slot.day)) scheduleByDay.set(slot.day, []);
    scheduleByDay.get(slot.day)!.push(slot);
  }

  const activeDays = DAY_ORDER.filter((d) => scheduleByDay.has(d));

  if (!activeDays.length) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading subtitle={subtitle}>
          {heading || "Weekly Schedule"}
        </SectionHeading>

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
                {scheduleByDay.get(day)!.map((slot) => (
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
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop: table ── */}
        <div className="mx-auto hidden max-w-3xl overflow-hidden rounded-2xl border border-border md:block">
          <table className="w-full text-left">
            <caption className="sr-only">
              Weekly class schedule with days, class names, times, and booking
              links
            </caption>
            <thead>
              <tr className="bg-primary-600 text-white">
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
                  <span className="sr-only">Book</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {activeDays.map((day) =>
                scheduleByDay.get(day)!.map((slot, i) => (
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
                    <td className="px-6 py-4 text-neutral-600">{slot.time}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
