import {cn} from "@/lib/utils";

type LogoProps = {
  size?: number;
  className?: string;
  withWordmark?: boolean;
};

export function LogoMark({size = 32, className}: {size?: number; className?: string}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className)}
      fill="none"
      height={size}
      viewBox="0 0 40 40"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="url(#logo-gradient)" height="40" rx="11" width="40" />
      <path
        d="M11 28V14.4c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4V28h-2.8Zm0-18.6a1.7 1.7 0 1 1 3.4 0 1.7 1.7 0 0 1-3.4 0Z"
        fill="#fff"
      />
      <path
        d="M18 28V18.4c0-.8.6-1.4 1.4-1.4.7 0 1.3.4 1.4 1l.1.7c.6-1.2 1.7-1.9 3.1-1.9 1.5 0 2.6.7 3.1 2 .7-1.3 1.9-2 3.4-2 2.4 0 3.9 1.5 3.9 4.1V28h-2.8v-6.4c0-1.4-.7-2.2-1.9-2.2-1.3 0-2 .9-2 2.4V28h-2.8v-6.4c0-1.4-.7-2.2-1.9-2.2-1.3 0-2 .9-2 2.4V28H18Z"
        fill="#fff"
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="logo-gradient" x1="0" x2="40" y1="0" y2="40">
          <stop stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({size = 32, className, withWordmark = true}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="font-display text-[1.125rem] font-bold tracking-tight text-ink-900 sm:text-[1.25rem]">
          ImmigrantMoney
        </span>
      ) : null}
    </span>
  );
}
