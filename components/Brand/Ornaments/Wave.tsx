import {cn} from "@/lib/utils";

export function Wave({className}: {className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1440 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 40c180-32 360-32 540 0s360 32 540 0 360-32 540 0v40H0Z"
        fill="url(#wave-gradient)"
        opacity=".4"
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="wave-gradient" x1="0" x2="1440" y1="40" y2="40">
          <stop stopColor="#DBEAFE" />
          <stop offset=".5" stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
