import { defineType, defineField } from "sanity";
import { ClockIcon } from "@sanity/icons";

export const scheduleSection = defineType({
  name: "scheduleSection",
  title: "Schedule Section",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Weekly Schedule",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Schedule", subtitle: "Schedule Section" };
    },
  },
});
