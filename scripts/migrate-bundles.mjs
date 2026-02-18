#!/usr/bin/env node

/**
 * One-time migration: create pricingBundle documents from existing
 * inline pricingSection packages, then patch the page sections to
 * use bundleCategory instead of the inline packages array.
 *
 * Usage: node scripts/migrate-bundles.mjs
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-17",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const GROUP_BUNDLES = [
  {
    _id: "bundle-group-single",
    name: "Class by Class",
    tagline: "Pay as you flow",
    price: 200,
    note: "Valid for group classes only",
    highlighted: false,
    category: "group",
    order: 1,
  },
  {
    _id: "bundle-group-6pack",
    name: "6-Class Pack",
    tagline: "Consistency made simple.",
    price: 1050,
    note: "Valid for group classes only",
    highlighted: false,
    category: "group",
    order: 2,
  },
  {
    _id: "bundle-group-10pack",
    name: "10-Class Pack",
    tagline: "Ultimate flexibility for your schedule.",
    price: 1800,
    note: "Valid for group classes only",
    highlighted: false,
    category: "group",
    order: 3,
  },
  {
    _id: "bundle-group-unlimited",
    name: "Unlimited Monthly",
    tagline: "Your practice, without limits.",
    price: 2000,
    note: "Unlimited group classes",
    highlighted: true,
    category: "group",
    order: 4,
  },
];

const PRIVATE_BUNDLES = [
  {
    _id: "bundle-private-single",
    name: "Class by Class",
    note: "Your space to explore",
    price: 450,
    highlighted: false,
    category: "private",
    order: 1,
  },
  {
    _id: "bundle-private-4pack",
    name: "4-Class Pack",
    note: "Build your momentum",
    price: 1500,
    highlighted: false,
    category: "private",
    order: 2,
  },
  {
    _id: "bundle-private-6pack",
    name: "6-Class Pack",
    note: "Invest in your flow",
    price: 2100,
    highlighted: false,
    category: "private",
    order: 3,
  },
  {
    _id: "bundle-private-8pack",
    name: "8-Class Pack",
    note: "Stay in the flow",
    price: 2400,
    highlighted: false,
    category: "private",
    order: 4,
  },
  {
    _id: "bundle-private-10pack",
    name: "10-Class Pack",
    note: "Go all in",
    price: 2750,
    highlighted: true,
    category: "private",
    order: 5,
  },
];

async function run() {
  const allBundles = [...GROUP_BUNDLES, ...PRIVATE_BUNDLES];

  // Step 1: Create bundle documents
  console.log(`Creating ${allBundles.length} pricing bundle documents...`);
  const tx = client.transaction();
  for (const bundle of allBundles) {
    tx.createOrReplace({
      ...bundle,
      _type: "pricingBundle",
    });
  }
  await tx.commit();
  console.log("Bundle documents created.");

  // Step 2: Find the Classes page and patch its pricingSection blocks
  console.log("Patching pricingSection blocks on the Classes page...");
  const page = await client.fetch(
    `*[_type == "page" && slug.current == "classes"][0]{
      _id,
      sections[]{_key, _type, heading}
    }`
  );

  if (!page) {
    console.log("No 'classes' page found — skipping section patches.");
    return;
  }

  const pricingSections = page.sections.filter(
    (s) => s._type === "pricingSection"
  );

  for (const section of pricingSections) {
    const isGroup = /group/i.test(section.heading || "");
    const category = isGroup ? "group" : "private";

    await client
      .patch(page._id)
      .set({
        [`sections[_key=="${section._key}"].bundleCategory`]: category,
      })
      .unset([`sections[_key=="${section._key}"].packages`])
      .commit();

    console.log(
      `  Patched "${section.heading}" → bundleCategory: "${category}"`
    );
  }

  // Also patch the draft if it exists
  const draftId = `drafts.${page._id}`;
  try {
    const draft = await client.fetch(
      `*[_id == $id][0]{_id, sections[]{_key, _type, heading}}`,
      { id: draftId }
    );
    if (draft) {
      const draftPricingSections = draft.sections.filter(
        (s) => s._type === "pricingSection"
      );
      for (const section of draftPricingSections) {
        const isGroup = /group/i.test(section.heading || "");
        const category = isGroup ? "group" : "private";
        await client
          .patch(draftId)
          .set({
            [`sections[_key=="${section._key}"].bundleCategory`]: category,
          })
          .unset([`sections[_key=="${section._key}"].packages`])
          .commit();
        console.log(
          `  Patched draft "${section.heading}" → bundleCategory: "${category}"`
        );
      }
    }
  } catch {
    // No draft exists, that's fine
  }

  console.log("Migration complete.");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
