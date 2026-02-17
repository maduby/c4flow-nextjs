import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  description:
    "Messages sent via the contact form on the website. These are read-only — you can mark them as read but cannot edit the content.",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "read",
      title: "Mark as Read",
      type: "boolean",
      description: "Check this box once you've responded to the message.",
      initialValue: false,
      readOnly: false,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "email", subtitle: "submittedAt", read: "read" },
    prepare({ title, subtitle, read }) {
      return {
        title: `${read ? "" : "● "}${title}`,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("en-ZA", {
              dateStyle: "medium",
            })
          : "Unknown date",
      };
    },
  },
});
