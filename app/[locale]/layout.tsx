import type {Metadata} from "next";
import Script from "next/script";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import type {ReactNode} from "react";
import {routing, type Locale} from "@/i18n/routing";
import {Footer} from "@/components/Footer";
import {Header} from "@/components/Header";
import {JsonLd} from "@/components/JsonLd";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  title: "ImmigrantMoney"
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({locale, namespace: "nav"});
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://immigrantmoney.example";
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ImmigrantMoney",
          url: siteUrl,
          inLanguage: [...routing.locales],
          sameAs: []
        }}
      />
      {plausibleDomain ? (
        <Script data-domain={plausibleDomain} defer src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      ) : null}
      <div lang={locale as Locale} className="flex min-h-screen flex-col">
        <a className="skip-link" href="#content">{t("skipToContent")}</a>
        <Header />
        <div className="flex-1" id="content">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
