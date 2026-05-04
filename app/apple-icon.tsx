import {ImageResponse} from "next/og";

// 180×180 Apple touch icon. Same brand mark as app/icon.tsx, larger so it
// looks crisp on iOS home screens / pinned tabs.

export const size = {width: 180, height: 180};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: -4,
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        im
      </div>
    ),
    size
  );
}
