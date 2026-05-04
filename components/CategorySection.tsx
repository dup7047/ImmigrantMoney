import * as Icons from "lucide-react";
import {ArrowRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Category, Locale} from "@/lib/types";
import {Link} from "@/i18n/navigation";
import {ToolCard} from "./ToolCard";
import {getToolsByCategory} from "@/data/categories";
import {cn} from "@/lib/utils";

type IconName = keyof typeof Icons;

const TONE_BG: Record<Category["tone"], string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  positive: "bg-positive-50 text-positive-700 ring-positive-200",
  caution: "bg-caution-50 text-caution-700 ring-caution-200",
  accent: "bg-[#F3EAFF] text-accent-500 ring-brand-100"
};

export async function CategorySection({category, locale}: {category: Category; locale: Locale}) {
  const t = await getTranslations({locale, namespace: "categories"});
  const tools = getToolsByCategory(category.key);
  const Icon = Icons[category.icon as IconName] as Icons.LucideIcon | undefined;

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1",
              TONE_BG[category.tone]
            )}
          >
            {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : null}
          </div>
          <div>
            <h2 className="font-display text-heading-1 tracking-tight text-ink-900">
              {t(`${category.key}.label`)}
            </h2>
            <p className="mt-1 text-body text-ink-600">{t(`${category.key}.description`)}</p>
          </div>
        </div>
        <Link
          className="inline-flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-brand-700 transition hover:text-brand-800"
          href={`/categories/${category.slug}`}
        >
          {t(`${category.key}.label`)}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} locale={locale} tool={tool} />
        ))}
      </div>
    </section>
  );
}
