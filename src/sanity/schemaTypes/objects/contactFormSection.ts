import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactFormSection = defineType({
  name: "contactFormSection",
  title: "Contact Form Section",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Send a message",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "string",
      initialValue: "Thank you! We'll get back to you as soon as possible.",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Contact Form", subtitle: "Contact Form Section" };
    },
  },
});
