import {cn} from "@/lib/utils";

export function Orb({className, tone = "brand"}: {className?: string; tone?: "brand" | "accent" | "positive"}) {
  const stops =
    tone === "accent"
      ? {from: "#A78BFA", to: "#7C3AED"}
      : tone === "positive"
        ? {from: "#34D399", to: "#059669"}
        : {from: "#60A5FA", to: "#1D4ED8"};

  return (
    <svg
      aria-hidden="true"
      className={cn("absolute pointer-events-none", className)}
      fill="none"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="120" cy="120" fill="url(#orb-gradient)" r="110" />
      <defs>
        <radialGradient cx="0" cy="0" gradientTransform="translate(60 60) scale(180)" gradientUnits="userSpaceOnUse" id="orb-gradient" r="1">
          <stop stopColor={stops.from} stopOpacity=".6" />
          <stop offset="1" stopColor={stops.to} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
