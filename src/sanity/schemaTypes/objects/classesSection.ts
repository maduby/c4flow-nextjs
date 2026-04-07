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
      name: "columns",
      title: "Desktop Columns",
      type: "number",
      description: "Number of columns on large screens. Defaults to 4.",
      options: {
        list: [
          { title: "2 per row", value: 2 },
          { title: "3 per row", value: 3 },
          { title: "4 per row", value: 4 },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: 4,
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
