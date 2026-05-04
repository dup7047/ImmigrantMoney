import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "contact"});
  return pageMetadata({
    title: t("title"),
    description: t("intro"),
    locale,
    path: "/contact"
  });
}

export default async function ContactPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "contact"});
  const email = "hello@immigrantmoney.us";

  return (
    <main className="container-pad mx-auto max-w-3xl py-16">
      <h1 className="font-display text-display-2 tracking-tight text-ink-900">{t("title")}</h1>

      <p className="mt-6 text-body-lg text-ink-600">{t("intro")}</p>

      <section className="mt-10 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <p className="text-overline font-semibold uppercase text-brand-700">{t("emailLabel")}</p>
        <a
          className="mt-2 inline-block font-display text-heading-1 font-bold text-brand-600 transition hover:text-brand-700"
          href={`mailto:${email}`}
        >
          {email}
        </a>
        <p className="mt-3 text-caption text-ink-500">{t("response")}</p>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("useTitle")}</h2>
        <ul className="list-inside list-disc space-y-2 text-body text-ink-600">
          <li>{t("useReport")}</li>
          <li>{t("useCorrection")}</li>
          <li>{t("usePartnership")}</li>
          <li>{t("usePrivacy")}</li>
        </ul>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="font-display text-heading-1 tracking-tight text-ink-900">{t("notTitle")}</h2>
        <p className="text-body text-ink-600">{t("notBody")}</p>
      </section>
    </main>
  );
}
