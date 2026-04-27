import type { KnowledgeBase } from "@/lib/catalog";
import { formatCurrency, formatPriceLabel } from "@/lib/utils";

export function buildClassesJson(knowledge: KnowledgeBase) {
  return {
    generatedAt: knowledge.generatedAt,
    source: knowledge.site.url,
    classes: knowledge.classes.map((entry) => ({
      id: entry.id,
      name: entry.name,
      slug: entry.slug,
      url: entry.url,
      category: entry.category,
      tagline: entry.tagline,
      shortDescription: entry.shortDescription,
      description: entry.descriptionText,
      durationMinutes: entry.durationMinutes,
      bookingUrl: entry.bookingUrl,
      price: {
        currency: entry.priceCurrency,
        listPrice: entry.listPrice,
        currentPrice: entry.currentPrice,
        salePrice: entry.salePrice,
        hasDiscount: entry.hasDiscount,
        discountLabel: entry.discountLabel,
      },
      schedule: entry.schedule,
    })),
  };
}

export function buildPricingJson(knowledge: KnowledgeBase) {
  return {
    generatedAt: knowledge.generatedAt,
    source: knowledge.site.url,
    classPricing: knowledge.classes.map((entry) => ({
      name: entry.name,
      url: entry.url,
      bookingUrl: entry.bookingUrl,
      currency: entry.priceCurrency,
      listPrice: entry.listPrice,
      currentPrice: entry.currentPrice,
      salePrice: entry.salePrice,
      hasDiscount: entry.hasDiscount,
      discountLabel: entry.discountLabel,
    })),
    bundlePricing: knowledge.bundles.map((bundle) => ({
      name: bundle.name,
      category: bundle.category,
      url: bundle.url,
      currency: bundle.priceCurrency,
      listPrice: bundle.listPrice,
      currentPrice: bundle.currentPrice,
      salePrice: bundle.salePrice,
      hasDiscount: bundle.hasDiscount,
      discountLabel: bundle.discountLabel,
      note: bundle.note,
    })),
  };
}

export function buildScheduleJson(knowledge: KnowledgeBase) {
  return {
    generatedAt: knowledge.generatedAt,
    source: knowledge.site.url,
    timezone: "Africa/Johannesburg",
    scheduleByDay: knowledge.scheduleByDay,
  };
}

export function buildKnowledgeJson(knowledge: KnowledgeBase) {
  return {
    generatedAt: knowledge.generatedAt,
    site: knowledge.site,
    pages: knowledge.pages,
    classes: buildClassesJson(knowledge).classes,
    pricing: buildPricingJson(knowledge),
    schedule: buildScheduleJson(knowledge),
  };
}

export function buildLlmsTxt(knowledge: KnowledgeBase): string {
  const lines = [
    `# ${knowledge.site.name}`,
    "",
    `> ${knowledge.site.tagline} in ${knowledge.site.address.city}, South Africa. Use the linked pages and machine-readable files below for authoritative class schedules, prices, booking URLs, and contact details.`,
    "",
    "## Canonical Pages",
    `- [Homepage](${knowledge.site.url}): Studio overview, featured classes, weekly schedule, and booking entry point.`,
    `- [Classes](${knowledge.site.url}/classes): Full class catalog, prices, and detailed descriptions.`,
    `- [About](${knowledge.site.url}/about): Studio story and instructor information.`,
    `- [Contact](${knowledge.site.url}/contact): Address, map, WhatsApp, phone, and email.`,
    "",
    "## Class Pages",
    ...knowledge.classes.map(
      (entry) =>
        `- [${entry.name}](${entry.url}): ${entry.summary}${
          entry.currentPrice != null
            ? ` Current price ${entry.currentPrice === 0 ? "FREE" : formatCurrency(entry.currentPrice)}.`
            : ""
        }`,
    ),
    "",
    "## Machine-readable Files",
    `- [knowledge.json](${knowledge.site.url}/knowledge.json): Full business, page, class, schedule, and pricing dataset.`,
    `- [classes.json](${knowledge.site.url}/classes.json): Active classes with descriptions, durations, booking URLs, and weekly schedule.`,
    `- [schedule.json](${knowledge.site.url}/schedule.json): Weekly schedule grouped by day with class URLs and prices.`,
    `- [pricing.json](${knowledge.site.url}/pricing.json): Class and bundle pricing in ZAR.`,
    `- [llms-full.txt](${knowledge.site.url}/llms-full.txt): Expanded markdown reference for LLMs and agents.`,
    "",
    "## Retrieval Guidance",
    "- Prefer class-specific pages for individual class questions.",
    "- Prefer schedule.json for exact day/time lookups.",
    "- Prefer pricing.json for exact current prices.",
    "- If visible page content and a machine-readable file ever differ, treat visible page content as the source of truth.",
  ];

  return `${lines.join("\n")}\n`;
}

