import { defineType, defineField } from "sanity";
import { LaunchIcon } from "@sanity/icons";
import { simpleRichText } from "../shared/simpleRichText";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to Action",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "array",
      of: simpleRichText,
      description: "Supports bold, italic, and links.",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonUrl",
      title: "Button URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Light Background", value: "light" },
          { title: "Dark Background", value: "dark" },
          { title: "Purple Gradient", value: "gradient" },
          { title: "Background Image", value: "bgImage" },
        ],
        layout: "radio",
      },
      initialValue: "gradient",
    }),
    defineField({
      name: "secondaryLinks",
      title: "Secondary Links",
      type: "array",
      description: "Optional text links shown below the main button (e.g. FAQs, Contact Us).",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description:
        'Full-width background image. Select "Background Image" style to use it.',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.style !== "bgImage",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "CTA", subtitle: "Call to Action" };
    },
  },
});
