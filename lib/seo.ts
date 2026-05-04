import type {Metadata} from "next";
import type {Locale, ToolMetadata} from "@/lib/types";
import {locales, routing} from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://immigrantmoney.us";

/**
 * Build localized canonical + hreflang alternates.
 * - `canonical` is self-referential (the current locale's URL), so search
 *   engines treat each translated page as its own authoritative version.
 * - `languages` includes every locale + an `x-default` pointing at the
 *   default locale (per Google's hreflang guidance for multilingual sites).
 */
export function localizedAlternates(path: string, locale: Locale) {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((item) => [item, `${siteUrl}/${item}${path}`])
  );
  languages["x-default"] = `${siteUrl}/${routing.defaultLocale}${path}`;

  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages
  };
}

/**
 * Build the OpenGraph image reference for a locale. The actual PNG is
 * generated at request time by `app/[locale]/opengraph-image.tsx` (Satori
 * via `next/og`). We have to reference it explicitly here because Next.js
 * shallow-merges `openGraph` — when a child page sets its own openGraph,
 * the parent layout's auto-injected `openGraph.images` is wiped out.
 */
function ogImageRef(locale: Locale, alt: string) {
  return {
    url: `${siteUrl}/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
    alt
  };
}

const twitterDefaults = {
  card: "summary_large_image" as const
};

export function toolMetadata(tool: ToolMetadata, locale: Locale): Metadata {
  const path = `/tools/${tool.slug}`;
  const url = `${siteUrl}/${locale}${path}`;
  const ogImage = ogImageRef(locale, tool.title[locale]);

  return {
    title: tool.seoTitle[locale],
    description: tool.metaDescription[locale],
    alternates: localizedAlternates(path, locale),
    openGraph: {
      title: tool.seoTitle[locale],
      description: tool.metaDescription[locale],
      type: "website",
      url,
      siteName: "ImmigrantMoney",
      locale,
      images: [ogImage]
    },
    twitter: {
      ...twitterDefaults,
      title: tool.seoTitle[locale],
      description: tool.metaDescription[locale],
      images: [ogImage.url]
    }
  };
}

export function pageMetadata({
  title,
  description,
  locale,
  path
}: {
  title: string;
  description: string;
  locale: Locale;
  path: string;
}): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  const ogImage = ogImageRef(locale, title);

  return {
    title,
    description,
    alternates: localizedAlternates(path, locale),
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "ImmigrantMoney",
      locale,
      images: [ogImage]
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
      images: [ogImage.url]
    }
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c")
  };
}
