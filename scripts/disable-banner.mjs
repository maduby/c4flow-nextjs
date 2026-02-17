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
  console.log("Disabling banner...\n");

  await client
    .patch("announcementBar")
    .set({ enabled: false })
    .commit();

  console.log("  ✓ Banner disabled");
  console.log("\n✅ Done!");
}

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
