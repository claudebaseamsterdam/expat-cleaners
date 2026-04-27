import { NextResponse } from "next/server";
import { getBookingPayment } from "@/lib/mollie";
import { sendPaymentConfirmation } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Mollie webhook target. Mollie POSTs `id=tr_xxx` (form-encoded) when a
 * payment status changes. The id alone is not authoritative — we always
 * fetch the canonical payment from Mollie before acting on it.
 *
 * Always return 200 once we've handled the notification, even on
 * "not paid" outcomes. Returning non-2xx makes Mollie retry, which we
 * only want for genuine processing errors.
 */
export async function POST(request: Request) {
  let paymentId: string | null = null;
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = (await request.json()) as { id?: string };
      paymentId = body?.id ?? null;
    } else {
      const form = await request.formData();
      const idValue = form.get("id");
      paymentId = typeof idValue === "string" ? idValue : null;
    }
  } catch (err) {
    console.error("[mollie webhook] could not parse body:", err);
    return new NextResponse("invalid body", { status: 400 });
  }

  if (!paymentId) {
    return new NextResponse("missing id", { status: 400 });
  }

  try {
    const summary = await getBookingPayment(paymentId);
    if (summary.isPaid && summary.bookingRef) {
      console.log(
        `[mollie webhook] paid: booking=${summary.bookingRef} payment=${summary.id} amount=€${summary.amountEur.toFixed(2)}`,
      );
      const emailResult = await sendPaymentConfirmation({
        bookingRef: summary.bookingRef,
        amountEur: summary.amountEur,
        paymentId: summary.id,
      }).catch((err: unknown) => ({
        ok: false as const,
        error: err instanceof Error ? err.message : String(err),
      }));
      if (!emailResult.ok) {
        console.error(
          "[mollie webhook] paid-confirmation email failed:",
          emailResult.error,
        );
      }
    } else {
      console.log(
        `[mollie webhook] status=${summary.status} payment=${summary.id} ref=${summary.bookingRef ?? "—"}`,
      );
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[mollie webhook] handler error:", err);
    // 500 makes Mollie retry — appropriate for transient failures
    // (network, Mollie 5xx). Mollie's retry schedule is conservative.
    return new NextResponse("handler error", { status: 500 });
  }
}
