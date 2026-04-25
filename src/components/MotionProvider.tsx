"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps children in a Framer Motion config that defers to the user's
 * prefers-reduced-motion setting. With reducedMotion="user", any motion
 * component on the page that the user's OS asks to suppress will skip
 * its transitions instead of forcing them on.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
