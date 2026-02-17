import { defineType, defineField, defineArrayMember } from "sanity";
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
      name: "packages",
      title: "Packages",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "pricingPackage",
          fields: [
            defineField({
              name: "name",
              title: "Package Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tagline",
              title: "Tagline",
              type: "string",
              description: 'Short selling point, e.g. "Flexible options to fit your schedule".',
            }),
            defineField({
              name: "price",
              title: "Price (ZAR)",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: "note",
              title: "Note",
              type: "string",
              description: 'Small text below the price, e.g. "Valid for group classes only".',
            }),
            defineField({
              name: "highlighted",
              title: "Highlight this package?",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "name", price: "price" },
            prepare({ title, price }) {
              return {
                title: title || "Package",
                subtitle: price ? `R${price}` : undefined,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "footerNote",
      title: "Footer Note",
      type: "string",
      description: 'Text below the pricing cards, e.g. "To book packages, please Contact Us."',
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Pricing", subtitle: "Pricing Section" };
    },
  },
});
