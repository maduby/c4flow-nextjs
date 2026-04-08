import { MetadataRoute } from "next";
import { getSiteOriginForMetadata } from "@/lib/site-origin";

const baseUrl = getSiteOriginForMetadata();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
