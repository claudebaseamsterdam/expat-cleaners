import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — scaled version of the interim terracotta "e" mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F4EE",
        }}
      >
        <div
          style={{
            width: 156,
            height: 156,
            borderRadius: "50%",
            background: "#2C4A3E",
            color: "#F7F4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 108,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            paddingBottom: 8,
          }}
        >
          e
        </div>
      </div>
    ),
    { ...size },
  );
}
