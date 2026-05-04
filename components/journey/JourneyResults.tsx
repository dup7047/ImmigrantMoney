import * as Icons from "lucide-react";
import {ArrowRight, RotateCcw} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/Button";
import {Link} from "@/i18n/navigation";
import {ToolCard} from "@/components/ToolCard";
import {getCategory} from "@/data/categories";
import {getToolMetadata} from "@/data/tools-metadata";
import type {JourneyAnswers, JourneyRecommendation} from "@/lib/journey/recommend";
import type {Locale} from "@/lib/types";
import {cn} from "@/lib/utils";

type IconName = keyof typeof Icons;

const TONE_BG = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  positive: "bg-positive-50 text-positive-700 ring-positive-200",
  caution: "bg-caution-50 text-caution-700 ring-caution-200",
  accent: "bg-[#F3EAFF] text-accent-500 ring-brand-100"
} as const;

export async function JourneyResults({
  answers,
  recommendation,
  locale
}: {
  answers: JourneyAnswers;
  recommendation: JourneyRecommendation;
  locale: Locale;
}) {
  const t = await getTranslations({locale});
  const primary = getToolMetadata(recommendation.primary);
  const secondaryTools = recommendation.secondary
    .map((slug) => getToolMetadata(slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
  const category = getCategory(recommendation.categoryKey);
  const PrimaryIcon = primary
    ? (Icons[primary.icon as IconName] as Icons.LucideIcon | undefined)
    : undefined;

  if (!primary) return null;

  return (
    <div className="grid gap-10">
      <header className="grid gap-3">
        <p className="text-overline font-semibold uppercase text-brand-700">{t("journey.results.eyebrow")}</p>
        <h1 className="font-display text-display-2 tracking-tight text-ink-900">
          {t("journey.results.primaryHeading")}
        </h1>
      </header>

      <article className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-card md:p-8">
        <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl ring-1",
              category ? TONE_BG[category.tone] : TONE_BG.brand
            )}
          >
            {PrimaryIcon ? <PrimaryIcon aria-hidden="true" className="h-7 w-7" /> : null}
          </div>
          <div className="grid gap-3">
            <h2 className="font-display text-heading-1 tracking-tight text-ink-900 md:text-display-2">
              {primary.title[locale]}
            </h2>
            <p className="text-body text-ink-600">{primary.evidence[locale]}</p>
            <div>
              <Link href={`/tools/${primary.slug}`}>
                <Button size="lg">
                  {primary.cta[locale]}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="grid gap-3 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <h3 className="text-heading-3 text-ink-900">{t("journey.results.whyHeading")}</h3>
        <p className="text-body text-ink-600">{t(`journey.rationale.${recommendation.rationaleKey}`)}</p>
        <dl className="mt-2 grid gap-2 text-caption text-ink-500 sm:grid-cols-3">
          <div>
            <dt className="font-semibold uppercase tracking-wide text-ink-500">{t("journey.intake.q1.label")}</dt>
            <dd className="text-ink-800">{t(`journey.intake.q1.options.${answers.goal}`)}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-ink-500">{t("journey.intake.q2.label")}</dt>
            <dd className="text-ink-800">{t(`journey.intake.q2.options.${answers.status}`)}</dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wide text-ink-500">{t("journey.intake.q3.label")}</dt>
            <dd className="text-ink-800">{t(`journey.intake.q3.options.${answers.priority}`)}</dd>
          </div>
        </dl>
      </section>

      {secondaryTools.length > 0 ? (
        <section className="grid gap-4">
          <h3 className="text-heading-2 text-ink-900">{t("journey.results.secondaryHeading")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {secondaryTools.map((tool) => (
              <ToolCard key={tool.slug} locale={locale} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <footer className="flex flex-wrap items-center gap-3 border-t border-ink-200 pt-6">
        <Link href="/start">
          <Button size="md" variant="secondary">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            {t("journey.results.restart")}
          </Button>
        </Link>
        <Link className="text-caption font-bold uppercase tracking-wide text-brand-700 hover:text-brand-800" href="/#tools">
          {t("journey.results.browseAll")} →
        </Link>
      </footer>
    </div>
  );
}
