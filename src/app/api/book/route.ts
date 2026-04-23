import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line no-console
  console.log("[book] request received", JSON.stringify(payload, null, 2));

  const ref = `EC-${Date.now().toString(36).toUpperCase()}`;
  return NextResponse.json({ success: true, ref });
}
