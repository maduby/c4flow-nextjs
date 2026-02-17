import { defineType, defineField } from "sanity";
import { TextIcon } from "@sanity/icons";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich Text Section",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Centered", value: "centered" },
          { title: "Left Aligned", value: "left" },
          { title: "Two Column", value: "twoColumn" },
        ],
        layout: "radio",
      },
      initialValue: "centered",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Rich Text", subtitle: "Rich Text Section" };
    },
  },
});
