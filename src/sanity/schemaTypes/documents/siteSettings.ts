import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "branding", title: "Branding", default: true },
    { name: "contact", title: "Contact & Social" },
    { name: "location", title: "Location" },
    { name: "seo", title: "SEO / Social Sharing" },
  ],
  fields: [
    // ── Branding ──
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: "branding",
      description: "The studio name shown in the header, footer, and browser tab.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "branding",
      description: 'Shown below the name in the footer, e.g. "Pole & Exotic Dance Studio".',
    }),
    defineField({
      name: "motto",
      title: "Motto",
      type: "string",
      group: "branding",
      description: 'An optional italic line, e.g. "Move to Express".',
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "branding",
      description:
        "The C4 Flow logo. Used in the header, footer, and hero section. PNG with transparent background works best.",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "branding",
      description: "Small icon shown in the browser tab. Square image, ideally 512 x 512 px.",
    }),

    // ── Contact & Social ──
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "contact",
      description: "Shown in the footer and used for the contact form.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "contact",
      description: 'Include country code, e.g. "+27 65 391 7901".',
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      group: "contact",
      description:
        'International format WITHOUT the + sign, e.g. "27653917901". This powers the green WhatsApp button on every page.',
    }),
    defineField({
      name: "whatsappMessage",
      title: "WhatsApp Default Message",
      type: "string",
      group: "contact",
      description:
        "Pre-filled message when someone clicks the WhatsApp button. Leave empty for no pre-filled text.",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram (Studio)",
      type: "url",
      group: "contact",
      description: "Full URL to the studio Instagram profile.",
    }),
    defineField({
      name: "instructorInstagramUrl",
      title: "Instagram (Instructor)",
      type: "url",
      group: "contact",
      description: "Full URL to the instructor's personal Instagram.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking Platform URL",
      type: "url",
      group: "contact",
      description:
        'The main Setmore booking link. Used for the "Book Now" button in the navigation.',
    }),

    // ── Location ──
    defineField({
      name: "address",
      title: "Studio Address",
      type: "object",
      group: "location",
      description: "The physical address shown in the footer and on the contact page.",
      fields: [
        defineField({ name: "building", type: "string", title: "Building Name" }),
        defineField({ name: "street", type: "string", title: "Street Address" }),
        defineField({ name: "city", type: "string", title: "City" }),
        defineField({ name: "province", type: "string", title: "Province" }),
        defineField({ name: "postalCode", type: "string", title: "Postal Code" }),
      ],
    }),
    defineField({
      name: "mapsUrl",
      title: "Google Maps Link",
      type: "url",
      group: "location",
      description:
        'Go to Google Maps, find the studio, click "Share" → "Copy link" and paste it here.',
    }),

    // ── SEO ──
    defineField({
      name: "defaultOgImage",
      title: "Default Social Share Image",
      type: "image",
      group: "seo",
      description:
        "This image appears when someone shares a page on Facebook, WhatsApp, or Twitter. Recommended size: 1200 x 630 pixels.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "siteName", media: "logo" },
  },
});
