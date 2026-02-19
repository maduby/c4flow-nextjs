import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const PREVIEW_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default defineConfig({
  name: "c4flow",
  title: "C4 Flow Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ik9ho36m",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/admin",

  plugins: [
    colorInput(),
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    ...(process.env.NODE_ENV === "development" ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },
});
