import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {redirect} from "@/i18n/navigation";
import {JourneyResults} from "@/components/journey/JourneyResults";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";
import {
  isGoalKey,
  isPriorityKey,
  isStatusKey,
  recommend,
  type GoalKey,
  type PriorityKey,
  type StatusKey
} from "@/lib/journey/recommend";

type SearchParams = {goal?: string; status?: string; priority?: string};

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "journey.results"});
  return pageMetadata({
    title: t("primaryHeading"),
    description: t("eyebrow"),
    locale,
    path: "/start/results"
  });
}

export default async function ResultsPage({
  params,
  searchParams
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<SearchParams>;
}) {
  const {locale} = await params;
  const {goal, status, priority} = await searchParams;

  if (!isGoalKey(goal) || !isStatusKey(status) || !isPriorityKey(priority)) {
    redirect({href: "/start", locale});
  }

  const answers = {
    goal: goal as GoalKey,
    status: status as StatusKey,
    priority: priority as PriorityKey
  };
  const recommendation = recommend(answers);

  return (
    <main className="container-pad mx-auto max-w-4xl py-12 md:py-16">
      <JourneyResults answers={answers} locale={locale} recommendation={recommendation} />
    </main>
  );
}
