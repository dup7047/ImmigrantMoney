import type {Metadata} from "next";
import {ArrowLeft} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {notFound} from "next/navigation";
import {Link} from "@/i18n/navigation";
import {ToolCard} from "@/components/ToolCard";
import {categories, getCategoryBySlug, getToolsByCategory} from "@/data/categories";
import type {Locale} from "@/lib/types";
import {pageMetadata} from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({slug: category.slug}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const t = await getTranslations({locale, namespace: "categories"});

  return pageMetadata({
    title: t(`${category.key}.label`),
    description: t(`${category.key}.description`),
    locale,
    path: `/categories/${slug}`
  });
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}) {
  const {locale, slug} = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const t = await getTranslations({locale});
  const tools = getToolsByCategory(category.key);

  return (
    <main className="container-pad mx-auto grid max-w-7xl gap-10 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-caption font-semibold text-ink-500">
        <Link className="inline-flex items-center gap-1 transition hover:text-brand-700" href="/">
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          {t("toolLayout.breadcrumbHome")}
        </Link>
      </nav>

      <header className="grid max-w-3xl gap-3">
        <p className="text-overline font-semibold uppercase text-brand-700">{t("categoryPage.eyebrow")}</p>
        <h1 className="font-display text-display-2 tracking-tight text-ink-900 md:text-display-1">
          {t(`categories.${category.key}.label`)}
        </h1>
        <p className="text-body-lg text-ink-600">{t(`categories.${category.key}.description`)}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} locale={locale} tool={tool} />
        ))}
      </div>

      <div className="border-t border-ink-200 pt-6">
        <Link className="text-caption font-bold uppercase tracking-wide text-brand-700 hover:text-brand-800" href="/#tools">
          {t("nav.allTools")} →
        </Link>
      </div>
    </main>
  );
}
