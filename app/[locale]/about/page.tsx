import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "about"});
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    locale,
    path: "/about"
  });
}

export default async function AboutPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "about"});

  return (
    <main className="container-pad mx-auto max-w-3xl py-16">
      <h1 className="font-display text-display-2 tracking-tight text-ink-900">{t("title")}</h1>

      <p className="mt-6 text-body-lg text-ink-600">{t("intro")}</p>

      <section className="mt-10 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("missionTitle")}</h2>
        <p className="text-body text-ink-600">{t("missionBody")}</p>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("methodologyTitle")}</h2>
        <p className="text-body text-ink-600">{t("methodologyBody")}</p>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("privacyTitle")}</h2>
        <p className="text-body text-ink-600">{t("privacyBody")}</p>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("updatesTitle")}</h2>
        <p className="text-body text-ink-600">{t("updatesBody")}</p>
      </section>
    </main>
  );
}
