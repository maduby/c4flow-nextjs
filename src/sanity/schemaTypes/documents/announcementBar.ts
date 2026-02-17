import { defineType, defineField } from "sanity";
import { BellIcon } from "@sanity/icons";

export const announcementBar = defineType({
  name: "announcementBar",
  title: "Announcement Bar",
  type: "document",
  icon: BellIcon,
  description:
    "The coloured banner shown at the very top of every page. Use it for promotions, new class announcements, or important notices. To set up price discounts, use the separate Discounts section.",
  groups: [
    { name: "banner", title: "Banner", default: true },
    { name: "schedule", title: "Schedule Integration" },
  ],
  fields: [
    // ── Banner ──
    defineField({
      name: "enabled",
      title: "Show Banner",
      type: "boolean",
      group: "banner",
      description:
        "Turn this ON to show the banner on every page. Turn it OFF to hide the banner.",
      initialValue: false,
    }),
    defineField({
      name: "text",
      title: "Banner Text",
      type: "string",
      group: "banner",
      description:
        'Keep it short — one sentence. Example: "SALE! 25% OFF all group classes until end of March 2026"',
      validation: (rule) =>
        rule
          .required()
          .max(120)
          .warning("Keep under 120 characters so it fits on mobile."),
    }),
    defineField({
      name: "link",
      title: "Link URL (optional)",
      type: "url",
      group: "banner",
      description:
        "If set, visitors can click the banner to go to this page (e.g. the booking link).",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),

    // ── Schedule Integration ──
    defineField({
      name: "showInSchedule",
      title: "Also Show in Weekly Schedule",
      type: "boolean",
      group: "schedule",
      description:
        "When ON, this announcement also appears as a notice card above the weekly schedule — giving it more visibility with room for extra detail.",
      initialValue: true,
    }),
    defineField({
      name: "scheduleText",
      title: "Schedule Notice Text",
      type: "text",
      group: "schedule",
      rows: 3,
      description:
        'A longer version of the banner message shown in the schedule section. Example: "Bring your partner or galentine and enjoy discounted rates all weekend."',
      hidden: ({ parent }) => !parent?.showInSchedule,
    }),
  ],
  preview: {
    select: {
      title: "text",
      enabled: "enabled",
    },
    prepare({ title, enabled }) {
      const status = enabled ? "✅ Live" : "❌ Hidden";
      return {
        title: title || "Announcement",
        subtitle: status,
      };
    },
  },
});
