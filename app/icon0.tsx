import {ImageResponse} from "next/og";

// Mirror of <LogoMark /> rendered as a 32×32 PNG favicon. The wordmark + glyph
// design lives in components/Brand/Logo.tsx; keep the gradient and corner
// radius in sync if you tweak the brand mark.

export const size = {width: 32, height: 32};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        im
      </div>
    ),
    size
  );
}
