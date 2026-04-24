import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

/**
 * expatcleaners wordmark — Fraunces, weight 400, letter-spacing -0.01em.
 * Lowercase, no symbol. Colour inherits from the parent's current
 * colour by default; pass `className` or `style` to force a specific
 * colour (e.g. cream over the hero).
 */
export function Wordmark({ className, style }: Props) {
  return (
    <span
      aria-label="expatcleaners — home"
      className={cn(
        "font-display text-[18px] leading-none tracking-[-0.01em]",
        className,
      )}
      style={{ fontWeight: 400, ...style }}
    >
      expatcleaners
    </span>
  );
}
