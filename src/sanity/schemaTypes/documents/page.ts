import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { seoFields } from "../shared/seoFields";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      group: "content",
      description: "Internal name for this page (also used as a fallback for the browser tab title).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      group: "content",
      description:
        'The page URL path. "home" = homepage, "about" = /about, "classes" = /classes, etc. Click "Generate" to auto-create from the title.',
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      group: "content",
      description:
        'Build your page by adding sections below. Click "+ Add item" and choose a section type (Hero, Classes, Gallery, etc.). Drag to reorder.',
      of: [
        defineArrayMember({ type: "hero" }),
        defineArrayMember({ type: "featureGrid" }),
        defineArrayMember({ type: "classesSection" }),
        defineArrayMember({ type: "instructorSection" }),
        defineArrayMember({ type: "scheduleSection" }),
        defineArrayMember({ type: "richTextSection" }),
        defineArrayMember({ type: "gallerySection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "contactFormSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "mapSection" }),
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
