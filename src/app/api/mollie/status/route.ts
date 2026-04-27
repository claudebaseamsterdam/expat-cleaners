import { NextResponse } from "next/server";
import { getBookingPayment } from "@/lib/mollie";

export const runtime = "nodejs";

/**
 * Lightweight status read used by the thank-you page to confirm payment
 * before firing the Pixel Purchase event. Authoritative because it goes
 * straight to Mollie — we never decide "paid" from the redirect URL.
 *
 * Response keeps the surface minimal: only what the client needs to
 * branch UI + tracking.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }
  try {
    const summary = await getBookingPayment(id);
    return NextResponse.json({
      id: summary.id,
      status: summary.status,
      isPaid: summary.isPaid,
      amountEur: summary.amountEur,
      bookingRef: summary.bookingRef,
    });
  } catch (err) {
    console.error("[mollie status] lookup failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "lookup failed" },
      { status: 502 },
    );
  }
}
