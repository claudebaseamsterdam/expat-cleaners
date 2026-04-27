"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ensurePixel, trackPageView } from "@/lib/pixel";

/**
 * Mounted once at the layout level. Loads the Meta Pixel base script
 * (no-op when NEXT_PUBLIC_META_PIXEL_ID is missing) and fires PageView
 * on every App Router pathname change — App Router does not fire any
 * navigation event by default, so we synthesize one here.
 */
export function PixelLoader() {
  const pathname = usePathname();

  useEffect(() => {
    ensurePixel();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
