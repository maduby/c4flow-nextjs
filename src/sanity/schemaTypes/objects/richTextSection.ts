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
      name: "image",
      title: "Side Image",
      type: "image",
      description:
        "Optional image displayed beside the text in 'Text + Image' layout.",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      description: "Which side the image appears on (desktop).",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
      },
      initialValue: "right",
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Centered", value: "centered" },
          { title: "Left Aligned", value: "left" },
          { title: "Text + Image", value: "textImage" },
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
