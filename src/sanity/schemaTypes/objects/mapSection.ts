import { defineType, defineField } from "sanity";
import { PinIcon } from "@sanity/icons";

export const mapSection = defineType({
  name: "mapSection",
  title: "Map Section",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Find us",
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional Info",
      type: "text",
      rows: 3,
      description: "e.g. parking instructions",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Map", subtitle: "Map Section" };
    },
  },
});
