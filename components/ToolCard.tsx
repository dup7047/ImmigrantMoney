import * as Icons from "lucide-react";
import {ArrowRight} from "lucide-react";
import type {Locale, ToolMetadata} from "@/lib/types";
import {Link} from "@/i18n/navigation";

type IconName = keyof typeof Icons;

export function ToolCard({tool, locale}: {tool: ToolMetadata; locale: Locale}) {
  const Icon = Icons[tool.icon as IconName] as Icons.LucideIcon | undefined;

  return (
    <Link
      className="group relative grid min-h-[210px] gap-4 overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-cardHover"
      href={`/tools/${tool.slug}`}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        {Icon ? <Icon className="h-6 w-6" aria-hidden="true" /> : null}
      </div>
      <div className="relative">
        <h2 className="text-heading-3 text-ink-900">{tool.title[locale]}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{tool.shortDescription[locale]}</p>
      </div>
      <span className="relative mt-auto inline-flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-brand-600 transition group-hover:gap-2.5">
        {tool.cta[locale]}
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
