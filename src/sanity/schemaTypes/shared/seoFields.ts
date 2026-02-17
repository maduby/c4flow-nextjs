import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO Title",
    type: "string",
    group: "seo",
    validation: (rule) =>
      rule.max(60).warning("Keep under 60 characters for best SEO"),
  }),
  defineField({
    name: "seoDescription",
    title: "SEO Description",
    type: "text",
    rows: 3,
    group: "seo",
    validation: (rule) =>
      rule.max(160).warning("Keep under 160 characters for best SEO"),
  }),
  defineField({
    name: "ogImage",
    title: "Open Graph Image",
    type: "image",
    group: "seo",
    description: "Image shown when shared on social media (1200x630 recommended)",
    options: { hotspot: true },
  }),
];
