import { NextResponse } from "next/server";
import { financeReport } from "@/services/agents";

export const runtime = "nodejs";

/**
 * POST /api/finance-report — placeholder stub.
 *
 * Intended for internal dashboards to pull a formatted snapshot from the
 * Admin & Finance agent. Not yet called by the frontend booking flow.
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
    const result = await financeReport(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
