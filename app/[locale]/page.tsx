import type {Metadata} from "next";
import {ArrowRight, Sparkles} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";
import {Blob, Orb} from "@/components/Brand/Ornaments";
import {Button} from "@/components/ui/Button";
import {CategorySection} from "@/components/CategorySection";
import {JourneyTeaser} from "@/components/journey/JourneyTeaser";
import {JsonLd} from "@/components/JsonLd";
import {Link} from "@/i18n/navigation";
import {TrustBadge} from "@/components/TrustBadge";
import {categories} from "@/data/categories";
import {pageMetadata} from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "home"});

  return pageMetadata({
    title: t("headline"),
    description: t("subheadline"),
    locale,
    path: ""
  });
}

export default async function HomePage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale});
  const faqItems = [1, 2, 3, 4, 5, 6].map((index) => ({
    question: t(`home.faq.q${index}`),
    answer: t(`home.faq.a${index}`)
  }));

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }}
      />

      <section className="relative overflow-hidden">
        <Blob className="-left-32 -top-24 h-[480px] w-[480px] opacity-70" />
        <Orb className="right-[-120px] top-12 h-[280px] w-[280px]" tone="accent" />
        <div className="container-pad relative mx-auto grid max-w-7xl gap-10 py-16 md:py-24">
          <div className="grid gap-6 motion-safe:animate-fadeIn lg:max-w-4xl">
            <TrustBadge />
            <h1 className="font-display text-display-2 tracking-tight text-ink-900 md:text-display-1">
              {t("home.headline")}
            </h1>
            <p className="max-w-2xl text-body-lg text-ink-600">{t("home.subheadline")}</p>
            <div className="mt-2 grid gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/start">
                  <Button size="lg">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    {t("home.primaryCta")}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                  href="#tools"
                >
                  {t("home.secondaryCta")}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="text-caption text-ink-500">{t("home.heroQuizHint")}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-white/80 p-5 shadow-card backdrop-blur">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-sm font-bold leading-6 text-brand-900">{t("home.stats")}</p>
          </div>
        </div>
      </section>

      <div id="journey">
        <JourneyTeaser locale={locale} />
      </div>

      <section className="container-pad mx-auto grid max-w-7xl gap-12 pb-20 pt-4" id="tools">
        <div className="max-w-2xl">
          <p className="text-overline font-semibold uppercase text-brand-700">{t("home.toolsEyebrow")}</p>
          <h2 className="mt-1 font-display text-heading-1 tracking-tight text-ink-900 md:text-display-2">
            {t("home.toolsTitle")}
          </h2>
          <p className="mt-2 text-body text-ink-600">{t("home.toolsSubtitle")}</p>
        </div>
        {categories.map((category) => (
          <CategorySection category={category} key={category.key} locale={locale} />
        ))}
      </section>

      <section className="border-y border-ink-200 bg-white">
        <div className="container-pad mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="text-overline font-semibold uppercase text-brand-700">{t("home.aboutEyebrow")}</p>
            <h2 className="mt-1 font-display text-heading-1 tracking-tight text-ink-900 md:text-display-2">
              {t("common.appName")}
            </h2>
            <p className="mt-4 text-body leading-8 text-ink-600">{t("home.seoParagraph")}</p>
          </div>
          <div>
            <h2 className="font-display text-heading-1 text-ink-900">{t("home.faqTitle")}</h2>
            <div className="mt-4 grid gap-3">
              {faqItems.map((item) => (
                <details
                  className="group rounded-xl border border-ink-200 bg-ink-50 p-4 transition open:border-brand-200 open:bg-brand-50/40"
                  key={item.question}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-bold text-ink-900 marker:hidden">
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="mt-0.5 text-brand-600 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-ink-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
