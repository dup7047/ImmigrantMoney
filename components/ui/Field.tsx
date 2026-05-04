import {forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes} from "react";
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

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(props, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "min-h-11 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100",
        props.className
      )}
      {...props}
    />
  );
});

/**
 * Currency-aware input. Renders a `$` prefix and an optional unit suffix
 * (e.g. "/ week"). Wraps the standard <Input> so RHF `register()` works
 * unchanged — pass the spread of register() in via `...rest`.
 *
 * Visual treatment matches Input (focus ring, border, sizing) so it can sit
 * next to other Inputs in the same FormGrid without alignment issues.
 */
export const MoneyInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & {unit?: string}>(
  function MoneyInput({unit, className, ...rest}, ref) {
    return (
      <div
        className={cn(
          "flex min-h-11 items-stretch overflow-hidden rounded-lg border border-ink-300 bg-white shadow-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="flex items-center px-3 text-sm font-semibold text-ink-500 bg-ink-50 border-r border-ink-200"
        >
          $
        </span>
        <input
          ref={ref}
          inputMode="decimal"
          type="number"
          {...rest}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
        {unit ? (
          <span className="flex items-center px-3 text-caption font-medium text-ink-500 bg-ink-50 border-l border-ink-200">
            {unit}
          </span>
        ) : null}
      </div>
    );
  }
);

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
