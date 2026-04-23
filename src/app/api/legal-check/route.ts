import { NextResponse } from "next/server";
import { legalCheck } from "@/services/agents";

export const runtime = "nodejs";

/**
 * POST /api/legal-check — placeholder stub.
 *
 * Intended for internal use (hiring workflow, contract review) to ask the
 * Legal agent for a NL-compliance risk read. Not called by the booking flow.
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
    const result = await legalCheck(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
