import { NextResponse } from "next/server";
import { captureLead } from "@/services/agents";

export const runtime = "nodejs";

/**
 * POST /api/lead — placeholder stub.
 *
 * Intended to hand off leads (e.g. exit-intent form, abandoned booking) to
 * the Ads & Growth agent for attribution + follow-up sequencing.
 * Currently returns a mock ref. Not called by the main booking flow.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  try {
    const result = await captureLead(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
