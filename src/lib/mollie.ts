import "server-only";
import createMollieClient, {
  PaymentStatus,
  type MollieClient,
  type Payment,
} from "@mollie/api-client";

const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;

let cachedClient: MollieClient | null = null;

function getClient(): MollieClient {
  if (!MOLLIE_API_KEY) {
    throw new Error("MOLLIE_API_KEY is not set");
  }
  if (!cachedClient) {
    cachedClient = createMollieClient({ apiKey: MOLLIE_API_KEY });
  }
  return cachedClient;
}

function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  return url.replace(/\/$/, "");
}

/** Format a number as a Mollie-acceptable amount string (always 2 decimals). */
export function formatAmount(amountEur: number): string {
  if (!Number.isFinite(amountEur) || amountEur <= 0) {
    throw new Error(`Invalid amount: ${amountEur}`);
  }
  return amountEur.toFixed(2);
}

export type CreatedPayment = {
  paymentId: string;
  checkoutUrl: string;
};

/**
 * Create a Mollie payment for a booking. Caller passes a server-trusted
 * total (never the client's number). Returns the Mollie payment id and
 * the hosted-checkout URL the user should be redirected to.
 *
 * Webhook + redirect targets are derived from NEXT_PUBLIC_SITE_URL so
 * preview deploys work without extra config.
 */
export async function createBookingPayment(args: {
  bookingRef: string;
  amountEur: number;
  customerName?: string;
  metadata?: Record<string, string | number | undefined>;
}): Promise<CreatedPayment> {
  const { bookingRef, amountEur, customerName, metadata } = args;
  const client = getClient();
  const base = siteUrl();
  const description = customerName
    ? `ExpatCleaners booking ${bookingRef} — ${customerName}`
    : `ExpatCleaners booking ${bookingRef}`;

  const payment: Payment = await client.payments.create({
    amount: { currency: "EUR", value: formatAmount(amountEur) },
    description,
    redirectUrl: `${base}/thank-you?ref=${encodeURIComponent(bookingRef)}&payment=pending`,
    webhookUrl: `${base}/api/mollie/webhook`,
    metadata: { bookingRef, ...metadata },
  });

  // Bake the payment id into the redirect so /thank-you can verify the
  // status against Mollie directly (we never trust the redirect alone).
  // PATCHing after create is intentional — at create time we don't yet
  // know the id Mollie will assign.
  try {
    await client.payments.update(payment.id, {
      redirectUrl: `${base}/thank-you?ref=${encodeURIComponent(bookingRef)}&payment=pending&id=${encodeURIComponent(payment.id)}`,
    });
  } catch (err) {
    // Non-fatal: redirect still lands on /thank-you with bookingRef and
    // shows the "we're confirming" copy; the webhook is still authoritative.
    console.warn("[mollie] could not patch redirectUrl with id:", err);
  }

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    throw new Error("Mollie did not return a checkout URL");
  }
  return { paymentId: payment.id, checkoutUrl };
}

export type PaymentStatusSummary = {
  id: string;
  status: Payment["status"];
  isPaid: boolean;
  amountEur: number;
  bookingRef: string | null;
  metadata: Record<string, unknown> | null;
};

/** Fetch a payment from Mollie. Source of truth for paid/unpaid. */
export async function getBookingPayment(
  paymentId: string,
): Promise<PaymentStatusSummary> {
  const client = getClient();
  const payment = await client.payments.get(paymentId);
  const meta = (payment.metadata ?? null) as Record<string, unknown> | null;
  const bookingRef =
    meta && typeof meta === "object" && typeof meta.bookingRef === "string"
      ? meta.bookingRef
      : null;
  const value = Number.parseFloat(payment.amount?.value ?? "0");
  return {
    id: payment.id,
    status: payment.status,
    isPaid: payment.status === PaymentStatus.paid,
    amountEur: Number.isFinite(value) ? value : 0,
    bookingRef,
    metadata: meta,
  };
}
