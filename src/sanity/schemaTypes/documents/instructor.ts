import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const instructor = defineType({
  name: "instructor",
  title: "Instructor",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The instructor's display name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      description: 'Shown below the name, e.g. "Pole dance instructor".',
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "string",
      description: 'A short line, e.g. "4 years experience".',
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description:
        "A portrait photo. Vertical/portrait orientation works best (3:4 ratio). Use the hotspot tool to set the focal point.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description:
        "A 1–2 sentence summary shown when there's no full bio. Keep it personal and welcoming.",
    }),
    defineField({
      name: "bio",
      title: "Full Bio",
      type: "array",
      of: [{ type: "block" }],
      description:
        "A longer biography with rich text formatting. Shown on the About page.",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram Profile URL",
      type: "url",
      description: "Full link to the instructor's Instagram profile.",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking Link",
      type: "url",
      description:
        'Personal Setmore booking link. Powers the "Book a Session" button.',
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "photo" },
  },
});
