import type {InputHTMLAttributes, ReactNode, SelectHTMLAttributes} from "react";
import {cn} from "@/lib/utils";

type FieldShellProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FieldShell({label, error, hint, children}: FieldShellProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink-800">
      <span>{label}</span>
      {children}
      {hint && !error ? <span className="text-caption font-normal text-ink-500">{hint}</span> : null}
      {error ? <span className="text-caption font-medium text-critical-600">{error}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
        props.className
      )}
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
        props.className
      )}
      {...props}
    />
  );
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {label: string}) {
  return (
    <label className="flex items-start gap-2 text-sm font-medium text-ink-700">
      <input
        className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
        type="checkbox"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
