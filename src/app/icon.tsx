import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Interim favicon — terracotta filled circle with a lowercase "e" in bg
 * cream. Held together by Satori via next/og, so no external font load;
 * the fallback neo-grotesk is close enough to the Inter-Tight family
 * we're shipping for now. Swap for a proper mark once commissioned.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#2C4A3E",
            color: "#F7F4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            paddingBottom: 2,
          }}
        >
          e
        </div>
      </div>
    ),
    { ...size },
  );
}
