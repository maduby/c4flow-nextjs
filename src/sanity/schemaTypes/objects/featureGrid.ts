import { defineType, defineField, defineArrayMember } from "sanity";
import { ThListIcon } from "@sanity/icons";

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Feature Grid",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Icon Image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "title", media: "icon" },
          },
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { features: "features" },
    prepare({ features }) {
      return {
        title: `Feature Grid (${features?.length || 0} items)`,
        subtitle: "Feature Grid",
      };
    },
  },
});
