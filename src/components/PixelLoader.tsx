"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/pixel";

/**
 * Mounted once at the layout level. The root layout injects the Meta Pixel
 * base script and fires the initial PageView. This client loader only
 * fires PageView on subsequent client navigations.
 */
export function PixelLoader() {
  const pathname = usePathname();
  const firstMount = useRef(true);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    trackPageView();
  }, [pathname]);

  return null;
}
