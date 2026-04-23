import { NextResponse } from "next/server";
import { submitBooking, type BookingPayload } from "@/services/agents";

export const runtime = "nodejs";

/**
 * POST /api/booking
 *
 * Accepts a BookingPayload, hands off to the WhatsApp Closing agent (via the
 * agent service layer), and returns the WhatsApp-ready message + summary.
 * The frontend opens `wa.me/...?text=<whatsappMessage>` from the response.
 */
export async function POST(request: Request) {
  let payload: BookingPayload;
  try {
    payload = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  // Enforce 2-hour minimum at the API boundary — never quote less.
  if (!payload.hours_estimate || payload.hours_estimate < 2) {
    payload.hours_estimate = 2;
  }

  try {
    const result = await submitBooking(payload);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
