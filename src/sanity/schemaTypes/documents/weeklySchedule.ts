import { defineType, defineField, defineArrayMember } from "sanity";
import { ClockIcon } from "@sanity/icons";

/**
 * Singleton document that holds the entire weekly schedule.
 * The editor manages all time slots in one place — much easier than
 * digging into individual class documents.
 */
export const weeklySchedule = defineType({
  name: "weeklySchedule",
  title: "Weekly Schedule",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "slots",
      title: "Time Slots",
      type: "array",
      description:
        'Add a row for every class that appears on the weekly schedule. Click "+ Add item", choose the day, time, and class. Drag rows to reorder them.',
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
              description:
                'Pick a time or type your own (e.g. "5:45 PM").',
              options: {
                list: [
                  "7 AM",
                  "8 AM",
                  "9 AM",
                  "10 AM",
                  "11 AM",
                  "12 PM",
                  "1 PM",
                  "2 PM",
                  "3 PM",
                  "4 PM",
                  "5 PM",
                  "5:30 PM",
                  "5:45 PM",
                  "6 PM",
                  "6:30 PM",
                  "7 PM",
                  "7:30 PM",
                  "8 PM",
                  "9 PM",
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
  ],
  preview: {
    prepare() {
      return { title: "Weekly Schedule" };
    },
  },
});
