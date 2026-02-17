import { defineType, defineField } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const classesSection = defineType({
  name: "classesSection",
  title: "Classes Section",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Our Classes",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "showBookingNote",
      title: "Show Booking Note",
      type: "boolean",
      initialValue: true,
      description: 'Show "Clicking Book Now will redirect..." note',
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Classes", subtitle: "Classes Section" };
    },
  },
});
