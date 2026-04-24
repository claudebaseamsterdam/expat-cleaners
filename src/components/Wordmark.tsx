import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * expatcleaners wordmark — Fraunces, weight 400, letter-spacing -0.01em.
 * Lowercase, no symbol. Colour defaults to `ink`; pass a className to
 * override (e.g. `text-cream` on dark contexts).
 */
export function Wordmark({ className }: Props) {
  return (
    <span
      aria-label="expatcleaners — home"
      className={cn(
        "font-display text-[18px] leading-none tracking-[-0.01em]",
        className,
      )}
      style={{ fontWeight: 400 }}
    >
      expatcleaners
    </span>
  );
}
