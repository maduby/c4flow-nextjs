import { defineType, defineField } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

export const pricingBundle = defineType({
  name: "pricingBundle",
  title: "Pricing Bundle",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "name",
      title: "Package Name",
      type: "string",
      description: 'e.g. "6-Class Pack", "Unlimited Monthly"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        'Short selling point shown under the name, e.g. "Consistency made simple."',
    }),
    defineField({
      name: "price",
      title: "Regular Price (ZAR)",
      type: "number",
      description: "The normal price in Rands.",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price (ZAR)",
      type: "number",
      description:
        "Optional manual sale price. The regular price will appear crossed out. Global discounts override this if they produce a lower price.",
      validation: (rule) =>
        rule.min(0).custom((salePrice, context) => {
          const parent = context.parent as { price?: number };
          if (salePrice && parent?.price && salePrice >= parent.price) {
            return "Sale price must be lower than the regular price.";
          }
          return true;
        }),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description:
        'Small text below the price, e.g. "Valid for group classes only".',
    }),
    defineField({
      name: "highlighted",
      title: "Highlight this package?",
      type: "boolean",
      description: "Highlighted packages get a pink accent card.",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Which pricing table this bundle belongs to.",
      options: {
        list: [
          { title: "Group Classes", value: "group" },
          { title: "Private Classes", value: "private" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Controls the order within its category. Lower numbers show first.",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      salePrice: "salePrice",
      category: "category",
    },
    prepare({ title, price, salePrice, category }) {
      const tag = category === "group" ? "Group" : "Private";
      const priceText = salePrice
        ? `R${salePrice} (was R${price})`
        : price
          ? `R${price}`
          : undefined;
      return {
        title: title || "Bundle",
        subtitle: [tag, priceText].filter(Boolean).join(" · "),
      };
    },
  },
});
