import { defineType, defineField } from "sanity";
import { CommentIcon } from "@sanity/icons";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "The testimonial text. This is the only required field.",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "name",
      title: "Name (optional)",
      type: "string",
      description:
        'The person\'s name, e.g. "Sarah M." — leave blank for an anonymous testimonial.',
    }),
    defineField({
      name: "role",
      title: "Role / Class (optional)",
      type: "string",
      description:
        'E.g. "Pole Student", "Exotic Baddies regular", or "3-month member".',
    }),
    defineField({
      name: "photo",
      title: "Photo (optional)",
      type: "image",
      description:
        "A headshot or profile photo. Works great without one too — a colourful placeholder will be shown instead.",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Star Rating (optional)",
      type: "number",
      description: "1–5 stars. Leave empty to hide stars.",
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Controls the order in the carousel. Lower numbers appear first.",
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
      quote: "quote",
      name: "name",
      photo: "photo",
      rating: "rating",
    },
    prepare({ quote, name, photo, rating }) {
      const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "";
      return {
        title: name || "Anonymous",
        subtitle: `${stars ? stars + " — " : ""}${(quote || "").slice(0, 80)}…`,
        media: photo,
      };
    },
  },
});
