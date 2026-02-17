import { defineType, defineField, defineArrayMember } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "faqs",
      title: "Questions & Answers",
      type: "array",
      description:
        'Click "+ Add item" to add a question. Drag to reorder.',
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { faqs: "faqs" },
    prepare({ faqs }) {
      return {
        title: `FAQ (${faqs?.length || 0} items)`,
        subtitle: "Frequently Asked Questions",
      };
    },
  },
});
