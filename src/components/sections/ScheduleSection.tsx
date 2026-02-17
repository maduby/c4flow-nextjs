import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CLASSES_QUERY } from "@/sanity/lib/queries";
import { Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface ScheduleSectionProps {
  heading?: string | null;
  subtitle?: string | null;
}

interface ScheduleEntry {
  className: string;
  time: string;
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
  const { data: classes } = await sanityFetch({ query: ALL_CLASSES_QUERY });

  const scheduleByDay = new Map<string, ScheduleEntry[]>();

  for (const cls of classes || []) {
    for (const entry of cls.schedule || []) {
      const day = entry.day;
      if (!scheduleByDay.has(day)) scheduleByDay.set(day, []);
      scheduleByDay.get(day)!.push({
        className: cls.name || "Class",
        time: entry.time,
        bookingUrl: cls.bookingUrl,
      });
    }
  }

  const activeDays = DAY_ORDER.filter((d) => scheduleByDay.has(d));

  if (!activeDays.length) return null;

  return (
    <section className="py-16 md:py-24">
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
                {scheduleByDay.get(day)!.map((entry, i) => (
                  <div
                    key={`${day}-${i}`}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-800">
                        {entry.className}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-400">
                        <Clock size={12} aria-hidden="true" />
                        {entry.time}
                      </p>
                    </div>
                    {entry.bookingUrl && (
                      <a
                        href={entry.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-pink-600"
                        aria-label={`Book ${entry.className} on ${day}`}
                      >
                        Book
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
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
                scheduleByDay.get(day)!.map((entry, i) => (
                  <tr
                    key={`${day}-${i}`}
                    className="border-t border-border transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-800">
                      {i === 0 ? day : <span className="sr-only">{day}</span>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {entry.className}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{entry.time}</td>
                    <td className="px-6 py-4 text-right">
                      {entry.bookingUrl && (
                        <a
                          href={entry.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-pink-500 hover:text-pink-600"
                          aria-label={`Book ${entry.className} on ${day}`}
                        >
                          Book
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      )}
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
