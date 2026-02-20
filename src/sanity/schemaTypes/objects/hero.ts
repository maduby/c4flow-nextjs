import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { simpleRichText } from "../shared/simpleRichText";

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
      name: "headlineColor",
      title: "Headline Colour",
      type: "color",
      description:
        "Override the headline text colour. Leave empty to use the default for each layout.",
      options: {
        colorList: [
          { title: "White", value: "#ffffff" },
          { title: "Pink", value: "#fc5185" },
          { title: "Deep Pink", value: "#d63163" },
          { title: "Purple", value: "#5025d1" },
          { title: "Dark Purple", value: "#2f1c6a" },
          { title: "Indigo", value: "#673de6" },
          { title: "Neutral Dark", value: "#1d1e20" },
        ],
      },
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "array",
      of: simpleRichText,
      description:
        'Optional paragraph shown below the headline. Supports bold, italic, and links. Useful for the "Split" and "Gradient" layouts.',
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
      name: "imageRatio",
      title: "Image Aspect Ratio",
      type: "object",
      description:
        "Override the default image proportions per screen size. Leave empty to keep the defaults.",
      options: { columns: 3 },
      fields: [
        defineField({
          name: "mobile",
          title: "Mobile",
          type: "string",
          options: {
            list: [
              { title: "Default", value: "" },
              { title: "Square (1:1)", value: "1:1" },
              { title: "Landscape 4:3", value: "4:3" },
              { title: "Portrait 3:4", value: "3:4" },
              { title: "Widescreen 16:9", value: "16:9" },
              { title: "Tall 9:16", value: "9:16" },
              { title: "Photo 3:2", value: "3:2" },
            ],
          },
        }),
        defineField({
          name: "tablet",
          title: "Tablet (md)",
          type: "string",
          options: {
            list: [
              { title: "Default", value: "" },
              { title: "Square (1:1)", value: "1:1" },
              { title: "Landscape 4:3", value: "4:3" },
              { title: "Portrait 3:4", value: "3:4" },
              { title: "Widescreen 16:9", value: "16:9" },
              { title: "Tall 9:16", value: "9:16" },
              { title: "Photo 3:2", value: "3:2" },
            ],
          },
        }),
        defineField({
          name: "desktop",
          title: "Desktop (lg)",
          type: "string",
          options: {
            list: [
              { title: "Default", value: "" },
              { title: "Square (1:1)", value: "1:1" },
              { title: "Landscape 4:3", value: "4:3" },
              { title: "Portrait 3:4", value: "3:4" },
              { title: "Widescreen 16:9", value: "16:9" },
              { title: "Tall 9:16", value: "9:16" },
              { title: "Photo 3:2", value: "3:2" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "sectionBackground",
      title: "Section Background Image",
      type: "image",
      description:
        'Optional full-width background behind the entire hero. Used in "Split" layout to add a coloured backdrop behind both text and image.',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.layout !== "split",
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
