import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line no-console
  console.log("[book] request received", JSON.stringify(payload, null, 2));

  return NextResponse.json({
    ok: true,
    ref: `EC-${Date.now().toString(36).toUpperCase()}`,
  });
}
