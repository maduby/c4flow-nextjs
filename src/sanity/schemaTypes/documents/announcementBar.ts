import { defineType, defineField } from "sanity";
import { BellIcon } from "@sanity/icons";

export const announcementBar = defineType({
  name: "announcementBar",
  title: "Announcement Bar",
  type: "document",
  icon: BellIcon,
  description:
    "The coloured banner shown at the very top of every page. Use it for promotions, new class announcements, or important notices. You can also attach a discount that automatically reduces class prices while the banner is live.",
  groups: [
    { name: "banner", title: "Banner", default: true },
    { name: "promotion", title: "Promotion / Discount" },
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
        "Turn this ON to show the banner on every page. Turn it OFF to hide the banner AND remove any active discount from class prices.",
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

    // ── Promotion ──
    defineField({
      name: "discountEnabled",
      title: "Enable Price Discount",
      type: "boolean",
      group: "promotion",
      description:
        "When ON, class prices on the website are automatically reduced by the percentage below. Only works while the banner is also enabled.",
      initialValue: false,
    }),
    defineField({
      name: "discountPercent",
      title: "Discount Percentage",
      type: "number",
      group: "promotion",
      description:
        'The percentage to reduce prices by. Enter 25 for "25% off". Prices are rounded down to the nearest Rand.',
      validation: (rule) =>
        rule.min(1).max(99).custom((val, context) => {
          const parent = context.parent as { discountEnabled?: boolean };
          if (parent?.discountEnabled && !val) {
            return "Please enter a discount percentage.";
          }
          return true;
        }),
    }),
    defineField({
      name: "discountScope",
      title: "Apply Discount To",
      type: "string",
      group: "promotion",
      description: "Choose whether the discount applies to all classes or just specific ones.",
      options: {
        list: [
          { title: "All classes", value: "all" },
          { title: "Specific classes only", value: "specific" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      hidden: ({ parent }) => !parent?.discountEnabled,
    }),
    defineField({
      name: "discountClasses",
      title: "Discounted Classes",
      type: "array",
      group: "promotion",
      description:
        "Pick which classes get the discount. Leave empty if applying to all.",
      of: [{ type: "reference", to: [{ type: "danceClass" }] }],
      hidden: ({ parent }) =>
        !parent?.discountEnabled || parent?.discountScope !== "specific",
    }),

    // ── Schedule Integration ──
    defineField({
      name: "showInSchedule",
      title: "Also Show in Weekly Schedule",
      type: "boolean",
      group: "schedule",
      description:
        "When ON, this promotion also appears as a notice card above the weekly schedule — giving it more visibility with room for extra detail.",
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
      discountEnabled: "discountEnabled",
      discountPercent: "discountPercent",
    },
    prepare({ title, enabled, discountEnabled, discountPercent }) {
      const status = enabled ? "✅ Live" : "❌ Hidden";
      const promo =
        enabled && discountEnabled && discountPercent
          ? ` · ${discountPercent}% OFF`
          : "";
      return {
        title: title || "Announcement",
        subtitle: `${status}${promo}`,
      };
    },
  },
});
