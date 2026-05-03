import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";

/**
 * Phase 7.1 — XML sitemap for the four indexable routes. Next.js App
 * Router serves this at `/sitemap.xml` automatically.
 *
 *  - `/`         — homepage (highest priority, monthly content edits).
 *  - `/book`     — booking flow (high priority — primary conversion).
 *  - `/terms`    — legal page (low priority, rarely changes).
 *  - `/privacy`  — legal page (low priority, rarely changes).
 *
 * `lastModified` is computed at build time. Re-deploy to refresh it.
 * Anonymous query routes like `/book?service=deep` are not enumerated;
 * crawlers follow the canonical `/book` and discover variants from
 * homepage / footer links.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${BRAND.siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BRAND.siteUrl}/book`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BRAND.siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BRAND.siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
