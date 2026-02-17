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
  console.log("Updating announcement bar with promo...\n");

  await client
    .patch("announcementBar")
    .set({
      enabled: true,
      text: "SALE! 25% OFF ALL GROUP CLASSES & PACKAGES UNTIL END OF MARCH 2026",
      link: "https://movetoexpresswithc4flow.setmore.com/",
      discountEnabled: true,
      discountPercent: 25,
      discountScope: "all",
    })
    .commit();

  console.log("  ✓ Banner: enabled with 25% discount on all classes");
  console.log("\n✅ Done!");
}

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
