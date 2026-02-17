import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-02-17",
  useCdn: false,
});

async function run() {
  console.log("Updating announcement bar + discount...\n");

  // Update announcement banner text
  await client
    .patch("announcementBar")
    .set({
      enabled: true,
      text: "SALE! 25% OFF ALL GROUP CLASSES & PACKAGES UNTIL END OF MARCH 2026",
      link: "https://movetoexpresswithc4flow.setmore.com/",
      showInSchedule: true,
      scheduleText:
        "Bring your partner or galentine and enjoy discounted rates all weekend.",
    })
    .commit();

  console.log("  ✓ Banner: enabled with promo text");

  // Update discount settings (separate document)
  await client
    .patch("discount")
    .set({
      enabled: true,
      discountPercent: 25,
      discountScope: "all",
    })
    .commit();

  console.log("  ✓ Discount: 25% off all classes");
  console.log("\n✅ Done!");
}

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
