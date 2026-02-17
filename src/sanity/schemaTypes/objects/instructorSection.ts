import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const instructorSection = defineType({
  name: "instructorSection",
  title: "Instructor Section",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Meet Your Instructor",
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", instructorName: "instructor.name" },
    prepare({ title, instructorName }) {
      return {
        title: title || "Instructor",
        subtitle: instructorName || "Instructor Section",
      };
    },
  },
});
