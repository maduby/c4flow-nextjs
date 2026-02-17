import { defineType, defineField, defineArrayMember } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const danceClass = defineType({
  name: "danceClass",
  title: "Dance Class",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "info", title: "Class Info", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "schedule", title: "Schedule" },
  ],
  fields: [
    // ── Class Info ──
    defineField({
      name: "name",
      title: "Class Name",
      type: "string",
      group: "info",
      description: 'The name shown on the website, e.g. "Group Pole Class".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "info",
      description:
        "Auto-generated from the name. Click Generate to create it.",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Class Image",
      type: "image",
      group: "info",
      description:
        "A photo representing this class. Landscape orientation works best (4:3 ratio).",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "info",
      description:
        "A brief summary shown on class cards (1–2 sentences).",
      validation: (rule) =>
        rule.max(200).warning("Keep under 200 characters for clean card layout."),
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      group: "info",
      description: "Detailed description shown on the class detail page.",
    }),

    // ── Pricing ──
    defineField({
      name: "price",
      title: "Regular Price (ZAR)",
      type: "number",
      group: "pricing",
      description:
        'The normal price in Rands. Just enter the number, e.g. "350".',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price (ZAR)",
      type: "number",
      group: "pricing",
      description:
        "Optional — set a sale price to show a discount on the website. The regular price will appear crossed out. Clear this field to end the sale.",
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
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
      group: "pricing",
      description: "How long the class runs, e.g. 60 for a 1-hour class.",
      initialValue: 60,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking Link",
      type: "url",
      group: "pricing",
      description:
        'The Setmore link for this specific class. If left empty, the "Book Now" button links to the main Setmore booking page instead.',
    }),

    // ── Schedule ──
    defineField({
      name: "schedule",
      title: "Weekly Schedule",
      type: "array",
      group: "schedule",
      description:
        'Add each time slot this class runs. Click "+ Add item" and pick the day and time.',
      of: [
        defineArrayMember({
          type: "object",
          name: "scheduleEntry",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              options: {
                list: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: 'e.g. "6 PM" or "11 AM"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { day: "day", time: "time" },
            prepare({ day, time }) {
              return { title: `${day} — ${time}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      group: "info",
      description:
        "Controls the order classes appear on the website. Lower numbers show first (e.g. 1 = first, 2 = second).",
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
    select: { title: "name", price: "price", salePrice: "salePrice", media: "image" },
    prepare({ title, price, salePrice, media }) {
      const priceText = salePrice
        ? `R${salePrice} (was R${price})`
        : price
          ? `R${price}`
          : undefined;
      return { title, subtitle: priceText, media };
    },
  },
});
