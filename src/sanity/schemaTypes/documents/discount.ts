import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

export const discount = defineType({
  name: "discount",
  title: "Discounts",
  type: "document",
  icon: TagIcon,
  description:
    "Set up price discounts for classes and packages. Discounts are independent of the announcement banner — you can run a discount with or without a banner, and vice versa.",
  fields: [
    defineField({
      name: "enabled",
      title: "Enable Discount",
      type: "boolean",
      description:
        "Turn this ON to apply discounted prices across the website. Turn it OFF to instantly remove all discounts.",
      initialValue: false,
    }),
    defineField({
      name: "discountPercent",
      title: "Discount Percentage",
      type: "number",
      description:
        'The percentage to reduce prices by. Enter 25 for "25% off". Prices are rounded down to the nearest Rand.',
      validation: (rule) =>
        rule.min(1).max(99).custom((val, context) => {
          const parent = context.parent as { enabled?: boolean };
          if (parent?.enabled && !val) {
            return "Please enter a discount percentage.";
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "discountScope",
      title: "Apply Discount To",
      type: "string",
      description:
        "Choose whether the discount applies to all group classes or only specific ones.",
      options: {
        list: [
          { title: "All classes", value: "all" },
          { title: "Specific classes only", value: "specific" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "discountClasses",
      title: "Discounted Classes",
      type: "array",
      description:
        "Pick which classes get the discount. Only used when scope is set to specific classes.",
      of: [{ type: "reference", to: [{ type: "danceClass" }] }],
      hidden: ({ parent }) =>
        !parent?.enabled || parent?.discountScope !== "specific",
    }),
    defineField({
      name: "applyToGroupBundles",
      title: "Apply to Group Class Packages",
      type: "boolean",
      description:
        "When enabled, the discount percentage also applies to group class bundle prices.",
      initialValue: false,
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "applyToPrivateBundles",
      title: "Apply to Private Class Packages",
      type: "boolean",
      description:
        "When enabled, the discount percentage also applies to private class bundle prices.",
      initialValue: false,
      hidden: ({ parent }) => !parent?.enabled,
    }),
    defineField({
      name: "label",
      title: "Badge Label (optional)",
      type: "string",
      description:
        'A short label shown on discount badges and in the schedule. Defaults to "X% OFF" if left empty. Example: "SUMMER SALE"',
      hidden: ({ parent }) => !parent?.enabled,
    }),
  ],
  preview: {
    select: {
      enabled: "enabled",
      discountPercent: "discountPercent",
      discountScope: "discountScope",
      applyToGroupBundles: "applyToGroupBundles",
      applyToPrivateBundles: "applyToPrivateBundles",
      label: "label",
    },
    prepare({
      enabled,
      discountPercent,
      discountScope,
      applyToGroupBundles,
      applyToPrivateBundles,
      label,
    }) {
      const status = enabled ? "✅ Active" : "❌ Inactive";
      if (!enabled || !discountPercent) {
        return { title: label || "Discounts", subtitle: status };
      }
      const targets: string[] = [];
      targets.push(discountScope === "all" ? "all classes" : "selected classes");
      if (applyToGroupBundles) targets.push("group packages");
      if (applyToPrivateBundles) targets.push("private packages");
      return {
        title: label || "Discounts",
        subtitle: `${status} · ${discountPercent}% OFF ${targets.join(", ")}`,
      };
    },
  },
});
