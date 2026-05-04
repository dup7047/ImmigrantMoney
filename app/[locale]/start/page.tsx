import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {JourneyIntake} from "@/components/journey/JourneyIntake";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";
import {isGoalKey} from "@/lib/journey/recommend";

type SearchParams = {goal?: string};

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "journey.intake"});
  return pageMetadata({
    title: t("title"),
    description: t("subtitle"),
    locale,
    path: "/start"
  });
}

export default async function StartPage({
  params,
  searchParams
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<SearchParams>;
}) {
  const {locale} = await params;
  const {goal} = await searchParams;
  const t = await getTranslations({locale, namespace: "journey.intake"});

  const initial = isGoalKey(goal) ? {goal} : undefined;

  return (
    <main className="container-pad mx-auto max-w-3xl py-12 md:py-16">
      <header className="mb-8 grid gap-3">
        <h1 className="font-display text-display-2 tracking-tight text-ink-900">{t("title")}</h1>
        <p className="text-body-lg text-ink-600">{t("subtitle")}</p>
      </header>
      <JourneyIntake initial={initial} />
    </main>
  );
}
