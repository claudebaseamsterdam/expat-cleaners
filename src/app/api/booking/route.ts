import { NextResponse } from "next/server";
import { submitBooking, type BookingPayload } from "@/services/agents";
import { sendBookingNotification } from "@/lib/email";
import { createBookingPayment } from "@/lib/mollie";

export const runtime = "nodejs";

/**
 * POST /api/booking
 *
 * Accepts a BookingPayload, hands off to the WhatsApp Closing agent (via the
 * agent service layer), and returns the WhatsApp-ready message + summary.
 * The frontend opens `wa.me/...?text=<whatsappMessage>` from the response.
 */
type BookingRequestBody = BookingPayload & { mode?: "whatsapp" | "pay" };

export async function POST(request: Request) {
  let body: BookingRequestBody;
  try {
    body = (await request.json()) as BookingRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const mode: "whatsapp" | "pay" = body.mode === "pay" ? "pay" : "whatsapp";
  const payload: BookingPayload = body;

  // Enforce 2-hour minimum at the API boundary — never quote less.
  if (!payload.hours_estimate || payload.hours_estimate < 2) {
    payload.hours_estimate = 2;
  }

  try {
    const result = await submitBooking(payload);

    // Create the Mollie payment only when the user chose "Pay now & reserve".
    // The server-side estimated_price_eur from submitBooking is the trusted
    // total — never trust a client-supplied figure. Mollie failure is
    // non-fatal to the booking record itself, but the user-facing flow
    // needs to know so it can show a clear error.
    if (
      mode === "pay" &&
      result.success &&
      result.ref &&
      result.summary?.estimated_price_eur
    ) {
      try {
        const freqLabel =
          payload.frequency && payload.frequency !== "once"
            ? `${payload.service_type} ${payload.frequency}`
            : payload.service_type;
        const compactPostcode = (payload.postcode || "").replace(/\s+/g, "");
        const descParts = [
          `ExpatCleaners booking ${result.ref}`,
          freqLabel,
          `${payload.hours_estimate}h`,
          compactPostcode,
        ].filter(Boolean);
        const description = descParts.join(" · ");

        const { checkoutUrl, paymentId } = await createBookingPayment({
          bookingRef: result.ref,
          amountEur: result.summary.estimated_price_eur,
          description,
          customerName: payload.name,
          metadata: {
            phone: payload.phone,
            postcode: payload.postcode,
            service_type: payload.service_type,
            frequency: payload.frequency,
            hours: payload.hours_estimate,
            preferred_date: payload.preferred_date,
            preferred_time: payload.preferred_time,
          },
        });
        result.checkoutUrl = checkoutUrl;
        result.paymentId = paymentId;
      } catch (err) {
        console.error("[booking] Mollie payment creation failed:", err);
        result.paymentWarning =
          err instanceof Error ? err.message : "Payment service unavailable";
      }
    }

    // Internal booking notification. Fire-and-forget: the user-facing
    // booking response must succeed even if email delivery fails.
    if (result.success) {
      const sourcePage = request.headers.get("referer");
      const emailResult = await sendBookingNotification({
        payload,
        result,
        sourcePage,
      }).catch((err: unknown) => ({
        ok: false as const,
        error: err instanceof Error ? err.message : String(err),
      }));
      if (!emailResult.ok) {
        console.error("[booking] notification email failed:", emailResult.error);
      }
    }

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