export function buildLlmsFullTxt(knowledge: KnowledgeBase): string {
  const lines = [
    `# ${knowledge.site.name} Reference`,
    "",
    `Site: ${knowledge.site.url}`,
    `Studio: ${knowledge.site.tagline}`,
    `Location: ${knowledge.site.address.building ? `${knowledge.site.address.building}, ` : ""}${knowledge.site.address.street}, ${knowledge.site.address.city}, ${knowledge.site.address.province}, ${knowledge.site.address.postalCode}`,
    `Phone: ${knowledge.site.phone}`,
    `Email: ${knowledge.site.email}`,
    `WhatsApp: ${knowledge.site.whatsappNumber}`,
    `Booking URL: ${knowledge.site.bookingUrl}`,
    "",
    "## Pages",
    ...knowledge.pages.map(
      (page) =>
        `- ${page.title}: ${page.url}${page.description ? ` — ${page.description}` : ""}`,
    ),
    "",
    "## Classes",
  ];

  for (const entry of knowledge.classes) {
    lines.push(`### ${entry.name}`);
    lines.push(`- URL: ${entry.url}`);
    lines.push(`- Booking: ${entry.bookingUrl}`);
    if (entry.tagline) lines.push(`- Tagline: ${entry.tagline}`);
    if (entry.category) lines.push(`- Category: ${entry.category}`);
    if (entry.durationMinutes) lines.push(`- Duration: ${entry.durationMinutes} minutes`);
    if (entry.currentPrice != null) {
      lines.push(
        `- Current price: ${formatPriceLabel(entry.currentPrice)}${
          entry.listPrice && entry.listPrice !== entry.currentPrice
            ? ` (list price ${formatCurrency(entry.listPrice)})`
            : ""
        }`,
      );
    }
    if (entry.summary) lines.push(`- Summary: ${entry.summary}`);
    if (entry.schedule.length) {
      lines.push("- Schedule:");
      for (const slot of entry.schedule) {
        lines.push(`  - ${slot.day} at ${slot.time}`);
      }
    } else {
      lines.push("- Schedule: See the main classes page for the latest times.");
    }
    lines.push("");
  }

  lines.push("## Weekly Schedule");
  for (const day of knowledge.scheduleByDay) {
    lines.push(`### ${day.day}`);
    for (const slot of day.slots) {
      lines.push(
        `- ${slot.time} — ${slot.className}${
          slot.currentPrice != null ? ` — ${formatPriceLabel(slot.currentPrice)}` : ""
        } — ${slot.classUrl}`,
      );
    }
    lines.push("");
  }

  lines.push("## Bundle Pricing");
  for (const bundle of knowledge.bundles) {
    lines.push(
      `- ${bundle.name} (${bundle.category}) — ${formatCurrency(bundle.currentPrice)}${
        bundle.listPrice !== bundle.currentPrice
          ? ` (list price ${formatCurrency(bundle.listPrice)})`
          : ""
      }${bundle.note ? ` — ${bundle.note}` : ""}`,
    );
  }

  lines.push("");
  lines.push("## Machine-readable Files");
  lines.push(`- ${knowledge.site.url}/knowledge.json`);
  lines.push(`- ${knowledge.site.url}/classes.json`);
  lines.push(`- ${knowledge.site.url}/schedule.json`);
  lines.push(`- ${knowledge.site.url}/pricing.json`);

  return `${lines.join("\n")}\n`;
}
