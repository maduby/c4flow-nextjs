import { defineType, defineField } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const classDetailsSection = defineType({
  name: "classDetailsSection",
  title: "Class Details Section",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "More About Our Classes...",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return {
        title: title || "Class Details",
        subtitle: "Detailed class descriptions with images",
      };
    },
  },
});
