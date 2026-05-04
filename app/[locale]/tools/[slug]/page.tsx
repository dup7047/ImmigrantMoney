import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {JsonLd} from "@/components/JsonLd";
import {ToolLayout} from "@/components/ToolLayout";
import {ToolRenderer} from "@/components/tools/ToolRenderer";
import {getToolMetadata, toolsMetadata} from "@/data/tools-metadata";
import {locales} from "@/i18n/routing";
import type {Locale, ToolSlug} from "@/lib/types";
import {toolMetadata} from "@/lib/seo";

export function generateStaticParams() {
  return toolsMetadata.flatMap((tool) => locales.map((locale) => ({locale, slug: tool.slug})));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const tool = getToolMetadata(slug);

  if (!tool) {
    return {};
  }

  return toolMetadata(tool, locale);
}

export default async function ToolPage({params}: {params: Promise<{locale: Locale; slug: ToolSlug}>}) {
  const {locale, slug} = await params;
  const tool = getToolMetadata(slug);
  const t = await getTranslations({locale});

  if (!tool) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://immigrantmoney.us";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.title[locale],
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: `${siteUrl}/${locale}/tools/${tool.slug}`,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          inLanguage: locale,
          description: tool.metaDescription[locale]
        }}
      />
      <ToolLayout
        labels={{
          home: t("toolLayout.breadcrumbHome"),
          related: t("toolLayout.related"),
          sources: t("common.sources"),
          lastReviewed: t("common.lastReviewed"),
          sourceIntro: t("toolLayout.sourcesIntro")
        }}
        locale={locale}
        tool={tool}
      >
        <ToolRenderer slug={tool.slug} />
      </ToolLayout>
    </>
  );
}
