import { defineType, defineField, defineArrayMember } from "sanity";
import { ClockIcon, BellIcon } from "@sanity/icons";

/**
 * Singleton document that holds the entire weekly schedule
 * plus temporary schedule notices (e.g. holiday hours, specials).
 */
export const weeklySchedule = defineType({
  name: "weeklySchedule",
  title: "Weekly Schedule",
  type: "document",
  icon: ClockIcon,
  groups: [
    { name: "schedule", title: "Time Slots", default: true },
    { name: "notices", title: "Notices & Specials" },
  ],
  fields: [
    // ───────────────────── Time Slots ─────────────────────
    defineField({
      name: "slots",
      title: "Time Slots",
      type: "array",
      group: "schedule",
      description:
        'Add a row for every class on the weekly schedule. Click "+ Add item", choose the day, time, and class. Drag rows to reorder.',
      of: [
        defineArrayMember({
          type: "object",
          name: "scheduleSlot",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              description: "Which day of the week?",
              options: {
                list: [
                  { title: "Monday", value: "Monday" },
                  { title: "Tuesday", value: "Tuesday" },
                  { title: "Wednesday", value: "Wednesday" },
                  { title: "Thursday", value: "Thursday" },
                  { title: "Friday", value: "Friday" },
                  { title: "Saturday", value: "Saturday" },
                  { title: "Sunday", value: "Sunday" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: 'Pick a time slot or type your own.',
              options: {
                list: [
                  "6 AM", "6:15 AM", "6:30 AM", "6:45 AM",
                  "7 AM", "7:15 AM", "7:30 AM", "7:45 AM",
                  "8 AM", "8:15 AM", "8:30 AM", "8:45 AM",
                  "9 AM", "9:15 AM", "9:30 AM", "9:45 AM",
                  "10 AM", "10:15 AM", "10:30 AM", "10:45 AM",
                  "11 AM", "11:15 AM", "11:30 AM", "11:45 AM",
                  "12 PM", "12:15 PM", "12:30 PM", "12:45 PM",
                  "1 PM", "1:15 PM", "1:30 PM", "1:45 PM",
                  "2 PM", "2:15 PM", "2:30 PM", "2:45 PM",
                  "3 PM", "3:15 PM", "3:30 PM", "3:45 PM",
                  "4 PM", "4:15 PM", "4:30 PM", "4:45 PM",
                  "5 PM", "5:15 PM", "5:30 PM", "5:45 PM",
                  "6 PM", "6:15 PM", "6:30 PM", "6:45 PM",
                  "7 PM", "7:15 PM", "7:30 PM", "7:45 PM",
                  "8 PM", "8:15 PM", "8:30 PM", "8:45 PM",
                  "9 PM", "9:15 PM", "9:30 PM", "9:45 PM",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "danceClass",
              title: "Class",
              type: "reference",
              to: [{ type: "danceClass" }],
              description: "Which class runs at this time?",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              day: "day",
              time: "time",
              className: "danceClass.name",
              classImage: "danceClass.image",
            },
            prepare({ day, time, className, classImage }) {
              return {
                title: `${day || "—"} — ${time || "—"}`,
                subtitle: className || "No class selected",
                media: classImage,
              };
            },
          },
        }),
      ],
    }),

    // ───────────────────── Notices & Specials ─────────────────────
    defineField({
      name: "notices",
      title: "Schedule Notices",
      type: "array",
      group: "notices",
      description:
        'Temporary announcements shown above the schedule — holiday hours, specials, closures, etc. Toggle each notice on/off, or set start and end dates so they appear automatically. Click "+ Add item" to create one.',
      of: [
        defineArrayMember({
          type: "object",
          name: "scheduleNotice",
          icon: BellIcon,
          fields: [
            defineField({
              name: "active",
              title: "Active",
              type: "boolean",
              description:
                "Turn this on to show the notice on the website. If you also set dates below, it must be active AND within the date range to appear.",
              initialValue: true,
            }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              description: "Pick a look that matches the mood of the notice.",
              options: {
                list: [
                  { title: "🎉 Celebration (pink/purple — specials, events)", value: "celebration" },
                  { title: "ℹ️ Info (blue — general updates)", value: "info" },
                  { title: "⚠️ Warning (amber — closures, changes)", value: "warning" },
                  { title: "🆕 New (green — new classes, launches)", value: "new" },
                ],
                layout: "radio",
              },
              initialValue: "celebration",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "emoji",
              title: "Emoji (optional)",
              type: "string",
              description:
                'An emoji shown before the title, e.g. "🎄" or "💕". Leave empty for the default style emoji.',
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                'Short headline, e.g. "Valentine\'s Special" or "Holiday Hours".',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: "body",
              title: "Details (optional)",
              type: "text",
              rows: 2,
              description:
                'Extra info, e.g. "All classes 20% off this weekend!" or "Studio closed Dec 25–26, reopening Dec 27."',
            }),
            defineField({
              name: "linkUrl",
              title: "Button Link (optional)",
              type: "url",
              description:
                "Add a link to make a button appear — e.g. a booking page or event details.",
              validation: (rule) =>
                rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
            }),
            defineField({
              name: "linkLabel",
              title: "Button Text",
              type: "string",
              description:
                'The text on the button, e.g. "Book Now" or "Learn More". Only shown if a link is set.',
              initialValue: "Learn More",
              hidden: ({ parent }) => !parent?.linkUrl,
            }),
            defineField({
              name: "startDate",
              title: "Show From (optional)",
              type: "date",
              description:
                "If set, the notice only appears from this date onward. Leave empty to show immediately.",
            }),
            defineField({
              name: "endDate",
              title: "Show Until (optional)",
              type: "date",
              description:
                "If set, the notice hides after this date. Leave empty to show indefinitely (until you turn it off).",
            }),
          ],
          preview: {
            select: {
              title: "title",
              active: "active",
              style: "style",
              emoji: "emoji",
              startDate: "startDate",
              endDate: "endDate",
            },
            prepare({ title, active, style, emoji, startDate, endDate }) {
              const defaultEmojis: Record<string, string> = {
                celebration: "🎉",
                info: "ℹ️",
                warning: "⚠️",
                new: "🆕",
              };
              const icon = emoji || defaultEmojis[style || "info"] || "📢";
              const status = active ? "✅ Active" : "❌ Off";

              let dateRange = "";
              if (startDate && endDate) dateRange = ` · ${startDate} → ${endDate}`;
              else if (startDate) dateRange = ` · from ${startDate}`;
              else if (endDate) dateRange = ` · until ${endDate}`;

              return {
                title: `${icon} ${title || "Untitled notice"}`,
                subtitle: `${status}${dateRange}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Weekly Schedule" };
    },
  },
});
