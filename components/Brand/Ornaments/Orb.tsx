import {cn} from "@/lib/utils";

const TONE_GRADIENTS = {
  brand: "radial-gradient(circle, rgba(96,165,250,0.45) 0%, rgba(29,78,216,0) 70%)",
  accent: "radial-gradient(circle, rgba(167,139,250,0.50) 0%, rgba(124,58,237,0) 70%)",
  positive: "radial-gradient(circle, rgba(52,211,153,0.45) 0%, rgba(5,150,105,0) 70%)"
} as const;

// CSS-only orb. Replaced earlier SVG radialGradient version that triggered
// per-frame paints on Chrome. Compositor-promoted via translateZ + paint
// containment so scroll & hover don't repaint it.
export function Orb({className, tone = "brand"}: {className?: string; tone?: keyof typeof TONE_GRADIENTS}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        background: TONE_GRADIENTS[tone],
        transform: "translateZ(0)",
        contain: "paint"
      }}
    />
  );
}
