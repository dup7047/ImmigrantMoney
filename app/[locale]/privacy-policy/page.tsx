import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "legal"});
  return pageMetadata({
    title: t("privacyTitle"),
    description: t("privacyBody").slice(0, 150),
    locale,
    path: "/privacy-policy"
  });
}

export default async function PrivacyPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "legal"});

  return (
    <main className="container-pad mx-auto max-w-3xl py-16">
      <h1 className="font-display text-display-2 tracking-tight text-ink-900">{t("privacyTitle")}</h1>
      <p className="mt-6 text-body-lg text-ink-600">{t("privacyBody")}</p>
    </main>
  );
}
