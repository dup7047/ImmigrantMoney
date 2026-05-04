"use client";

import {Info} from "lucide-react";
import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

/**
 * Inline jargon glossary. Renders an info icon next to a label; clicking it
 * opens a small popover with a 1–2 sentence definition of the term.
 *
 * Example:
 *   <HelpTip ariaLabel="What is ITIN?">
 *     ITIN = Individual Taxpayer Identification Number, issued by the IRS to
 *     people who don't have a Social Security Number but need to file taxes.
 *   </HelpTip>
 *
 * Uses native <details>/<summary> so it works without JS, is keyboard
 * accessible by default, and won't leak click handlers to React Server
 * Components (this is a "use client" island only).
 */
export function HelpTip({
  ariaLabel,
  children,
  className
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("relative inline-block align-middle", className)}>
      <summary
        aria-label={ariaLabel}
        className="inline-flex cursor-help items-center justify-center rounded-full p-0.5 text-ink-400 outline-none list-none marker:hidden hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <Info aria-hidden="true" className="h-3.5 w-3.5" />
      </summary>
      <div
        role="tooltip"
        className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-ink-200 bg-white p-3 text-sm font-normal leading-5 text-ink-700 shadow-card"
      >
        {children}
      </div>
    </details>
  );
}
