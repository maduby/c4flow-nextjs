import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const hero = defineType({
  name: "hero",
  title: "Hero Section",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "layout",
      title: "Layout Style",
      type: "string",
      description: "Choose how the hero looks on the page.",
      options: {
        list: [
          { title: "Centered with Logo (Homepage style)", value: "centered" },
          {
            title: "Split — Text Left, Image Right (Classes/Contact style)",
            value: "split",
          },
          {
            title: "Gradient — Centered Text, No Image (About/Mission style)",
            value: "gradient",
          },
        ],
        layout: "radio",
      },
      initialValue: "centered",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "The big heading text.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "A short line below the headline.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'Optional italic text, e.g. a motto like "Move to Express".',
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 4,
      description:
        'Optional paragraph shown below the headline. Useful for the "Split" and "Gradient" layouts.',
    }),
    defineField({
      name: "backgroundImage",
      title: "Background / Side Image",
      type: "image",
      description:
        'Used as the full background in "Centered" layout, or as the right-side image in "Split" layout. Not used in "Gradient" layout.',
      options: { hotspot: true },
    }),
    defineField({
      name: "overlayLogo",
      title: "Overlay Logo",
      type: "image",
      description:
        'Optional logo shown in the hero. Only appears in the "Centered" layout.',
    }),
    defineField({
      name: "ctaText",
      title: "Button Text",
      type: "string",
      description: 'Optional call-to-action button, e.g. "Book a Class".',
    }),
    defineField({
      name: "ctaUrl",
      title: "Button Link",
      type: "url",
      description: "Where the button goes when clicked.",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "headline", layout: "layout", media: "backgroundImage" },
    prepare({ title, layout, media }) {
      const layoutLabel =
        layout === "split"
          ? "Split"
          : layout === "gradient"
            ? "Gradient"
            : "Centered";
      return {
        title: title || "Hero",
        subtitle: `Hero — ${layoutLabel}`,
        media,
      };
    },
  },
});
