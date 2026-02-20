import { defineArrayMember, defineField } from "sanity";

/**
 * Minimal Portable Text block config for short rich-text fields.
 * Allows: paragraphs, bold, italic, and links — no headings, images, or lists.
 */
export const simpleRichText = [
  defineArrayMember({
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: [],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              type: "url",
              title: "URL",
              validation: (rule) =>
                rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
            }),
          ],
        },
      ],
    },
  }),
];
