import { defineType, defineField } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

export const pricingSection = defineType({
  name: "pricingSection",
  title: "Pricing Section",
  type: "object",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "bundleCategory",
      title: "Bundle Category",
      type: "string",
      description:
        "Which pricing bundles to display in this section. Bundles are managed under Pricing Bundles in the sidebar.",
      options: {
        list: [
          { title: "Group Class Bundles", value: "group" },
          { title: "Private Class Bundles", value: "private" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerNote",
      title: "Footer Note",
      type: "string",
      description:
        'Text below the pricing cards, e.g. "To book packages, please Contact Us."',
    }),
  ],
  preview: {
    select: { title: "heading", category: "bundleCategory" },
    prepare({ title, category }) {
      const tag =
        category === "group"
          ? "Group Bundles"
          : category === "private"
            ? "Private Bundles"
            : "Pricing";
      return { title: title || "Pricing", subtitle: tag };
    },
  },
});
