import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  /**
   * Whether to show the canal-house gable mark to the left of the
   * wordmark. Defaults to false to preserve the prior text-only
   * behaviour for header/footer usage; pass `withMark` on hero,
   * splash, and brand-anchor surfaces where the full lockup belongs.
   */
  withMark?: boolean;
  /**
   * Colour of the trailing period dot. Brand kit v2 specifies:
   *   - "#5C6B52" sage on cream / ink backgrounds (default)
   *   - "#A6B098" lighter sage on dark/ink backgrounds (reverse)
   *   - "currentColor" on sage backgrounds (cream-on-sage lockup)
   */
  dotColor?: string;
};

/**
 * expatcleaners wordmark per Brand Kit v2 (April 2026).
 *
 * Typography: Fraunces 500, font-variation-settings 'SOFT' 0 'opsz' 144,
 * letter-spacing -0.022em (matches the official SVG's -3.7px at 170pt).
 * Lowercase, with a sage-coloured period at the end — never plain.
 *
 * The mark (set via `withMark`) is the stepped-gable Amsterdam canal
 * house silhouette + baseline that defines the brand identity. It is
 * inlined as SVG so it ships with no extra HTTP request and scales
 * cleanly at every viewport.
 *
 * Colour inherits from the parent's `currentColor` by default — pass
 * `className` or `style` to force a specific colour (e.g. cream over
 * the hero photograph).
 */
export function Wordmark({
  className,
  style,
  withMark = false,
  dotColor = "#5C6B52",
}: Props) {
  return (
    <span
      aria-label="expatcleaners — home"
      className={cn(
        "inline-flex items-center gap-2 leading-none",
        className,
      )}
      style={style}
    >
      {withMark ? <GableMark className="h-[1.05em] w-auto shrink-0" /> : null}
      <span
        className="font-display text-[18px] leading-none"
        style={{
          fontWeight: 500,
          letterSpacing: "-0.022em",
          fontVariationSettings: "'SOFT' 0, 'opsz' 144",
        }}
      >
        expatcleaners
        <span style={{ color: dotColor }}>.</span>
      </span>
    </span>
  );
}

/**
 * Standalone canal-house gable mark — viewBox 0 0 100 122 matching the
 * official SVG. Stroke uses currentColor so it picks up the parent's
 * colour by default. Use `<GableMark className="h-6 w-6 text-ink" />`
 * for inline placement.
 */
export function GableMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 122"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="expatcleaners mark"
      className={className}
      style={style}
    >
      <path
        d="M 18 118 L 18 50 L 18 46 L 28 46 L 28 38 L 38 38 L 38 30 L 48 30 L 48 22 L 52 22 L 52 30 L 62 30 L 62 38 L 72 38 L 72 46 L 82 46 L 82 50 L 82 118 Z"
        stroke="currentColor"
        fill="none"
        strokeWidth={5}
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <line
        x1={0}
        y1={120}
        x2={100}
        y2={120}
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="square"
      />
    </svg>
  );
}
