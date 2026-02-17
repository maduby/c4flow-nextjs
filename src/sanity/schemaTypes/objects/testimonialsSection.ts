import { defineType, defineField } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials Section",
  type: "object",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "What Our Students Say",
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
      return {
        title: title || "Testimonials",
        subtitle: "Testimonials Section",
      };
    },
  },
});
