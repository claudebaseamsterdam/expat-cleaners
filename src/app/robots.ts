import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";

/**
 * Phase 7.2 — robots.txt with sitemap reference. Next.js App Router
 * serves this at `/robots.txt` automatically. Currently allows all
 * crawlers across the entire site; revisit if we ever add a staging
 * subdomain or admin path.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
    host: BRAND.siteUrl,
  };
}
