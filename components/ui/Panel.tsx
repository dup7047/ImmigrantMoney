import type {HTMLAttributes, ReactNode} from "react";
import {cn} from "@/lib/utils";

export function Panel({className, children, ...props}: HTMLAttributes<HTMLDivElement> & {children: ReactNode}) {
  return (
    <div
      className={cn("rounded-xl border border-ink-200 bg-white p-5 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
      <div className="text-overline font-semibold uppercase text-ink-500">{label}</div>
      <div
        className={cn(
          "mt-1 text-heading-1",
          tone === "default" && "text-ink-900",
          tone === "success" && "text-positive-700",
          tone === "warning" && "text-caution-700",
          tone === "danger" && "text-critical-600"
        )}
      >
        {value}
      </div>
    </div>
  );
}
