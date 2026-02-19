import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

/** Next.js Image blur placeholder props — pass the LQIP from a Sanity image. */
export function blurProps(lqip?: string | null) {
  if (!lqip) return {};
  return { placeholder: "blur" as const, blurDataURL: lqip };
}
