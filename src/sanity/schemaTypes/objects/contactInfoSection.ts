import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactInfoSection = defineType({
  name: "contactInfoSection",
  title: "Contact Info Cards",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "studioHours",
      title: "Studio Hours",
      type: "string",
      description:
        'Displayed in the "Studio Hours" card, e.g. "By appointment only".',
      initialValue: "By appointment only",
    }),
    defineField({
      name: "closedDay",
      title: "Closed Day",
      type: "string",
      description: 'e.g. "Sunday: Closed"',
      initialValue: "Sunday: Closed",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return {
        title: title || "Contact Info Cards",
        subtitle: "Contact Info Section",
      };
    },
  },
});
