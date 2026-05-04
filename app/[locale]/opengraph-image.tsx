import {ImageResponse} from "next/og";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";

export const alt = "ImmigrantMoney — Free financial tools for immigrants";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

// Brand colors (mirror tailwind.config.ts brand palette)
const BRAND_600 = "#1D4ED8";
const BRAND_900 = "#172554";
const ACCENT = "#7C3AED";

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  const tHome = await getTranslations({locale, namespace: "home"});
  const tNav = await getTranslations({locale, namespace: "nav"});

  // Pull the localized headline + subheadline from messages so the OG image
  // matches the locale of the page that's being shared.
  const headline = tHome("headline");
  const tagline = tHome("subheadline");
  const startLabel = tNav("start");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: `linear-gradient(135deg, ${BRAND_600} 0%, ${BRAND_900} 100%)`,
          color: "white",
          fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative orb (top-right) */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT}55 0%, transparent 70%)`,
            display: "flex"
          }}
        />
        {/* Decorative orb (bottom-left) */}
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: `radial-gradient(circle, #3B82F666 0%, transparent 70%)`,
            display: "flex"
          }}
        />

        {/* Logo row */}
        <div style={{display: "flex", alignItems: "center", gap: 18, position: "relative"}}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "rgba(255,255,255,0.14)",
              border: "2px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -2,
              color: "white"
            }}
          >
            im
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -1.2,
              color: "white"
            }}
          >
            ImmigrantMoney
          </div>
        </div>

        {/* Headline */}
        <div style={{display: "flex", flexDirection: "column", gap: 24, position: "relative", maxWidth: 980}}>
          <div
            style={{
              fontSize: headline.length > 40 ? 72 : 88,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2,
              color: "white"
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.82)",
              fontWeight: 500
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Footer chips */}
        <div style={{display: "flex", alignItems: "center", gap: 14, position: "relative"}}>
          {[startLabel + " →", "EN · ES · ZH", "Free", "No signup"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "white",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: -0.2
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
