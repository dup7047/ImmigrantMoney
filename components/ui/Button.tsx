import type {ButtonHTMLAttributes, ReactNode} from "react";
import {cn} from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

export function Button({className, variant = "primary", size = "md", children, ...props}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "min-h-9 px-3 py-1.5 text-caption",
        size === "md" && "min-h-10 px-4 py-2 text-sm",
        size === "lg" && "min-h-12 px-5 py-2.5 text-body",
        variant === "primary" && "bg-brand-600 text-white shadow-card hover:bg-brand-700",
        variant === "secondary" && "border border-ink-300 bg-white text-ink-900 hover:bg-ink-50",
        variant === "ghost" && "text-ink-700 hover:bg-ink-100",
        variant === "danger" && "bg-critical-600 text-white hover:bg-critical-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
