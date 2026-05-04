import {cn} from "@/lib/utils";

// CSS-only soft gradient orb. Replaces an SVG feGaussianBlur version that
// was expensive to rasterize on Chrome. This renders on its own compositor
// layer (translateZ + isolated containment) so it doesn't repaint when the
// page scrolls or hover states change.
export function Blob({className}: {className?: string}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full opacity-60", className)}
      style={{
        background:
          "radial-gradient(circle at 35% 35%, rgba(59,130,246,0.55) 0%, rgba(124,58,237,0.35) 45%, transparent 72%)",
        transform: "translateZ(0)",
        contain: "paint"
      }}
    />
  );
}
