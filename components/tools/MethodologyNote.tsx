"use client";

import {ChevronDown} from "lucide-react";
import {useTranslations} from "next-intl";
import type {ReactNode} from "react";

/**
 * Collapsible "How is this calculated?" disclosure rendered at the bottom of
 * each tool's result panel. Body text is per-tool and lives under the
 * `tools.<slug>.methodology` key in messages/*.json. Open the disclosure for
 * a short paragraph explaining the assumptions + sources behind the numbers.
 */
export function MethodologyNote({children}: {children: ReactNode}) {
  const t = useTranslations("common");
  return (
    <details className="group rounded-xl border border-ink-200 bg-ink-50 p-4 text-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink-800 marker:hidden">
        <span>{t("methodologyLabel")}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="mt-3 grid gap-2 leading-6 text-ink-600">{children}</div>
    </details>
  );
}
