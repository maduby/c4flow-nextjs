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
  console.log("Updating hero layouts...\n");

  // Homepage: centered layout (already the default, but set explicitly)
  await client
    .patch("page-home")
    .set({
      'sections[_key=="hero"].layout': "centered",
    })
    .commit();
  console.log("  ✓ Homepage → centered (with logo)");

  // About: gradient layout with mission body text
  await client
    .patch("page-about")
    .set({
      'sections[_key=="hero"].layout': "gradient",
      'sections[_key=="hero"].headline': "Our Mission",
      'sections[_key=="hero"].body':
        "At C-4 Flow, our mission is to create an inclusive, affirming space where people of all races, genders, body types, abilities, and experience levels feel welcome to explore movement as a form of self-expression. We are committed to fostering confidence, empowerment, and body autonomy through pole and exotic dance, while honoring individuality and celebrating diversity in all its forms.",
    })
    .commit();
  console.log("  ✓ About → gradient (Our Mission)");

  // Classes: split layout with body text
  await client
    .patch("page-classes")
    .set({
      'sections[_key=="hero"].layout': "split",
      'sections[_key=="hero"].subtitle':
        "Choose your flow: group energy or private focus.",
      'sections[_key=="hero"].body':
        "At C-4 Flow, we offer both group and private pole and exotic dance classes across a variety of styles. You can book a single class or choose a package that fits your rhythm.\n\nGroup classes bring connection, shared energy, and a close, supportive studio vibe. Private sessions offer focused, one-on-one time to refine technique, build confidence, and move at your own pace. Beginners are always welcome, and every class is designed to meet you where you are.",
    })
    .commit();
  console.log("  ✓ Classes → split (text left, image right)");

  // Contact: gradient layout
  await client
    .patch("page-contact")
    .set({
      'sections[_key=="hero"].layout': "gradient",
      'sections[_key=="hero"].body':
        "Have questions? Want to book a class? We'd love to hear from you.",
    })
    .commit();
  console.log("  ✓ Contact → gradient");

  console.log("\n✅ All hero layouts updated!");
}

run().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
