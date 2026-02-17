import { createClient } from "@sanity/client";
import { createReadStream } from "fs";
import { basename } from "path";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-02-17",
  useCdn: false,
});

const ASSETS_DIR = new URL("./assets/", import.meta.url).pathname;

async function uploadImage(filename, label) {
  const filepath = `${ASSETS_DIR}${filename}`;
  const stream = createReadStream(filepath);
  const asset = await client.assets.upload("image", stream, {
    filename: basename(filepath),
    label,
  });
  console.log(`  ✓ Uploaded: ${filename} → ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function run() {
  console.log("Uploading images to Sanity...\n");

  // -- Logo and hero --
  const logo = await uploadImage("logo-c4.png", "C4 Flow Logo");
  const heroImage = await uploadImage("hero-studio.png", "Hero - Studio");

  // -- Feature icons --
  const featureStrength = await uploadImage("feature-strength.png", "Feature - Strength");
  const featureBalance = await uploadImage("feature-balance.png", "Feature - Balance");
  const featureFlexibility = await uploadImage("feature-flexibility.png", "Feature - Flexibility");
  const featureFlow = await uploadImage("feature-flow.png", "Feature - Flow");

  // -- Instructor --
  const instructorPhoto = await uploadImage("instructor-cattleya.jpg", "Instructor - Cattleya");

  // -- Class images --
  const classExotic = await uploadImage("class-exotic.jpg", "Class - Exotic");
  const classStudio = await uploadImage("class-studio.jpg", "Class - Studio");
  const instructorPortrait = await uploadImage("instructor-portrait.jpg", "Instructor portrait");

  // -- Gallery --
  const gallery1 = await uploadImage("gallery-1.jpg", "Gallery - Studio 1");
  const gallery2 = await uploadImage("gallery-2.jpg", "Gallery - Studio 2");
  const gallery3 = await uploadImage("gallery-3.jpg", "Gallery - Studio 3");
  const gallery4 = await uploadImage("gallery-4.jpg", "Gallery - Studio 4");
  const gallery5 = await uploadImage("gallery-5.jpg", "Gallery - Studio 5");
  const gallery6 = await uploadImage("gallery-6.jpg", "Gallery - Studio 6");

  console.log("\nUpdating documents...\n");

  // -- Site Settings: logo --
  await client.patch("siteSettings").set({ logo }).commit();
  console.log("  ✓ Site Settings: logo");

  // -- Instructor: photo --
  await client.patch("instructor-cattleya").set({ photo: instructorPhoto }).commit();
  console.log("  ✓ Instructor: photo");

  // -- Classes: images --
  await client.patch("class-group-pole").set({ image: classStudio }).commit();
  console.log("  ✓ Group Pole Class: image");

  await client.patch("class-private-session").set({ image: instructorPortrait }).commit();
  console.log("  ✓ Private Session: image");

  await client.patch("class-exotic-pole").set({ image: classExotic }).commit();
  console.log("  ✓ Exotic Pole Class: image");

  // -- Homepage: hero background + feature icons --
  await client
    .patch("page-home")
    .set({
      "sections[_key==\"hero\"].backgroundImage": heroImage,
      "sections[_key==\"features\"].features[_key==\"f1\"].icon": featureStrength,
      "sections[_key==\"features\"].features[_key==\"f2\"].icon": featureFlexibility,
      "sections[_key==\"features\"].features[_key==\"f3\"].icon": featureFlow,
    })
    .commit();
  console.log("  ✓ Homepage: hero image + feature icons");

  // -- About page: hero + gallery --
  await client
    .patch("page-about")
    .set({
      "sections[_key==\"hero\"].backgroundImage": heroImage,
      "sections[_key==\"gallery\"].images": [
        { ...gallery1, _key: "g1", alt: "C4 Flow studio interior" },
        { ...gallery2, _key: "g2", alt: "Pole dance studio equipment" },
        { ...gallery3, _key: "g3", alt: "Studio panoramic view" },
        { ...gallery4, _key: "g4", alt: "Dance studio space" },
        { ...gallery5, _key: "g5", alt: "Studio lighting and mirrors" },
        { ...gallery6, _key: "g6", alt: "Training area" },
      ],
    })
    .commit();
  console.log("  ✓ About page: hero image + gallery");

  // -- Classes page: hero --
  await client
    .patch("page-classes")
    .set({ "sections[_key==\"hero\"].backgroundImage": heroImage })
    .commit();
  console.log("  ✓ Classes page: hero image");

  // -- Contact page: hero --
  await client
    .patch("page-contact")
    .set({ "sections[_key==\"hero\"].backgroundImage": heroImage })
    .commit();
  console.log("  ✓ Contact page: hero image");

  console.log("\n✅ All images uploaded and linked!");
}

run().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
