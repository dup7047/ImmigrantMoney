import {cn} from "@/lib/utils";

export function Blob({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("absolute pointer-events-none", className)}
      fill="none"
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#blob-blur)">
        <path
          d="M361 102c41 35 71 87 64 137-7 50-50 98-100 122-49 23-104 24-152 2-49-22-91-67-101-119-9-52 17-110 60-148 43-39 105-58 161-43 22 6 49 22 68 49Z"
          fill="url(#blob-gradient)"
          opacity=".55"
        />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="blob-gradient" x1="40" x2="440" y1="60" y2="420">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="500" id="blob-blur" width="500" x="-10" y="-10">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
    </svg>
  );
}
