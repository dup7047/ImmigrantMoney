import {ArrowRight, ClipboardList, Lightbulb, Sparkles, Wrench} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";
import type {GoalKey} from "@/lib/journey/recommend";
import {Button} from "@/components/ui/Button";
import {Link} from "@/i18n/navigation";
import {ChoiceCard} from "./ChoiceCard";

type Card = {
  key: "paycheck" | "send" | "filing";
  goal: GoalKey;
  icon: string;
  tone: "brand" | "positive" | "caution" | "accent";
};

const CARDS: Card[] = [
  {key: "paycheck", goal: "protectPay", icon: "ReceiptText", tone: "brand"},
  {key: "send", goal: "sendMoney", icon: "Send", tone: "accent"},
  {key: "filing", goal: "usciTaxes", icon: "Landmark", tone: "caution"}
];

const STEPS = [
  {key: "step1", icon: ClipboardList},
  {key: "step2", icon: Lightbulb},
  {key: "step3", icon: Wrench}
] as const;

export async function JourneyTeaser({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "journey"});

  return (
    <section className="container-pad mx-auto max-w-7xl pb-12 pt-4">
      <div className="overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-card md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="grid gap-4">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-overline font-semibold uppercase text-brand-700">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              {t("teaserEyebrow")}
            </p>
            <h2 className="font-display text-display-2 tracking-tight text-ink-900">
              {t("teaserTitle")}
            </h2>
            <p className="text-body-lg text-ink-600">{t("teaserSubtitle")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link href="/start">
                <Button size="lg">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  {t("startCta")}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <ol className="grid gap-3" aria-label={t("howItWorks.label")}>
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-card"
                  key={step.key}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-overline font-semibold uppercase text-brand-700">
                      {t("howItWorks.label")} · {index + 1}
                    </p>
                    <p className="text-sm font-bold leading-6 text-ink-900">
                      {t(`howItWorks.${step.key}`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-10 grid gap-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-ink-500">{t("orPickPrompt")}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {CARDS.map((card) => (
            <ChoiceCard
              href={`/start?goal=${card.goal}`}
              icon={card.icon}
              key={card.key}
              subtitle={t(`cards.${card.key}.subtitle`)}
              title={t(`cards.${card.key}.title`)}
              tone={card.tone}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
