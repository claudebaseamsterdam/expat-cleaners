import { NextResponse } from "next/server";
import { opsCheck, type OpsCheckRequest } from "@/services/agents";

export const runtime = "nodejs";

/**
 * POST /api/ops-check
 *
 * Asks the Operational Manager agent (via the agent service layer) whether a
 * requested booking slot is operationally feasible. Returns feasibility +
 * optional alternative. The booking page calls this on the Step 2 → Step 3
 * transition before rendering the review.
 */
export async function POST(request: Request) {
  let req: OpsCheckRequest;
  try {
    req = (await request.json()) as OpsCheckRequest;
  } catch {
    return NextResponse.json(
      { feasible: false, reason: "Invalid request" },
      { status: 400 },
    );
  }

  try {
    const res = await opsCheck(req);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      {
        feasible: false,
        reason: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
